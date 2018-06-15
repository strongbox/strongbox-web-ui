import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {async, TestBed} from '@angular/core/testing';
import {BehaviorSubject} from 'rxjs';

import {RepositorySearchService} from './repository-search.service';
import {SearchResponse, SearchResult} from './search-result-interfaces';

describe('RepositorySearchService', () => {
    let service: RepositorySearchService;
    let backend: HttpTestingController;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [RepositorySearchService]
        });
    }));

    beforeEach(() => {
        service = TestBed.get(RepositorySearchService);
        backend = TestBed.get(HttpTestingController);
    });

    afterEach(() => {
        // After every test, assert that there are no more pending requests.
        backend.verify();
    });

    it('#find should return results.', () => {
        const query = 'groupId:org.carlspring.*';
        const testResponse: SearchResponse = new SearchResponse([new SearchResult(), new SearchResult()]);

        service.find(query).subscribe((result: SearchResponse) => {
            expect(result).toBeTruthy();
            expect(result.artifact.length).toEqual(2);
        });

        const request = backend.expectOne(`/api/aql?query=${query}`);
        request.flush(testResponse);
        backend.verify();
    });

    it('#getQuery should return query.', () => {
        const query = 'groupId:org.carlspring.*';
        service.find(query);
        expect(service.getQuery()).toEqual(query);
    });

    it('#getQueryObservable should return BehaviourSubject.', () => {
        const query = 'groupId:org.carlspring.*';
        service.find(query);
        expect(service.getQueryObservable()).toBeTruthy();
        expect(service.getQueryObservable() instanceof BehaviorSubject).toBeTruthy();
    });
});
