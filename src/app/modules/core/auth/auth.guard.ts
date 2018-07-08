import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';
import {Select} from '@ngxs/store';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

import {SessionState} from './session.state';

@Injectable()
export class AuthGuard implements CanActivate {
    @Select(SessionState.state)
    private state$;

    canActivate(): Observable<boolean> {
        return this.state$.pipe(
            map((state: string) => {
                return state === 'authenticated';
            }),
            catchError(error => {
                console.error('AuthGuard failed!', error);
                return of(false);
            })
        );
    }
}
