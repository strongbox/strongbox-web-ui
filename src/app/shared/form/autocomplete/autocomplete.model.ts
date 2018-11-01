import {Observable} from 'rxjs';
import {DataSource} from '@angular/cdk/table';

/**
 * Autocomplete DataSource interface
 */

export abstract class AbstractAutocompleteDataSource extends DataSource<AutocompleteOption> {
    abstract search(term?: string): Observable<AutocompleteOption[]>;
    abstract getSearchTerm(): string;
    abstract exactOptionMatch(term: string): boolean;
    abstract connect(): Observable<AutocompleteOption[]>;
    abstract disconnect(): void;
    abstract loading(state: boolean): void;
    abstract loadingObservable(): Observable<boolean>;
    abstract isLoading(): boolean;
}

/**
 * Autocomplete option.
 */
export class AutocompleteOption {
    constructor(public display: string, public value: any) {
    }
}

/**
 * A callback function which will be used to search a "term" and is responsible of
 * doing all necessary queries to the backend to provide the results as an Observable<AutocompleteOption[]>.
 */
export type AutocompleteSearchCallback = (search: string) => Observable<AutocompleteOption[]>;
