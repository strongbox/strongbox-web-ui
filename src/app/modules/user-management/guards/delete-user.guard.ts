import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';
import {Select} from '@ngxs/store';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

import {SessionState} from '../../core/auth/session.state';
import {UserAuthority} from '../../core/auth/auth.model';

@Injectable()
export class DeleteUserGuard implements CanActivate {
    @Select(SessionState.authorities)
    private authorities$;

    canActivate(): Observable<boolean> {
        return this.authorities$.pipe(
            map((authorities: UserAuthority[]) => {
                const filtered = authorities.filter((authority: UserAuthority) => {
                    return (authority.name === 'ADMIN' || authority.name === 'DELETE_USER');
                });

                return filtered.length > 0;
            }),
            catchError(error => {
                console.error('DeleteUserGuard failed!', error);
                return of(false);
            })
        );
    }
}
