import {Observable} from 'rxjs';

import {DefaultAutocompleteDataSource} from '../default-autocomplete.data-source';
import {AutocompleteOption, InputCursorPosition} from '../autocomplete.model';
import {AqlSuggestion} from '../../services/aql-autocomplete.service';

export class AqlAutocompleteDataSource extends DefaultAutocompleteDataSource {
    search(term: string = '', cursorPosition: InputCursorPosition = null): Observable<AutocompleteOption<any>[]> {
        this._searchTerm.next(term);
        this._loading.next(true);

        this._searchService(term, cursorPosition)
            .subscribe((options: AutocompleteOption<any>[]) => {
                this._options.next(options);
                this._loading.next(false);
            });

        return this._options;
    }

    connect(): Observable<AutocompleteOption<AqlSuggestion>[]> {
        if (this._prefetch && this._searchService !== null) {
            this.search();
        }

        return this._options;
    }
}
