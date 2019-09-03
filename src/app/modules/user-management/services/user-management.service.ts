import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {plainToClass} from 'class-transformer';

import {UserRole, User, UserFormFieldsData, UserListResponse, UserOperations, UserResponse} from '../user.model';
import {ApiFormDataValuesResponse, ApiResponse} from '../../core/core.model';

@Injectable({
    providedIn: 'root'
})
export class UserManagementService {

    constructor(private http: HttpClient) {
    }

    getUser(username: string, formFields: boolean = false): Observable<UserResponse> {
        return this.http
            .get<UserResponse>(`/api/users/${username}?formFields=${formFields}`)
            .pipe(map(r => plainToClass(UserResponse, r)));
    }

    getUsers(): Observable<User[]> {
        return this.http
            .get<UserListResponse>('/api/users')
            .pipe(map((r: UserListResponse) => plainToClass(User, r.users as Object[])));
    }

    getUserFormFields(): Observable<UserRole[] | any> {
        return this.http
            .get('/api/formData/userFields')
            .pipe(
                map((r: ApiFormDataValuesResponse): UserFormFieldsData => {
                    const response = plainToClass(ApiFormDataValuesResponse, r);

                    const assignableRoles = response.formDataValues
                        .find(v => v.name === 'assignableRoles')
                        .values
                        .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

                    let userFormFields = {
                        assignableRoles: assignableRoles
                    };

                    return plainToClass(UserFormFieldsData, userFormFields);
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
