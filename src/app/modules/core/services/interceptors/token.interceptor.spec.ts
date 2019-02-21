import {HttpClientTestingModule, HttpTestingController, TestRequest} from '@angular/common/http/testing';
import {async, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {HTTP_INTERCEPTORS, HttpClient} from '@angular/common/http';
import {RouterTestingModule} from '@angular/router/testing';

import {TokenInterceptor} from './token.interceptor';

describe('Interceptor: token interceptor', () => {
    let interceptor: TokenInterceptor;
    let backend: HttpTestingController;
    let client: HttpClient;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule
            ],
            providers: [
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: TokenInterceptor,
                    multi: true,
                },
            ]
        });

        interceptor = TestBed.get(TokenInterceptor);
        backend = TestBed.get(HttpTestingController);
        client = TestBed.get(HttpClient);
    }));

    it('should automatically add Authorization header when token is found', fakeAsync(() => {
        client.get('/api/login').subscribe((response) => {
            expect(response).toBeTruthy();
            tick();
        });

        const testRequest: TestRequest = backend.expectOne(`/api/login`);
        expect(testRequest.request.headers.has('Authorization'));
    }));

});
