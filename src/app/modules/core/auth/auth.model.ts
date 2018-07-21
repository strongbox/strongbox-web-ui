export class AuthenticatedUser {
    constructor(public username: string = null,
                public token: string = null,
                public authorities: UserAuthority[] = null,
                public roles: string[] = null,
                public securityTokenKey: string = null) {
    }

    hasAuthority(authority: string): boolean {
        if (this.authorities) {
            return this.authorities.filter((val: UserAuthority) => {
                return val.name === authority;
            }).length > 0;
        } else {
            return false;
        }
    }

    hasRole(role: string): boolean {
        if (this.roles) {
            return this.roles.filter((val) => {
                return val === role;
            }).length > 0;
        } else {
            return false;
        }
    }
}

export class UserCredentials {
    constructor(public username: string, public password: string) {
    }
}

export class UserAuthority {
    constructor(public name: string) {
    }
}
