import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {async, TestBed} from '@angular/core/testing';
import {HTTP_INTERCEPTORS, HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Actions, NgxsModule, ofActionDispatched, Store} from '@ngxs/store';
import {NgxsFormPluginModule} from '@ngxs/form-plugin';
import {ToastrModule, ToastrService} from 'ngx-toastr';
import {RouterTestingModule} from '@angular/router/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {ErrorInterceptor} from './error.interceptor';
import {MaterialModule} from '../../../../shared/material.module';
import {SessionState} from '../../auth/state/session.state';
import {CredentialsExpiredAction, UnauthorizedAccessAction} from '../../auth/state/auth.actions';

describe('Interceptor: error interceptor', () => {
    let interceptor: ErrorInterceptor;
    let toastr: ToastrService;
    let toastrSpy;
    let backend: HttpTestingController;
    let client: HttpClient;
    let store: Store;
    let actions: Actions;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule,

                BrowserAnimationsModule,
                MaterialModule,
                NgxsModule.forRoot([SessionState]),
                NgxsFormPluginModule.forRoot(),

                ToastrModule.forRoot(),
            ],
            providers: [
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: ErrorInterceptor,
                    multi: true,
                }
            ]
        });

        interceptor = TestBed.get(ErrorInterceptor);
        toastr = TestBed.get(ToastrService);
        toastrSpy = spyOn(toastr, 'error').and.callThrough();
        backend = TestBed.get(HttpTestingController);
        client = TestBed.get(HttpClient);
        store = TestBed.get(Store);
        actions = TestBed.get(Actions);
    }));

    afterEach(() => {
        // After every test, assert that there are no more pending requests.
        backend.verify();
    });

    it('should properly handle fatal exceptions from server side.', () => {
        const errorResponse = new HttpErrorResponse({status: 0, error: null, statusText: '500 Server Error'});

        const route = '/api/error500-critical';
        client.get(route).subscribe(
            (response) => {
                expect(response).toBeFalsy();
            },
            (error) => {
                expect(error).toBeTruthy();
            }
        );

        backend.expectOne(route).flush({}, errorResponse);

        expect(toastrSpy).toHaveBeenCalledTimes(1);

    });

    it('should properly handle fatal exceptions from server side.', () => {
        const errorResponse = new HttpErrorResponse({
            status: 500,
            error: 'some exception which does not break the server',
            statusText: '500 Server Error'
        });

        const route = '/api/error500-critical';
        client.get(route).subscribe(
            (response) => {
                expect(response).toBeFalsy();
            },
            (error) => {
                expect(error).toBeTruthy();
            }
        );

        backend.expectOne(route).flush({}, errorResponse);

        expect(toastrSpy).toHaveBeenCalledTimes(1);
    });

    it('should properly handle other types of errors.', () => {
        const errorResponse = new HttpErrorResponse({
            status: 400,
            error: {
                error: 'my error message'
            },
            statusText: '400 Bad Request'
        });

        const route = '/api/error400';
        client.get(route).subscribe(
            (response) => {
                expect(response).toBeFalsy();
            },
            (error) => {
                expect(error).toBeTruthy();
                expect(error.error).toBe('my error message');
            }
        );

        backend.expectOne(route).flush({}, errorResponse);

        expect(toastrSpy).toHaveBeenCalledTimes(1);
    });

    it('should dispatch CredentialsExpiredAction when credentials have expired or are invalid (401)', () => {
        const errorResponse = new HttpErrorResponse({
            status: 401,
            error: {
                error: 'expired/invalid'
            },
            statusText: '401 Unauthenticated'
        });

        const route = '/api/error401';
        client.get(route).subscribe(
            (response) => {
                expect(response).toBeFalsy();
            },
            (error) => {
                expect(error).toBeTruthy();
                expect(error.error).toBe('expired/invalid');
            }
        );

        actions.pipe(ofActionDispatched(CredentialsExpiredAction)).subscribe((payload: any) => {
            expect(payload).toBeTruthy();
            expect(payload instanceof CredentialsExpiredAction).toBe(true);
        });

        backend.expectOne(route).flush({}, errorResponse);

        expect(toastrSpy).toHaveBeenCalledTimes(0);
    });

    it('should dispatch UnauthorizedAccessAction when credentials lack the authority to execute an action (403)', () => {
        const errorResponse = new HttpErrorResponse({
            status: 403,
            error: {
                error: 'unauthorized'
            },
            statusText: '403 Unauthorized'
        });

        const route = '/api/error403';
        client.get(route).subscribe(
            (response) => {
                expect(response).toBeFalsy();
            },
            (error) => {
                expect(error).toBeTruthy();
                expect(error.error).toBe('unauthorized');
            }
        );

        actions.pipe(ofActionDispatched(UnauthorizedAccessAction)).subscribe((payload: any) => {
            expect(payload).toBeTruthy();
            expect(payload instanceof UnauthorizedAccessAction).toBe(true);
        });

        backend.expectOne(route).flush({}, errorResponse);

        expect(toastrSpy).toHaveBeenCalledTimes(0);
    });

    it('should NOT show toaster when login actions fail (401)', () => {
        const errorResponse = new HttpErrorResponse({
            status: 401,
            error: {
                error: 'expired/invalid'
            },
            statusText: '401 Unauthenticated'
        });

        const route = '/api/login';
        client.get(route).subscribe(
            (response) => {
                expect(response).toBeFalsy();
            },
            (error) => {
                expect(error).toBeTruthy();
                expect(error.error).toBe('unauthenticated');
            }
        );

        backend.expectOne(route).flush({}, errorResponse);

        expect(toastrSpy).toHaveBeenCalledTimes(0);
    });

});
