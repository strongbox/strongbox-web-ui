import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {CommonTokenStream, InputStream} from 'antlr4';
import {AutoSuggester, autosuggester} from 'antlr4-autosuggest';

import {AQLLexer} from '../../../../aql/AQLLexer';
import {AQLParser} from '../../../../aql/AQLParser';
import {AutocompleteOption, InputCursorPosition} from '../autocomplete/autocomplete.model';

export interface AqlSuggestion {
    type: 'keyword' | 'value';
    value: string;
}

@Injectable({
    providedIn: 'root'
})
export class AqlAutocompleteService {

    private autosuggester: AutoSuggester = autosuggester(AQLLexer, AQLParser, 'LOWER');
    private keywords: AutocompleteOption<AqlSuggestion>[] = [];

    constructor() {
        // pre-populate keywords.
        this.keywords = this._autosuggest('');
    }

    /**
     * @param term
     * @private
     */
    _autosuggest(term = ''): AutocompleteOption<AqlSuggestion>[] {
        return this.autosuggester.autosuggest(term)
            .sort()
            .filter(e => e.match(/([a-z]){2,}/gi))
            .map((str: string) => {
                const isKeyword = term === '' ? true : this.keywords.filter(k => k.display === str).length > 0;

                return new AutocompleteOption<AqlSuggestion>(str, <AqlSuggestion> {
                    type: isKeyword ? 'keyword' : 'value',
                    value: str
                });
            });
    }

    /**
     * @param tokens
     * @private
     */
    _filterTokenDecision(tokens = []) {
        let token = '';

        const currentToken = tokens[tokens.length - 1].trim();
        const previousToken = tokens[tokens.length - 2];

        if (currentToken.indexOf(':') === -1) {
            token = currentToken;
        } else if (typeof previousToken !== 'undefined' && previousToken.indexOf(':') === -1) {
            token = previousToken;
        }

        return token;
    }

    search(term: string, cursorPosition: InputCursorPosition): Observable<AutocompleteOption<AqlSuggestion>[]> {
        let chars = new InputStream(term);
        let lexer = new AQLLexer(chars);
        let tokenStream = new CommonTokenStream(lexer);
        let parser: any = new AQLParser(tokenStream);
        parser.buildParseTrees = true;

        let suggestions = this._autosuggest(term);

        const tokens = term.replace(/\s{2,}/, ' ').substr(0, cursorPosition.start).split(' ');

        // If no suggestions are available, fallback to all possible keywords.
        if (suggestions.length < 1) {
            // console.log('no suggestions... falling back');
            suggestions = this.keywords;
        } else {
            // console.log('found suggestions:', suggestions);
        }

        const filterToken = this._filterTokenDecision(tokens);

        // The last token does not contain a colon (:), which means that we should be searching for a value.
        suggestions = suggestions.filter(v => v.display.toLowerCase().indexOf(filterToken) > -1);

        // console.log('Filtered suggestions using last search token: ', term, suggestions);

        return of(suggestions);
    }

}
