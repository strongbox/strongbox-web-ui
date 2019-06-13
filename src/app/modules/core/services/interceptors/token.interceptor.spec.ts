import {HttpClientTestingModule, HttpTestingController, TestRequest} from '@angular/common/http/testing';
import {async, fakeAsync, TestBed} from '@angular/core/testing';
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

    afterEach(() => {
        localStorage.removeItem('session');
    });

    it('should automatically add Authorization header when token is found', fakeAsync(() => {
        localStorage.setItem('session', JSON.stringify({token: 'a-session-token'}));

        client.get('/api/some/endpoint').subscribe((response) => {
            expect(response).toBeTruthy();
        });

        const testRequest: TestRequest = backend.expectOne(`/api/some/endpoint`);
        testRequest.flush({});

        expect(testRequest.request.headers.has('Authorization'));
        expect(testRequest.request.headers.get('Authorization')).toBe('Bearer a-session-token');
    }));

    it('should NOT add Authorization header', fakeAsync(() => {
        client.get('/api/some/endpoint').subscribe((response) => {
            expect(response).toBeTruthy();
        });

        const testRequest: TestRequest = backend.expectOne(`/api/some/endpoint`);
        testRequest.flush({});

        expect(testRequest.request.headers.has('Authorization')).toBeFalsy();
        expect(testRequest.request.headers.get('Authorization')).toBe(null);
    }));
});
