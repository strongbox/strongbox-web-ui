import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';
import {Select} from '@ngxs/store';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

import {SessionState} from '../auth/state/session.state';
import {UserAuthority} from '../auth/auth.model';

@Injectable({
    providedIn: 'root'
})
export abstract class AbstractAuthorityGuard implements CanActivate {
    @Select(SessionState.authorities)
    protected authorities$;

    canActivate(): Observable<boolean> {
        const className = this.constructor.name;

        return this.authorities$.pipe(
            map((authorities: UserAuthority[]) => {
                if (!authorities || authorities.length === 0) {
                    return false;
                }

                // Allow users with ADMIN authority.
                if (authorities.find((a: UserAuthority) => a.name.toLowerCase() === 'admin') !== undefined) {
                    return true;
                }

                if (this.allAuthoritiesCollection().length > 0) {
                    const hasAllAuthorities = this.allAuthoritiesCollection().every((str: string) => {
                        const search = authorities.find((a: UserAuthority) => a.name.toLowerCase() === str.toLowerCase());
                        return search !== undefined;
                    });

                    if (!hasAllAuthorities) {
                        return false;
                    }
                }

                if (this.anyAuthoritiesCollection().length > 0) {
                    const hasAnyAuthorities = this.anyAuthoritiesCollection().some((str) => {
                        const search = authorities.find((a: UserAuthority) => a.name.toLowerCase() === str.toLowerCase());
                        return search !== undefined;
                    });

                    if (!hasAnyAuthorities) {
                        return false;
                    }
                }

                // At this point we have user with no `admin` authority or the checks for `allAuthorities / anyAuthorities`
                // did not return false. If the collections are empty, we need to return false here.
                return this.hasEmptyCollections() !== true;
            }),
            catchError(error => {
                console.error(className + ' failed!', error);
                return of(false);
            })
        );
    }

    private hasEmptyCollections(): boolean {
        return this.allAuthoritiesCollection().length === 0 && this.anyAuthoritiesCollection().length === 0;
    }

    /**
     * List of all required authorities - will check if all of the authorities are present in the session.
     * Has higher priority than ANY_AUTHORITY and will return false if all authorities are not in the user's session.
     * If all authorities are present, will continue with ANY_AUTHORITY check.
     */
    allAuthoritiesCollection(): Array<string> {
        return [];
    }

    /**
     * List of any required authorities - will check if any of the authorities are present in the session.
     */
    anyAuthoritiesCollection(): Array<string> {
        return [];
    }
}
