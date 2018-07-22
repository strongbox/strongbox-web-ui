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

    getUsers(): Observable<User[]> {
        return this.http
            .get<UserListAPIResponse>('/api/users')
            .pipe(
                map((results: UserListAPIResponse): User[] => {
                    return results.users.map((rawUser): User => {
                        let user = new User();
                        user.username = rawUser.username;
                        user.enabled = rawUser.enabled;
                        user.roles = <UserRole[]> rawUser.roles.map(rawRole => {
                            return <UserRole> {
                                name: rawRole
                            };
                        });
                        user.securityTokenKey = rawUser.securityTokenKey;

                        let repositoryPrivileges = null;

                        const repoPrivilegesKeys: any[] = Object.keys(rawUser.accessModel.repositoryPrivileges);
                        const repoPrivilegesVals: any[] = Object.values(rawUser.accessModel.repositoryPrivileges);
                        if (repoPrivilegesKeys.length > 0) {
                            repositoryPrivileges = repoPrivilegesKeys.map((path, index) => {
                                return new UserAccessUrlPrivilege(path, repoPrivilegesVals[index]);
                            });
                        }

                        let urlToPrivilegesMap = null;

                        const urlToPrivilegesMapKeys: any[] = Object.keys(rawUser.accessModel.urlToPrivilegesMap);
                        const urlToPrivilegesMapVals: any[] = Object.values(rawUser.accessModel.urlToPrivilegesMap);
                        if (urlToPrivilegesMapKeys.length > 0) {
                            urlToPrivilegesMap = urlToPrivilegesMapKeys.map((path, index) => {
                                return new UserAccessUrlPrivilege(path, urlToPrivilegesMapVals[index]);
                            });
                        }


                        let wildCardPrivilegesMap = null;

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
                    });
                })
            );
    }

}
