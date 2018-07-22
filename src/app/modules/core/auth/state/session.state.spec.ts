import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {HttpErrorResponse} from '@angular/common/http';
import {RouterTestingModule} from '@angular/router/testing';
import {Location} from '@angular/common';
import {NgxsModule, Store} from '@ngxs/store';

import {defaultSessionState, SessionState} from './session.state';
import {AuthenticatedUser, UserAuthority, UserCredentials} from '../auth.model';
import {LoginAction, LogoutAction} from './auth.actions';
import {AuthService} from '../auth.service';

describe('SessionState', () => {

    describe('selectors should work properly', () => {
        it('token() should return a proper value', () => {
            expect(SessionState.token({user: null, token: '1234', state: 'guest'})).toBe('1234');
            expect(SessionState.token({user: null, token: null, state: 'guest'})).toBe(null);
        });

        it('user() should return the username', () => {
            const user = new AuthenticatedUser('some-user');
            expect(SessionState.user({user: user, token: '1234', state: 'authenticated'})).toBe(user);
        });

        it('state() should return the authentication state', () => {
            expect(SessionState.state({user: null, token: '1234', state: 'authenticated'})).toBe('authenticated');
        });

        it('isAuthenticated() should return true', () => {
            expect(SessionState.isAuthenticated({
                user: new AuthenticatedUser('some-user'),
                token: '1234',
                state: 'authenticated'
            })).toBe(true);
        });

        it('isAuthenticated() should return false', () => {
            expect(SessionState.isAuthenticated({user: null, token: null, state: 'pending'})).toBe(false);
        });

        it('hasAuthority() should return true', () => {
            const userAuthority = 'SOME_ROLE';
            const userSession = {
                session: {
                    user: new AuthenticatedUser('authenticated-user', null, [new UserAuthority(userAuthority)]),
                    token: null,
                    state: 'authenticated'
                }
            };

            expect(SessionState.hasAuthority(userAuthority)(userSession)).toBe(true);
        });

        it('hasAuthority() should return false', () => {
            const userAuthority = 'SOME_ROLE';
            const userSession = {
                session: {
                    user: new AuthenticatedUser('authenticated-user', null, [new UserAuthority(userAuthority)]),
                    token: null,
                    state: 'authenticated'
                }
            };

            expect(SessionState.hasAuthority('1234')(userSession)).toBe(false);
        });
    });

    describe('should handle login, logout and errors properly', () => {
        let store: Store;
        let backend: HttpTestingController;
        let location: Location;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [
                    HttpClientTestingModule,
                    RouterTestingModule,
                    NgxsModule.forRoot([SessionState])
                ],
                providers: [
                    AuthService
                ]
            });

            store = TestBed.get(Store);
            backend = TestBed.get(HttpTestingController);
            location = TestBed.get(Location);
        });

        afterEach(() => {
            // After every test, assert that there are no more pending requests.
            backend.verify();
        });

        it('should handle successful login', () => {
            const credentials = new UserCredentials('my-user', 'my-pass');
            const user = new AuthenticatedUser(credentials.username, 'testing-token', [
                new UserAuthority('AUTH_1'),
                new UserAuthority('AUTH_2'),
                new UserAuthority('AUTH_3')
            ]);
            store.dispatch(new LoginAction(credentials));

            const testResponse = {
                token: user.token,
                authorities: user.authorities.map(val => val.name)
            };
            const request = backend.expectOne(`/api/login`);
            request.flush(testResponse);
            backend.verify();

            store.selectOnce(SessionState).subscribe(state => {
                expect(state).toBeTruthy();
                expect(state.user).toEqual(user);
                expect(state.token).toEqual(user.token);
                expect(state.state).toEqual('authenticated');
            });
        });

        it('should handle failed login', () => {
            const credentials = new UserCredentials('my-user', 'my-pass');

            store.dispatch(new LoginAction(credentials));

            const serverResponse = {error: 'invalid.credentials'};
            const testResponse = new HttpErrorResponse({error: serverResponse, status: 401, statusText: 'Unauthorized'});
            const request = backend.expectOne(`/api/login`);
            request.flush(testResponse);
            backend.verify();

            store.selectOnce(SessionState).subscribe(state => {
                expect(state).toBeTruthy();
                expect(state.user).toEqual(null);
                expect(state.token).toEqual(null);
                expect(state.state).toEqual('invalid.credentials');
                expect(state.response.status).toEqual(401);
            });
        });

        it('should handle bad response upon login', () => {
            const credentials = new UserCredentials('my-user', 'my-pass');

            store.dispatch(new LoginAction(credentials));

            const serverResponse = {};
            const testResponse = new HttpErrorResponse({error: serverResponse, status: 500, statusText: 'Internal Server Error'});
            const request = backend.expectOne(`/api/login`);
            request.flush(testResponse);
            backend.verify();

            store.selectOnce(SessionState).subscribe(state => {
                expect(state).toBeTruthy();
                expect(state.user).toEqual(null);
                expect(state.token).toEqual(null);
                expect(state.state).toEqual('error');
                expect(state.response.status).toEqual(500);
            });
        });

        it('should handle logout', () => {
            const credentials = new UserCredentials('my-user', 'my-pass');
            const user = new AuthenticatedUser(credentials.username, 'testing-token', [
                new UserAuthority('AUTH_1'),
                new UserAuthority('AUTH_2'),
                new UserAuthority('AUTH_3')
            ]);
            store.dispatch(new LoginAction(credentials));

            const testResponse = {
                token: user.token,
                authorities: user.authorities.map(val => val.name)
            };
            const request = backend.expectOne(`/api/login`);
            request.flush(testResponse);
            backend.verify();

            store.dispatch(new LogoutAction());

            store.selectOnce(SessionState).subscribe(state => {
                expect(state).toBeTruthy();
                expect(state).toBe(defaultSessionState);
            });

            expect(location.path()).toBe('');
        });
    });

});
