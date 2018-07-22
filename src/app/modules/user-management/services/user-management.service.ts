import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

import {User, UserAccessModel, UserAccessUrlPrivilege, UserListAPIResponse, UserRole} from '../user.model';

@Injectable({
    providedIn: 'root'
})
export class UserManagementService {
    constructor(private http: HttpClient) {
    }

    getUser(username: string): Observable<User> {
        return this.http
            .get(`/api/users/${username}`)
            .pipe(
                map(rawUser => this.convertToUser(rawUser))
            );
    }

    getUsers(): Observable<User[]> {
        return this.http
            .get<UserListAPIResponse>('/api/users')
            .pipe(
                map((results: UserListAPIResponse): User[] => {
                    return results.users.map(rawUser => this.convertToUser(rawUser));
                })
            );
    }

    deleteUser(user: User) {
        return this.http.delete(`/api/users/${user.username}`);
    }

    private convertToUser(rawUser: any) {
        let user = new User();
        user.username = rawUser.username;
        user.enabled = rawUser.enabled;
        user.roles = <UserRole[]> rawUser.roles.map(rawRole => {
            return <UserRole> {
                name: rawRole
            };
        });
        user.securityTokenKey = rawUser.securityTokenKey;

        let repositoryPrivileges = [];

        const repoPrivilegesKeys: any[] = Object.keys(rawUser.accessModel.repositoryPrivileges);
        const repoPrivilegesVals: any[] = Object.values(rawUser.accessModel.repositoryPrivileges);
        if (repoPrivilegesKeys.length > 0) {
            repositoryPrivileges = repoPrivilegesKeys.map((path, index) => {
                return new UserAccessUrlPrivilege(path, repoPrivilegesVals[index]);
            });
        }

        let urlToPrivilegesMap = [];

        const urlToPrivilegesMapKeys: any[] = Object.keys(rawUser.accessModel.urlToPrivilegesMap);
        const urlToPrivilegesMapVals: any[] = Object.values(rawUser.accessModel.urlToPrivilegesMap);
        if (urlToPrivilegesMapKeys.length > 0) {
            urlToPrivilegesMap = urlToPrivilegesMapKeys.map((path, index) => {
                return new UserAccessUrlPrivilege(path, urlToPrivilegesMapVals[index]);
            });
        }


        let wildCardPrivilegesMap = [];

        const wildCardPrivilegesMapKeys: any[] = Object.keys(rawUser.accessModel.wildCardPrivilegesMap);
        const wildCardPrivilegesMapVals: any[] = Object.values(rawUser.accessModel.wildCardPrivilegesMap);
        if (wildCardPrivilegesMapKeys.length > 0) {
            wildCardPrivilegesMap = wildCardPrivilegesMapKeys.map((path, index) => {
                return new UserAccessUrlPrivilege(path, wildCardPrivilegesMapVals[index]);
            });
        }

        let accessModel = new UserAccessModel();
        accessModel.repositoryPrivileges = repositoryPrivileges;
        accessModel.urlToPrivilegesMap = urlToPrivilegesMap;
        accessModel.wildCardPrivilegesMap = wildCardPrivilegesMap;

        user.accessModel = accessModel;

        return user;
    }

}
