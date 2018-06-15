import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';

import {SearchResponse} from './search-result-interfaces';

@Injectable({
    // we declare that this service should be created
    // by the root application injector.
    providedIn: 'root'
})
export class RepositorySearchService {

    searchQuery: BehaviorSubject<string> = new BehaviorSubject<string>(null);

    constructor(private client: HttpClient) {
    }

    find(query: string): Observable<SearchResponse> {
        this.searchQuery.next(query);
        const params = new HttpParams().set('query', query);
        return this.client.get<SearchResponse>('/api/aql', {params: params});
    }

    getQueryObservable(): BehaviorSubject<string> {
        return this.searchQuery;
    }

    getQuery(): string | null {
        return this.searchQuery.getValue();
    }
}
