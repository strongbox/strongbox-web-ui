import {Component, EventEmitter, HostListener, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {EMPTY, merge, Subject, timer} from 'rxjs';
import {debounce, takeUntil} from 'rxjs/operators';
import {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';

@Component({
    selector: 'app-stream-log-filter',
    templateUrl: './stream-log-filter.component.html',
    styleUrls: ['./stream-log-filter.component.scss']
})
export class StreamLogFilterComponent implements OnInit, OnDestroy {

    readonly localStorageKey = 'logSearchHistory';

    formControl = new FormControl();
    filters: string[] = [];
    filtersLimit = 10;

    exampleFilters: string[] = [
        'DispatcherServlet.*/api',
        'DispatcherServlet.*/storages.*\\.(pom|jar)',
        'o.c.s.security.authentication'
    ];

    @Output()
    typing: EventEmitter<string> = new EventEmitter<string>();

    @ViewChild('autocomplete', {static: true})
    autocomplete: MatAutocomplete;

    private _showFilters = true;
    private destroy$: Subject<any> = new Subject<any>();

    ngOnInit() {
        this.restoreLocalStorageHistory();
        this.monitorSearch();
        this.monitorAutocompleteOpenState();
    }

    monitorSearch() {
        merge(this.formControl.valueChanges, this.autocomplete.optionSelected)
            .pipe(
                takeUntil(this.destroy$),
                // pass-through autocomplete selections, but debounce typing.
                debounce((data: string | MatAutocompleteSelectedEvent) => {
                    if (data instanceof MatAutocompleteSelectedEvent) {
                        return EMPTY;
                    }
                    return timer(1400);
                }),
            )
            .subscribe((data: string | MatAutocompleteSelectedEvent) => {
                let term;
                let update = true;

                if (data instanceof MatAutocompleteSelectedEvent) {
                    term = data.option.value;
                    update = false;
                } else {
                    term = data;
                }

                this.typingEmitter(term, update);
            });
    }

    monitorAutocompleteOpenState() {
        this.autocomplete.opened.pipe(takeUntil(this.destroy$)).subscribe(() => this.showFilters = true);
    }

    @HostListener('window:keydown', ['$event'])
    handleKeyboardEvents(event: KeyboardEvent) {
        if (this.autocomplete.isOpen && this.autocomplete._keyManager.activeItem !== null) {
            if (event.code === 'Delete' && this._showFilters === true) {
                this.deleteHistory(event, this.autocomplete._keyManager.activeItem.value);
            } else if (event.code === 'ArrowLeft' || event.code === 'ArrowRight') {
                this._showFilters = !this._showFilters;
            }
        }
    }

    sanitizeTerm(term: string) {
        let sanitized = term.trim().replace(/\s+/g, '');
        return sanitized !== '' ? sanitized : null;
    }

    typingEmitter(term: string, updateHistory: boolean = true) {
        term = this.sanitizeTerm(term);
        this.typing.emit(term);
        if (term !== null && updateHistory) {
            this.updateHistory(term);
        }
    }

    updateHistory(term: string) {
        // prevent duplicates.
        const exists = this.filters.find(v => v.toLocaleLowerCase().trim() === term.toLocaleLowerCase().trim());

        if (!exists) {
            this.filters.unshift(term.trim());
            if (this.filters.length > this.filtersLimit) {
                this.filters.splice(10, this.filters.length - 1);
            }
            this.autocomplete._keyManager.setFirstItemActive();
            this.saveLocalStorageHistory();
        }
    }

    deleteHistory(event: Event, term: string) {
        event.preventDefault();
        event.stopImmediatePropagation();

        if (this.filters.length > 0) {
            this.filters = this.filters
                               .filter(v => v.toLocaleLowerCase().trim() !== term.toLocaleLowerCase().trim());
            this.saveLocalStorageHistory();
        }
    }

    saveLocalStorageHistory(): void {
        localStorage.setItem(this.localStorageKey, JSON.stringify(this.filters));
    }

    restoreLocalStorageHistory(): void {
        try {
            const localStorageHistory = JSON.parse(localStorage.getItem(this.localStorageKey));

            if (Array.isArray(localStorageHistory)) {
                this.filters = localStorageHistory;
            } else {
                this.filters = [];
            }
        } catch (e) {
            this.filters = [];
        }
    }

    hasHistory() {
        return this.filters.length > 0;
    }

    set showFilters(val: boolean) {
        this._showFilters = val;
    }

    get showFilters(): boolean {
        return this._showFilters && this.hasHistory();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

}
