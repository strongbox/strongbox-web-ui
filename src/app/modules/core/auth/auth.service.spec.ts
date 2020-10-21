import {TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpErrorResponse} from '@angular/common/http';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {NgxsModule, Store} from '@ngxs/store';

import {AuthService} from './auth.service';
import {SessionStateModel} from './state/session.state';
import {AuthenticatedUser, UserAuthority, UserCredentials} from './auth.model';

describe('AuthService', () => {
    let store: Store;
​    let service: AuthService;
    let backend: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule,
                NgxsModule.forRoot()
            ],
            providers: [
                AuthService,
                {
                    provide: MatDialogRef,
                    useValue: {
                        close: (dialogResult: any) => {
                        }
                    }
                },
                {
                    provide: MAT_DIALOG_DATA,
                    useValue: {}
                }
            ]
        });

        store = TestBed.inject(Store);
        service = TestBed.inject(AuthService);
        backend = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        // After every test, assert that there are no more pending requests.
        backend.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should handle successful login', () => {
        const credentials = new UserCredentials('my-user', 'my-pass');
        const user = new AuthenticatedUser(credentials.username, 'testing-token', [
            new UserAuthority('AUTH_1'),
            new UserAuthority('AUTH_2'),
            new UserAuthority('AUTH_3')
        ]);

        service.login(credentials).subscribe((state: SessionStateModel) => {
            expect(state).toBeTruthy();
            expect(state.user).toEqual(user);
            expect(state.token).toEqual(user.token);
            expect(state.state).toEqual('authenticated');
        });

        const testResponse = {
            token: user.token,
            authorities: user.authorities.map(val => val.name)
        };
        const request = backend.expectOne(`/api/login`);
        request.flush(testResponse);
        backend.verify();
    });


    it('should handle failed login', () => {
        const credentials = new UserCredentials('my-user', 'my-pass');

        service.login(credentials).subscribe((state: SessionStateModel) => {
            expect(state).toBeTruthy();
            expect(state.user).toEqual(null);
            expect(state.token).toEqual(null);
            expect(state.state).toEqual('invalid.credentials');
            expect(state.response.status).toEqual(401);
        });

        const serverResponse = {error: 'invalid.credentials'};
        const testResponse = new HttpErrorResponse({error: serverResponse, status: 401, statusText: 'Unauthorized'});
        const request = backend.expectOne(`/api/login`);
        request.flush(testResponse);
        backend.verify();
    });
});
