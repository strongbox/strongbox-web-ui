import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    forwardRef,
    Input,
    OnDestroy,
    Output,
    ViewChild
} from '@angular/core';
import {AbstractControl, ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';
import {BehaviorSubject, combineLatest, EMPTY, interval, Observable, of, Subject, timer} from 'rxjs';
import {debounce, delayWhen, distinctUntilChanged, filter, startWith, switchMap, take, takeUntil} from 'rxjs/operators';
import {MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger} from '@angular/material';

import {AutocompleteOption, AutocompleteSelectFunction, InputCursorPosition} from '../autocomplete.model';
import {AqlSuggestion} from '../../services/aql-autocomplete.service';
import {AqlAutocompleteDataSource} from './aql-autocomplete.data-source';

/* tslint:disable:component-selector */
@Component({
    selector: 'aql-autocomplete',
    templateUrl: './aql-autocomplete.component.html',
    styleUrls: ['./aql-autocomplete.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => AqlAutocompleteComponent),
            multi: true
        }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AqlAutocompleteComponent implements ControlValueAccessor, AfterViewInit, OnDestroy {

    // tslint:enable:semicolon
    constructor() {
    }

    @Input() placeholder: string;
    @Input() floatLabel: 'auto' | 'always' | 'never' = 'auto';
    @Input() debounceTime = 300;
    @Input() width = '';
    @Input() panelWidth = '10%';
    @Input() autoActiveFirstOption = false;
    @Input() selectionFunc: AutocompleteSelectFunction = AqlAutocompleteComponent.defaultSelectionFunc;
    @Input() dataSource: AqlAutocompleteDataSource = null;
    @Input() searchControl: AbstractControl = new FormControl();
    @Output() submit: EventEmitter<string> = new EventEmitter<string>();

    loading: Observable<boolean>;
    options: Observable<AutocompleteOption<AqlSuggestion>[]>;

    @ViewChild('searchInput', {read: ElementRef})
    private searchInput: ElementRef;

    /**
     * Prevent submit when the autocomplete panel is open (i.e. we have just selected an option)
     */
    public preventSubmitEmission = false;

    @ViewChild('autoCompleteRef', {read: MatAutocomplete})
    private autocomplete: MatAutocomplete;

    @ViewChild('searchInput', {read: MatAutocompleteTrigger})
    private autocompleteTrigger: MatAutocompleteTrigger;

    /**
     * Input cursor position
     */
    private inputCursorPosition: BehaviorSubject<InputCursorPosition> = new BehaviorSubject({start: 0, end: 0});

    /**
     * Text width calculation
     */
    private canvas: any = document.createElement('canvas');

    /**
     * Current search input value
     */
    private currentInputValue: any = '';

    /**
     * destroy.
     */
    private destroy = new Subject();

    // tslint:disable:semicolon
    static defaultSelectionFunc = (data: string | AqlSuggestion | null) => {
        let result = '';

        if (typeof data === 'string') {
            result = data;
        } else if (typeof data === 'object' && data !== null) {
            result = data.value;
            if (data.type === 'keyword') {
                result += ':';
            }
        }

        return result;
    };

    onChange = (_: any) => {
    };

    onTouched = () => {
    };

    displayWith = (data: string | AutocompleteOption<AqlSuggestion> | null) => {
        let displayValue = '';

        if (data !== null && data !== '') {
            let selectedValue = this.selectionFunc(data);

            let inputValue = this.searchControl.value;

            // append / replace the selection at the position where the cursor currently is.
            const cursor = this.inputCursorPosition.getValue();

            // start/end depend on the selection direction.
            const start = cursor.start < cursor.end ? cursor.start : cursor.end;
            const end = cursor.end > cursor.start ? cursor.end : cursor.start;

            const beginning = inputValue.substring(0, start);

            // calculate input value
            if (start !== end) {
                inputValue = beginning + selectedValue + inputValue.substring(end);
            } else {
                // We need to calculate how many letters we need to go back so we can replace the search string.
                // For example, if we start writing "some long search string lay", the autocomplete should suggest
                // "layout". When we select it from the list, it should replace "lay" with "layout".
                const replaceString = beginning.split(/\s+/gi).splice(-1)[0].length;
                inputValue = beginning.substr(0, start - replaceString) + selectedValue + inputValue.substr(end);
            }

            // set displayValue with the calculated input value
            displayValue = inputValue;

            // set cursor position
            this.searchInput.nativeElement.selectionStart = (beginning + selectedValue).length;
        }

        return displayValue;
    };

    ngAfterViewInit(): void {
        // Subscribe to the data source
        this.options = this.dataSource !== null ? this.dataSource.connect() : of([]);

        // Track and Write input changes.
        this._inputChanges();

        // Search/filter autocomplete list
        this._inputSearchSubscriber();

        // Necessary to prevent emitting submit event when selecting from an autocomplete option.
        this._preventSubmitOnOptionSelection();

        // Move the autocomplete panel while typing to simulate real IDE like autocomplete.
        this._movePanel();

        // Handle option selection
        this._handleOptionSelection();
    }

    ngOnDestroy(): void {
        this.canvas = null;
        this.destroy.next();
        this.destroy.complete();

        if (this.dataSource) {
            this.dataSource.disconnect();
        }
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        if (isDisabled) {
            this.searchControl.disable();
        } else {
            this.searchControl.enable();
        }
    }

    writeValue(value: any): void {
        // Angular sometimes writes a value that didn't really change.
        if (value !== this.currentInputValue && !this.searchControl.disabled) {
            this.currentInputValue = value;
            this.onChange(value);
            this.onTouched();
        }
    }

    /**
     * Monitor mouse clicks and keyboard events and record current input cursor position.
     *
     * NOTE: Do not use the events below as they only works properly in chrome.
     * @@HostListener('document:selectionchange', ['$event'])
     * @@HostListener('document:selectionstart', ['$event'])
     *
     * @param event
     * @private
     */
    _inputCursorPositionTracking(event: Event | KeyboardEvent) {
        // We need to track the input cursor's position to know where to append the selected option in the input.
        const selection = this.getInputCursorPosition();
        this.inputCursorPosition.next(selection);

        if (!(event instanceof KeyboardEvent) && !this.autocomplete.isOpen) {
            this.autocompleteTrigger.openPanel();
        }
    }

    /**
     * Track input changes and write the value when it changes.
     * @private
     */
    _inputChanges() {
        this.searchControl.valueChanges.pipe(
            startWith(this.searchControl.value),
            distinctUntilChanged(),
            debounce(search => {
                // Typing into input sends strings.
                if (typeof search === 'string') {
                    return timer(this.debounceTime);
                }
                return EMPTY; // immediate - no debounce for choosing from the list
            }),
            takeUntil(this.destroy)
        ).subscribe((val) => {
            this.writeValue(val);
        });
    }

    /**
     * Search the dataSource based on the input search changes.
     * @private
     */
    _inputSearchSubscriber() {
        this.searchControl.valueChanges.pipe(
            filter(() => !this.searchControl.disabled),
            filter(v => typeof v === 'string'),
            takeUntil(this.destroy)
        ).subscribe((term) => {
            // search/filter
            this.dataSource
                .search(term, this.getInputCursorPosition())
                .pipe(take(1))
                .subscribe((options: AutocompleteOption<AqlSuggestion>[]) => {
                    // console.log('dataSource results:', options);
                    // https://github.com/angular/material2/issues/13650
                    if (options.length < 1) {
                        if (this.autocomplete.isOpen) {
                            this.autocompleteTrigger.closePanel();
                        }
                    } else {
                        if (!this.autocomplete.isOpen) {
                            this.autocomplete.opened.emit();
                        }
                    }
                });
        });
    }

    /**
     * move the panel while typing.
     * @private
     */
    _movePanel() {
        combineLatest(
            this.searchControl.valueChanges,
            this.inputCursorPosition
        ).pipe(
            startWith(<SearchAndCursorData>{search: '', cursor: null}),
            switchMap((v) => {
                v[1] = this.getInputCursorPosition();
                return of({search: v[0], cursor: v[1]});
            }),
            filter(() => !this.searchControl.disabled),
            filter((data) => data.search === '' || typeof data.search === 'string'),
            distinctUntilChanged(),
            takeUntil(this.destroy)
        ).subscribe((data: SearchAndCursorData) => {
            if (this.autocomplete.panel) {
                const cursorValue = data.search.substr(0, data.cursor.start);
                const textWidth = this._getTextWidth(cursorValue);

                // this offset is necessary to properly align the autocomplete panel under the cursor.
                const letterOffset = textWidth.width / (textWidth.fontSizeNumber + 15);
                // this offset is for the prefix icon.
                const prefixOffset = 35;

                let position = textWidth.width + letterOffset + prefixOffset;
                const maxWidth = this.searchInput.nativeElement.clientWidth;
                const panelWidth = this.autocomplete.panel.nativeElement.clientWidth;

                // Don't push the panel outside the container.
                if (position + panelWidth > maxWidth) {
                    position = maxWidth - panelWidth;
                }

                this.autocomplete.panel.nativeElement.style.left = position + 'px';
            }
        });
    }

    /**
     * This is necessary to prevent emitting "submit" events when option has been selected with "enter"
     * @private
     */
    _preventSubmitOnOptionSelection() {
        // Keep track of the selected option index to decide if we should prevent `submit` emission.
        this.autocomplete._keyManager.change
            // Slightly delay setting `preventSubmitEmission = false` but don't delay `preventSubmitEmission = true`
            // so that everything works as expected.
            .pipe(delayWhen((selectIndex, index) => {
                const delay = selectIndex > -1 ? 0 : 220;
                return interval(delay)
            }))
            .subscribe(selectIndex => {
                this.preventSubmitEmission = selectIndex > -1;
            });
    }

    _handleOptionSelection() {
        this.autocomplete.optionSelected.pipe(
            filter(() => !this.searchControl.disabled),
            takeUntil(this.destroy)
        ).subscribe((event: MatAutocompleteSelectedEvent) => {
            const matOption = event.option;
            const selectedOption: AqlSuggestion = matOption.value;

            const cursorPosition = this.inputCursorPosition.getValue();
            const selectionStart = cursorPosition.start + selectedOption.value.length + (selectedOption.type === 'keyword' ? 1 : 0);

            this.searchInput.nativeElement.selectionStart = selectionStart;
            this.searchInput.nativeElement.selectionEnd = selectionStart;
        });
    }

    /**
     * Uses canvas.measureText to compute and return the width of the given text of given font in pixels.
     *
     * @param {String} text The text to be rendered.
     * @see https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/21015393#21015393
     * @private
     */
    _getTextWidth(text): { width: number, fontSize: any, fontSizeNumber: any, fontWeight: any, fontFamily: any } {
        const computedStyle = window.getComputedStyle(this.searchInput.nativeElement, null);

        const fontSize = computedStyle.getPropertyValue('font-size');
        const fontSizeNumber = fontSize.replace(/\D/g, '');
        const fontWeight = computedStyle.getPropertyValue('font-weight');
        const fontFamily = computedStyle.getPropertyValue('font-family');

        let context = this.canvas.getContext('2d');
        context.font = fontWeight + ' ' + fontSize + ' ' + fontFamily;

        return {
            width: Math.floor(context.measureText(text).width),
            fontSize: fontSize,
            fontSizeNumber: fontSizeNumber,
            fontWeight: fontWeight,
            fontFamily: fontFamily
        };
    }

    /**
     * @private
     */
    _sendSubmitEmitter() {
        if (this.preventSubmitEmission === false) {
            this.submit.emit(this.searchControl.value);
        }
    }

    getInputCursorPosition() {
        return <InputCursorPosition> {
            start: this.searchInput.nativeElement.selectionStart,
            end: this.searchInput.nativeElement.selectionEnd
        };
    }

    getInputValue() {
        return this.searchInput.nativeElement.value;
    }

    setInputValue(value: string) {
        this.searchInput.nativeElement.value = value;
        this.writeValue(value);
    }
}

interface SearchAndCursorData {
    search: null | string;
    cursor: null | InputCursorPosition;
    opened?: null | undefined;
}
