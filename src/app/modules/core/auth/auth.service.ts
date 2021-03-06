import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, map, share} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {Store} from '@ngxs/store';
import {plainToClass} from 'class-transformer';

import {AuthenticatedUser, AuthenticationState, UserCredentials} from './auth.model';
import {SessionStateModel} from './state/session.state';
import {LogoutAction} from './state/auth.actions';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private http: HttpClient,
                private store: Store) {
    }

    checkCredentials(): Observable<any> {
        // This is intentionally done because if we use SessionState.isAuthenticated DI is broken!
        const isAuthenticated = this.store.selectSnapshot(appState => {
            const session = appState.session;
            return session.user !== null && session.token !== null && session.state === 'authenticated';
        });

        if (isAuthenticated) {
            return this.http.get('/api/ping/token').pipe();
        }

        return of(null);
    }

    login(userCredentials: UserCredentials): Observable<SessionStateModel> {
        return this.http
            .post('/api/login', userCredentials)
            .pipe(
                map((response: any): SessionStateModel => {
                    if (response.hasOwnProperty('token') && response.token !== null) {
                        let user: AuthenticatedUser = plainToClass(AuthenticatedUser, response);
                        user.username = userCredentials.username;

                        return {
                            user: user,
                            token: user.token,
                            state: AuthenticationState.AUTHENTICATED
                        };
                    } else {
                        return {
                            user: null,
                            token: null,
                            state: (
                                response instanceof HttpErrorResponse && response.status === 401 ?
                                AuthenticationState.INVALID_CREDENTIALS : AuthenticationState.ERROR
                            ),
                            response: response
                        };
                    }
                }),
                catchError((response: any): Observable<SessionStateModel> => {
                    let session: SessionStateModel = {
                        user: null,
                        token: null,
                        state: AuthenticationState.ERROR,
                        response: response
                    };

                    if (response instanceof HttpErrorResponse) {
                        session.state = AuthenticationState.INVALID_CREDENTIALS;
                    }

                    return of(session);
                }),
                share()
            );
    }

    logout() {
        this.store.dispatch(new LogoutAction());
    }
}
