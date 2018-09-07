import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Select} from '@ngxs/store';
import {plainToClass} from 'class-transformer';


import {AuthenticatedUser} from '../../auth/auth.model';
import {ProfileUpdateData} from './profile.model';
import {SessionState} from '../../auth/state/session.state';

@Injectable({
    providedIn: 'root'
})
export class ProfileService {

    @Select(SessionState.authorities) authorities$;

    constructor(private http: HttpClient) {
    }

    profile(updateData: ProfileUpdateData = null): Observable<any> {
        if (updateData) {
            // This could return form errors - be sure to catch and properly handle them.
            return this.http.put(`/api/account`, updateData);
        } else {
            return this.http.get(`/api/account`).pipe(
                map((raw: any) => {
                    return plainToClass(AuthenticatedUser, raw);
                })
            );
        }
    }
}
