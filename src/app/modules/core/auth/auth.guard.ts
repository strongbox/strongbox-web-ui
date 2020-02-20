import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';
import {Select} from '@ngxs/store';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

import {SessionState} from './state/session.state';
import {AuthenticationState} from './auth.model';

@Injectable()
export class AuthGuard implements CanActivate {
    @Select(SessionState.state)
    protected state$: Observable<AuthenticationState>;

    canActivate(): Observable<boolean> {
        return this.state$.pipe(
            map((state: string) => {
                return state === AuthenticationState.AUTHENTICATED;
            }),
            catchError(error => {
                console.error('AuthGuard failed!', error);
                return of(false);
            })
        );
    }
}
