import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';
import {Select} from '@ngxs/store';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

import {SessionState} from '../../core/auth/state/session.state';
import {UserAuthority} from '../../core/auth/auth.model';

@Injectable()
export class ViewEnvironmentInfoGuard implements CanActivate {
    @Select(SessionState.authorities)
    protected authorities$;

    canActivate(): Observable<boolean> {
        return this.authorities$.pipe(
            map((authorities: UserAuthority[]) => {
                if (!authorities || authorities.length === 0) {
                    return false;
                }

                const filtered = authorities.filter((authority: UserAuthority) => {
                    return (authority.name === 'ADMIN');
                });

                return filtered.length > 0;
            }),

            catchError(error => {
                return of(false);
            })
        );
    }
}
