import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, map, share} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {Store} from '@ngxs/store';

import {AuthenticatedUser, UserCredentials} from './auth.model';
import {SessionStateModel} from './state/session.state';
import {LogoutAction} from './state/auth.actions';
import {plainToClass} from 'class-transformer';

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
                            state: 'authenticated'
                        };
                    } else {
                        return {
                            user: null,
                            token: null,
                            state: (response instanceof HttpErrorResponse && response.status === 401 ? 'invalid.credentials' : 'error'),
                            response: response
                        };
                    }
                }),
                catchError((response: any): Observable<SessionStateModel> => {
                    let session: SessionStateModel = {
                        user: null,
                        token: null,
                        state: 'error',
                        response: response
                    };

                    if (response instanceof HttpErrorResponse) {
                        session.state = 'invalid.credentials';
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
