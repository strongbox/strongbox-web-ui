import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, forwardRef, Input, OnDestroy, ViewChild} from '@angular/core';
import {AbstractControl, ControlValueAccessor, FormControl, FormGroupDirective, NG_VALUE_ACCESSOR, NgForm} from '@angular/forms';
import {BehaviorSubject, combineLatest, EMPTY, Observable, of, Subject, timer} from 'rxjs';
import {debounce, debounceTime, distinctUntilChanged, filter, pairwise, startWith, switchMap, take, takeUntil} from 'rxjs/operators';
import {ErrorStateMatcher, MatAutocomplete, MatAutocompleteTrigger} from '@angular/material';

import {AbstractAutocompleteDataSource, AutocompleteOption} from '../autocomplete.model';
import {DefaultAutocompleteDataSource} from '../default-autocomplete.data-source';

/* tslint:disable:component-selector */
@Component({
    selector: 'select-autocomplete',
    templateUrl: './select-autocomplete.component.html',
    styleUrls: ['./select-autocomplete.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SelectAutocompleteComponent),
            multi: true
        }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectAutocompleteComponent implements ControlValueAccessor, AfterViewInit, OnDestroy {

    @Input() placeholder: string;
    @Input() width = '';
    @Input() panelWidth = null;
    @Input() notFoundMessage = 'Entered option was not found!';
    @Input() autoActiveFirstOption = false;
    @Input() forceSelection = false;
    @Input() dataSource: AbstractAutocompleteDataSource | any = null;
    @Input() searchControl: AbstractControl = new FormControl();
    @Input() dependsOn: AbstractControl = null;
    @Input() required = false;

    searchControlErrorState = new SearchStateMatcher();
    loading: Observable<boolean>;
    options: Observable<AutocompleteOption<any>[]>;

    private trackingDebounce = 150;
    private dependencyDebounce = 250;

    @ViewChild('searchInput', { read: ElementRef, static: true })
    private searchInput: ElementRef;

    @ViewChild('autoComplete', { read: MatAutocomplete, static: true })
    private autocomplete: MatAutocomplete;

    @ViewChild('searchInput', { read: MatAutocompleteTrigger, static: true })
    private autocompleteTrigger: MatAutocompleteTrigger;

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

    @Input() displayWith = (data: any) => {
        let value = data;

        if (data !== null && data.hasOwnProperty('display')) {
            value = data.display;
        }

        return value;
    };

    // tslint:enable:semicolon

    constructor() {
    }

    ngAfterViewInit(): void {
        // Subscribe to the data source
        if (this.dataSource !== null && this.searchControl.enabled) {
            if (this.dataSource instanceof AbstractAutocompleteDataSource) {
                this.options = this.dataSource.connect();
            } else if (this.dataSource instanceof Array) {
                this.dataSource = new DefaultAutocompleteDataSource(this.dataSource, null, false);
                this.options = this.dataSource.connect();
            } else {
                throw Error('Invalid dataSource provided to select-autocomplete! ' +
                    'Possible values are AbstractAutocompleteDataSource or AutocompleteOption[]!');
            }
        }

        // Loading state
        if (this.dataSource !== null) {
            this.loading = this.dataSource.loadingObservable();
        } else {
            this.loading = new BehaviorSubject<boolean>(false);
        }


        // Track and Write changes.
        this.searchControl
            .valueChanges
            .pipe(
                filter(() => !this.searchControl.disabled),
                startWith(this.searchControl.value),
                distinctUntilChanged(),
                debounceTime(this.trackingDebounce),
                takeUntil(this.destroy)
            )
            .subscribe((term) => {
                this.writeValue(term);
            });

        // depends on
        if (this.dependsOn) {
            this.dependencyFieldSubscribers();
        }
    }

    ngOnDestroy(): void {
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
            this.search(value);
        }
    }

    search(term: string) {
        if (term !== null && this.dataSource !== null) {
            // Search & filter
            this.dataSource
                .search(term)
                .pipe(take(1))
                .subscribe((options: AutocompleteOption<any>[]) => {
                    // Check if search has returned options and show an error if no options were found.
                    if (this.forceSelectionEnabled() && !this.dataSource.exactOptionMatch(term)) {
                        const applyStateError = () => {
                            this.searchControl.setErrors({
                                invalidOption: this.notFoundMessage
                            });
                        };

                        // When the dataSource is still loading, we need to wait for it to complete before applying the state error.
                        if (this.dataSource.isLoading()) {
                            this.dataSource
                                .loadingObservable()
                                .pipe(filter(s => s === false), take(1))
                                .subscribe((state) => {
                                    if (!this.dataSource.exactOptionMatch(term)) {
                                        applyStateError();
                                    }
                                });
                        } else {
                            applyStateError();
                        }
                    }
                });
        }
    }

    dependencyFieldSubscribers() {
        // Disable the field when the dependent field is invalid.
        if (this.dependsOn.status !== 'VALID' || this.dependsOn.pending) {
            this.searchControl.disable();
        }

        combineLatest(this.dependsOn.statusChanges)
            .pipe(
                startWith([this.dependsOn.status || 'PENDING']),
                pairwise(),
                switchMap(data => of({current: data[1][0], previous: data[0][0]})),
                distinctUntilChanged(),
                debounce((status: any) => {
                    if (status.current !== 'VALID') {
                        return EMPTY; // invalid | pending status should not wait.
                    }

                    return timer(this.dependencyDebounce);
                })
            )
            .subscribe((satus) => {
                // Check field status
                if (satus.current !== 'VALID') {
                    this.searchControl.disable();

                    // This is necessary to prevent having an open autocomplete panel when you switch fast to the field.
                    if (this.autocomplete.isOpen) {
                        this.autocompleteTrigger.closePanel();
                    }

                    // Make sure to hide the loading spinner
                    if (this.dataSource.isLoading()) {
                        this.dataSource.loading(false);
                    }
                } else {
                    this.searchControl.setValue(null);
                    this.searchControl.enable();
                    this.dataSource.search();
                }
            });
    }

    forceSelectionEnabled() {
        return this.forceSelection === true;
    }

}

export class SearchStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}
