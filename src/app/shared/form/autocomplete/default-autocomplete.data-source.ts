import {BehaviorSubject, Observable, Subject} from 'rxjs';

import {AbstractAutocompleteDataSource, AutocompleteSearchCallback, AutocompleteOption} from './autocomplete.model';

/**
 * This class is responsible of retrieving and searching through the autocomplete options.
 */
export class DefaultAutocompleteDataSource extends AbstractAutocompleteDataSource {
    private readonly _options: BehaviorSubject<AutocompleteOption[]> = new BehaviorSubject<AutocompleteOption[]>([]);
    private readonly _filtered: BehaviorSubject<AutocompleteOption[]> = new BehaviorSubject<AutocompleteOption[]>([]);
    private readonly _searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private readonly _loading = new BehaviorSubject<boolean>(false);

    private readonly destroy = new Subject();

    private _prefetch = false;
    private _searchService: AutocompleteSearchCallback;

    constructor(initialData: any[] = [], dataService: AutocompleteSearchCallback, prefetch = false) {
        super();

        this._prefetch = prefetch;
        this._options.next(initialData);
        this._filtered.next(initialData);

        if (dataService !== null) {
            this._searchService = dataService;
        }
    }

    /**
     * Filter term that should be used to filter out objects from the data array. To override how
     * data objects match to this filter string, provide a custom function for filterPredicate.
     */
    getSearchTerm(): string {
        return this._searchTerm.value;
    }

    search(term: string = ''): Observable<AutocompleteOption[]> {
        this._searchTerm.next(term);
        this._loading.next(true);

        // Try to search te cache first
        const filterCache = this.filter(term, this._options.getValue());

        // No cache - try hitting the backend
        if (filterCache.length > 0) {
            this._filtered.next(filterCache);
            this._loading.next(false);
        } else if (filterCache.length < 1 && this._searchService !== null) {
            this._searchService(term)
                .subscribe((options: AutocompleteOption[]) => {
                    this._options.next(options);
                    this._filtered.next(this.filter(term, options));
                    this._loading.next(false);
                });
        }

        return this._filtered;
    }

    private filter(term: string, options: AutocompleteOption[] = []) {
        let matches = [];
        if (options !== null) {
            matches = options.filter(v => v.display.indexOf(term) > -1);
        }
        return matches;
    }

    private exactMatch(term: string, options: AutocompleteOption[] = []) {
        let matches = [];

        if (options != null) {
            matches = options.filter(v => v.display === term);
        }

        return matches.length > 0;
    }

    exactOptionMatch(term: string): boolean {
        return this._filtered && term !== null && term !== '' && this.exactMatch(term, this._filtered.getValue());
    }


    loading(state: boolean): void {
        this._loading.next(state);
    }

    isLoading(): boolean {
        return this._loading.getValue();
    }

    loadingObservable(): Observable<boolean> {
        return this._loading;
    }

    connect(): Observable<AutocompleteOption[]> {
        if (this._prefetch && this._searchService !== null) {
            this.search();
        }

        return this._filtered;
    }

    /**
     * Called when it is destroyed.
     */
    disconnect() {
        this.destroy.next();
        this.destroy.complete();
    }
}
