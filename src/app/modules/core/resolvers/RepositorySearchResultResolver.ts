import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {Store} from '@ngxs/store';

import {SearchResponse} from '../pages/search/search-result-interfaces';
import {RepositorySearchService} from '../pages/search/repository-search.service';
import {AppState} from '../../../state/app.state';
import {SearchQueryValueUpdateAction} from '../../../state/app.actions';
import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class RepositorySearchResultResolver implements Resolve<SearchResponse> {

    constructor(private searchService: RepositorySearchService, private store: Store) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<SearchResponse> {
        const query = route.paramMap.get('query');

        // Update the aql query state only when it's different.
        if (this.store.selectSnapshot(AppState.aqlQuery) !== query) {
            this.store.dispatch(new SearchQueryValueUpdateAction(query));
        }

        return this.searchService.find(query);
    }
}
