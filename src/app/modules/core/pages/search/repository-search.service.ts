import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

import {SearchResponse} from './search-result-interfaces';

@Injectable({
    // we declare that this service should be created
    // by the root application injector.
    providedIn: 'root'
})
export class RepositorySearchService {

    constructor(private client: HttpClient) {
    }

    find(query: string): Observable<SearchResponse> {
        const params = new HttpParams().set('query', query);
        return this.client.get<SearchResponse>('/api/aql', {params: params});
    }
}
