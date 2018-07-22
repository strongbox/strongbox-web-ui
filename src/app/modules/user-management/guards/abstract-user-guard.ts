import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';
import {Select} from '@ngxs/store';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

import {SessionState} from '../../core/auth/session.state';
import {UserAuthority} from '../../core/auth/auth.model';

@Injectable()
export abstract class AbstractUserGuard implements CanActivate {
    @Select(SessionState.authorities)
    protected authorities$;

    protected REQUIRED_AUTHORITY = 'ADMIN';

    canActivate(): Observable<boolean> {
        const className = this.constructor.name;

        return this.authorities$.pipe(
            map((authorities: UserAuthority[]) => {
                if (!authorities || authorities.length === 0) {
                    return false;
                }

                const filtered = authorities.filter((authority: UserAuthority) => {
                    return (authority.name === 'ADMIN' || authority.name === this.REQUIRED_AUTHORITY);
                });

                return filtered.length > 0;
            }),
            catchError(error => {
                console.error(className + ' failed!', error);
                return of(false);
            })
        );
    }
}
