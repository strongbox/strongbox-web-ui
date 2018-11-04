import {Observable} from 'rxjs';
import {DataSource} from '@angular/cdk/table';

/**
 * Autocomplete DataSource interface
 */
export abstract class AbstractAutocompleteDataSource extends DataSource<AutocompleteOption<any>> {
    abstract search(term?: string): Observable<AutocompleteOption<any>[]>;
    abstract getSearchTerm(): string;
    abstract exactOptionMatch(term: string): boolean;
    abstract connect(): Observable<AutocompleteOption<any>[]>;
    abstract disconnect(): void;
    abstract loading(state: boolean): void;
    abstract loadingObservable(): Observable<boolean>;
    abstract isLoading(): boolean;
}

/**
 * Autocomplete option.
 */
export class AutocompleteOption<T> {
    constructor(public display: string, public value: T) {
    }
}

/**
 * A callback function which will be used to search a "term" and is responsible of
 * doing all necessary queries to the backend to provide the results as an Observable<AutocompleteOption[]>.
 */
export type AutocompleteSearchCallback = (search: string, cursorPosition?: InputCursorPosition) => Observable<AutocompleteOption<any>[]>;


/**
 * A callback function which will be used to upon option selection to determine what to display in the input field.
 */
export type AutocompleteSelectFunction = (data: any) => string;

export interface InputCursorPosition {
    start: number;
    end: number;
}
