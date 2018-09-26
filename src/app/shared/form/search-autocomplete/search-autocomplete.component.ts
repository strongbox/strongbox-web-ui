import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    forwardRef,
    Input,
    OnDestroy,
    ViewChild
} from '@angular/core';
import {AbstractControl, ControlValueAccessor, FormControl, FormGroupDirective, NG_VALUE_ACCESSOR, NgForm} from '@angular/forms';
import {BehaviorSubject, combineLatest, EMPTY, Observable, of, Subject, timer} from 'rxjs';
import {debounce, distinctUntilChanged, filter, pairwise, startWith, switchMap, takeUntil, tap} from 'rxjs/operators';
import {ErrorStateMatcher, MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger} from '@angular/material';
import {DataSource} from '@angular/cdk/table';

/* tslint:disable:component-selector */
@Component({
    selector: 'search-autocomplete',
    templateUrl: './search-autocomplete.component.html',
    styleUrls: ['./search-autocomplete.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SearchAutocompleteComponent),
            multi: true
        }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchAutocompleteComponent implements ControlValueAccessor, AfterViewInit, OnDestroy {

    @Input() placeholder: string;
    @Input() debounceTime = 300;
    @Input() width = '';
    @Input() panelWidth = null;
    @Input() type: 'context' | 'default' = 'default';
    @Input() emptyText = '';
    @Input() autoActiveFirstOption = false;
    @Input() appendSelection = false;
    @Input() forceSelection = false;
    @Input() dataSource: AutocompleteDataSource = null;
    @Input() searchControl: AbstractControl = new FormControl();
    @Input() dependsOn: AbstractControl = null;

    searchControlErrorState = new SearchStateMatcher();
    loading: Observable<boolean>;
    options: Observable<AutocompleteOption[]>;

    @ViewChild('searchInput', {read: ElementRef})
    private searchInput: ElementRef;

    @ViewChild('autoComplete', {read: MatAutocomplete})
    private autocomplete: MatAutocomplete;

    @ViewChild('searchInput', {read: MatAutocompleteTrigger})
    private autocompleteTrigger: MatAutocompleteTrigger;

    /**
     * Input cursor position
     */
    private inputCursorPosition: BehaviorSubject<{ start: number, end: number }> = new BehaviorSubject({start: 0, end: 0});

    /**
     * Text width calculation
     */
    private canvas = document.createElement('canvas');

    /**
     * Current search input value
     */
    private currentInputValue: any = '';

    /**
     * destroy.
     */
    private destroy = new Subject();

    // tslint:disable:semicolon

    onChange = (_: any) => {
    };

    onTouched = () => {
    };

    displayWith = (data: any) => {
        let display = data ? data : '';
        let value = display;

        if (this.appendSelectionEnabled()) {
            value = this.searchInput.nativeElement.value;

            // append / replace the selection at the position where the cursor currently is.
            const cursor = this.inputCursorPosition.getValue();

            // start/end depend on the selection direction.
            const start = cursor.start < cursor.end ? cursor.start : cursor.end;
            const end = cursor.end > cursor.start ? cursor.end : cursor.start;

            // set input value
            value = value.substring(0, start) + display + value.substring(end);

            // set cursor position
            this.searchInput.nativeElement.selectionStart = (value.substring(0, start) + display).length;
        }

        return value;
    };

    // tslint:enable:semicolon

    constructor(private cdr: ChangeDetectorRef) {
    }


    /**
     * Monitor mouse clicks and keyboard events and record current input cursor position.
     *
     * NOTE: Do not use the events below as they only works properly in chrome.
     * @@HostListener('document:selectionchange', ['$event'])
     * @@HostListener('document:selectionstart', ['$event'])
     *
     * @param event
     */
    trackInputCursor(event: Event | KeyboardEvent) {
        // We need to track the input cursor's position when the "type" is context or we will be "appending" the selected option.
        if (this.type === 'context' || this.appendSelection) {
            const selection = this.getSelection();
            this.inputCursorPosition.next(selection);

            if (!(event instanceof KeyboardEvent) && !this.autocomplete.isOpen) {
                this.autocompleteTrigger.openPanel();
            }

        }
    }

    ngAfterViewInit(): void {
        // Subscribe to the data source
        this.options = this.dataSource && this.searchControl.enabled ? this.dataSource.connect() : of([]);

        // Track and Write changes.
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

        // Search/filter autocomplete list
        this.searchControl.valueChanges.pipe(
            filter(v => typeof v === 'string'),
            filter(() => this.searchControl.disabled),
            takeUntil(this.destroy)
        ).subscribe((search) => {
            console.log('search/filter');
            // search/filter
            this.dataSource.search = search;

            // force selection from list of options.
            if (this.forceSelectionEnabled()) {
                if (search !== '' && !this.dataSource.hasOption(search)) {
                    this.searchControl.setErrors({
                        invalidOption: 'Option not found!'
                    });
                }
            }
        });

        // Move autocomplete panel when the type is 'context'.
        if (this.type === 'context') {
            if (this.panelWidth === null) {
                this.panelWidth = '10%';
            }

            combineLatest(
                this.searchControl.valueChanges,
                this.inputCursorPosition
            ).pipe(
                startWith({search: '', cursor: null}),
                switchMap((v) => {
                    v[1] = this.getSelection();
                    return of({search: v[0], cursor: v[1]});
                }),
                filter(() => this.searchControl.disabled),
                takeUntil(this.destroy)
            ).subscribe((data) => {
                if (this.autocomplete.panel) {
                    const cursorValue = data.search.substr(0, data.cursor.start);
                    const textWidth = this.getTextWidth(cursorValue);

                    // this offset is necessary to properly align the autocomplete panel under the cursor.
                    const letterOffset = textWidth.width / (textWidth.fontSizeNumber + 10);

                    let position = textWidth.width + letterOffset;
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

        // reposition the input cursor on selection
        if (this.type === 'context' || this.appendSelection) {
            this.autocomplete.optionSelected.pipe(
                filter(() => this.searchControl.disabled),
                takeUntil(this.destroy)
            ).subscribe((event: MatAutocompleteSelectedEvent) => {
                const matOption = event.option;
                const selectedOption: AutocompleteOption = matOption.value;

                this.searchInput.nativeElement.selectionStart = this.inputCursorPosition.getValue().start + selectedOption.display.length;
                this.searchInput.nativeElement.selectionEnd = this.searchInput.nativeElement.selectionStart;
            });
        }

        // depends on
        if (this.dependsOn) {
            this.dependencyFieldSubscribers();
        }
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

    writeValue(obj: any): void {
        // Angular sometimes writes a value that didn't really change.
        if (obj !== this.currentInputValue && !this.searchControl.disabled) {
            this.currentInputValue = obj;
            this.onChange(obj);
        }
    }

    dependencyFieldSubscribers() {
        const dependencyField = {valid: this.dependsOn.status === 'VALID', value: this.dependsOn.value};

        // Disable the field when the dependent field is invalid.
        if (!dependencyField.valid) {
            this.searchControl.disable();
            this.cdr.detectChanges();
        }

        combineLatest(
            this.dependsOn.statusChanges,
            this.dependsOn.valueChanges
        ).pipe(
            startWith([dependencyField.valid, this.dependsOn.value]),
            switchMap(data => of({valid: (data[0] === 'VALID' || data[0] === true), value: data[1]})),
            pairwise()
        ).subscribe((data) => {
            const previous = data[0];
            const current = data[1];

            if (!current.valid) {
                this.searchControl.disable();
            } else if (current.valid && this.searchControl.disabled) {
                this.searchControl.enable();
            }

            if (current.value !== previous.value) {
                this.searchControl.setValue(null);
                this.dataSource.refresh();
            }
        });
    }

    /**
     * Uses canvas.measureText to compute and return the width of the given text of given font in pixels.
     *
     * @param {String} text The text to be rendered.
     *
     * @see https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/21015393#21015393
     */
    getTextWidth(text): { width: number, fontSize: any, fontSizeNumber: any, fontWeight: any, fontFamily: any } {
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

    getSelection() {
        return {
            start: this.searchInput.nativeElement.selectionStart,
            end: this.searchInput.nativeElement.selectionEnd
        };
    }

    appendSelectionEnabled() {
        return this.appendSelection === true;
    }

    forceSelectionEnabled() {
        return this.forceSelection === true && this.appendSelection === false;
    }

}

export class SearchStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}

export class AutocompleteOption {
    constructor(public display: string, public value: any) {
    }
}

export type AutocompleteDataServiceCallback = (search: string) => Observable<any>;

export class AutocompleteDataSource extends DataSource<AutocompleteOption> {
    private readonly _data: BehaviorSubject<AutocompleteOption[]> = new BehaviorSubject<AutocompleteOption[]>([]);
    private readonly _search: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private readonly _filteredData: BehaviorSubject<AutocompleteOption[]> = new BehaviorSubject<AutocompleteOption[]>([]);
    private readonly _loading = new BehaviorSubject<boolean>(true);

    private readonly destroy = new Subject();

    private dataService: AutocompleteDataServiceCallback;

    constructor(initialData: any[] = [], dataService: AutocompleteDataServiceCallback) {
        super();
        this.data = initialData;

        if (dataService !== null) {
            this.dataService = dataService;
        }
    }

    /** Array of data that should be rendered by the table, where each object represents one row. */
    get data() {
        return this._data.value;
    }

    set data(data: any) {
        this._data.next(data);
        this._filteredData.next(data);
    }

    /**
     * Filter term that should be used to filter out objects from the data array. To override how
     * data objects match to this filter string, provide a custom function for filterPredicate.
     */
    get search(): string {
        return this._search.value;
    }

    set search(term: string) {
        this._search.next(term);
    }

    refresh() {
        this.dataService('').subscribe((options: AutocompleteOption[]) => this.data = options);
    }

    hasOption(term: string) {
        return this.data && term !== null && term !== '' && this.data.filter(v => v.display === term).length === 1;
    }

    /**
     * Called when it connects to the data source.
     */
    connect(): Observable<AutocompleteOption[]> {
        this._search
            .pipe(tap(() => this._loading.next(true)), takeUntil(this.destroy))
            .subscribe((search) => {
                if (this.dataService !== null) {
                    this.dataService(search).subscribe((options: AutocompleteOption[]) => {
                        this.data = options;
                    });
                } else {
                    this._filteredData.next(this.data.filter(v => v.display.indexOf() > -1));
                }

                this._loading.next(false);
            });

        return this._filteredData;
    }

    /**
     * Called when it is destroyed.
     */
    disconnect() {
        this.destroy.next();
        this.destroy.complete();
    }
}
