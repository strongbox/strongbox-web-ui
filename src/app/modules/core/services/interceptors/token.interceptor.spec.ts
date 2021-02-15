import {HttpClientTestingModule, HttpTestingController, TestRequest} from '@angular/common/http/testing';
import { async, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import {HTTP_INTERCEPTORS, HttpClient} from '@angular/common/http';
import {RouterTestingModule} from '@angular/router/testing';

import {TokenInterceptor} from './token.interceptor';

describe('Interceptor: token interceptor', () => {
    let interceptor: TokenInterceptor;
    let backend: HttpTestingController;
    let client: HttpClient;

    beforeEach(waitForAsync(() => {
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

        interceptor = TestBed.inject(TokenInterceptor);
        backend = TestBed.inject(HttpTestingController);
        client = TestBed.inject(HttpClient);

        let store = {};
        const mockLocalStorage = {
            getItem: (key: string): string => {
                return key in store ? store[key] : null;
            },
            setItem: (key: string, value: string) => {
                store[key] = `${value}`;
            },
            removeItem: (key: string) => {
                delete store[key];
            },
            clear: () => {
                store = {};
            }
        };
        spyOn(localStorage, 'getItem').and.callFake(mockLocalStorage.getItem);
        spyOn(localStorage, 'setItem').and.callFake(mockLocalStorage.setItem);
        spyOn(localStorage, 'removeItem').and.callFake(mockLocalStorage.removeItem);
        spyOn(localStorage, 'clear').and.callFake(mockLocalStorage.clear);
    }));

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
        localStorage.removeItem('session');

        client.get('/api/some/endpoint').subscribe((response) => {
            expect(response).toBeTruthy();
        });

        const testRequest: TestRequest = backend.expectOne(`/api/some/endpoint`);
        testRequest.flush({});

        expect(testRequest.request.headers.has('Authorization')).toBeFalsy();
        expect(testRequest.request.headers.get('Authorization')).toBe(null);
    }));
});
