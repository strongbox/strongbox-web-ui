import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, map, share} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {Select, Store} from '@ngxs/store';

import {User, UserAuthority, UserCredentials} from './auth.model';
import {SessionStateModel} from './session.state';
import {LogoutAction} from './auth.actions';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    @Select() session$;

    @Select(state => state.session.authorities) authorities$;

    constructor(private http: HttpClient,
                private store: Store) {
    }

    login(userCredentials: UserCredentials): Observable<SessionStateModel> {
        return this.http
            .post('/api/login', userCredentials)
            .pipe(
                map((response: any): SessionStateModel => {
                    if (response.hasOwnProperty('token') && response.token !== null) {
                        const user = new User(
                            userCredentials.username,
                            response.token,
                            response.authorities.map(name => new UserAuthority(name))
                        );
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
