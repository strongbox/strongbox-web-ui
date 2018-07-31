import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {ApiURLInterceptor} from './api-url.interceptor';
import {HTTP_INTERCEPTORS, HttpClient} from '@angular/common/http';

import {environment} from '../../../../../environments/environment';


describe('Interceptor: api-url interceptor', () => {
    let interceptor: ApiURLInterceptor;
    let backend: HttpTestingController;
    let client: HttpClient;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: ApiURLInterceptor,
                    multi: true,
                },
            ]
        });

        interceptor = TestBed.get(ApiURLInterceptor);
        backend = TestBed.get(HttpTestingController);
        client = TestBed.get(HttpClient);
    });

    afterEach(() => {
        // After every test, assert that there are no more pending requests.
        backend.verify();
    });

    it('should properly intercept internal routes and append the proper base url to the link', () => {
        client.get('/api/login').subscribe((response) => {
            expect(response).toBeTruthy();
        });

        backend.expectNone(`/api/login`);
        backend.expectOne(`http://${environment.strongboxUrl}/api/login`).flush({});
        backend.verify();
    });

    it('should NOT intercept external routes', () => {
        const url = 'http://google.com/api/login';

        client.get(url).subscribe((response) => {
            expect(response).toBeTruthy();
        });

        backend.expectOne(url).flush({});
        backend.verify();
    });
});
