import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {plainToClass} from 'class-transformer';

import {AssignableRole, AssignableRolesResponse, User, UserListResponse, UserOperations, UserResponse} from '../user.model';
import {ApiResponse} from '../../core/core.model';

@Injectable({
    providedIn: 'root'
})
export class UserManagementService {

    constructor(private http: HttpClient) {
    }

    getUser(username: string, assignableRoles: boolean = false): Observable<UserResponse> {
        return this.http
            .get<UserResponse>(`/api/users/${username}?assignableRoles=${assignableRoles}`)
            .pipe(map(r => plainToClass(UserResponse, r)));
    }

    getUsers(): Observable<User[]> {
        return this.http
            .get<UserListResponse>('/api/users')
            .pipe(map((r: UserListResponse) => plainToClass(User, r.users)));
    }

    getAssignableRoles(): Observable<AssignableRole[] | any> {
        return this.http
            .get<AssignableRolesResponse>('/api/formData/assignableRoles')
            .pipe(
                map((r: AssignableRolesResponse) => {
                    const response = plainToClass(AssignableRolesResponse, r);
                    const assignableRoles = response.formDataValues.find(v => v.name === 'assignableRoles');
                    return assignableRoles ? assignableRoles.values : throwError('Could not retrieve assignable roles!');
                })
            );
    }

    /**
     * Manage an existing user or create a new one.
     *
     * @param {User} user
     * @param operation whether we're creating a new user or updating an existing one
     */
    manageUser(user: User, operation: UserOperations = UserOperations.CREATE): Observable<any> {
        let url = '/api/users';

        if (operation === UserOperations.UPDATE) {
            url += `/${user.username}`;
        }

        return this.http
            .put(url, user)
            .pipe(map(r => plainToClass(ApiResponse, r)));
    }

    deleteUser(user: User): Observable<any> {
        return this.http.delete(`/api/users/${user.username}`);
    }

}
