export class User {
    username: string;
    enabled: boolean;
    roles: UserRole[];
    securityTokenKey: string;
    accessModel: UserAccessModel;
}

export class UserRole {
    name;
}

export class UserAccessModel {
    repositoryPrivileges: any;
    urlToPrivilegesMap: any;
    wildCardPrivilegesMap: any;
}

export class UserAccessUrlPrivilege {
    constructor(public path: string, public privileges: string[]) {
    }
}

export class UserListAPIResponse {
    users: User[];
}

