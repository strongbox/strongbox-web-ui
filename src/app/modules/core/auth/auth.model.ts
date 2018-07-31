import {Transform, Type} from 'class-transformer';

export class AuthenticatedUser {
    username: string = null;
    token: string = null;
    roles: string[] = null;
    securityTokenKey: string = null;

    @Type(() => UserAuthority)
    @Transform((value) => {
        if (Array.isArray(value)) {
            return value.map(str => new UserAuthority(str));
        }
        return value;
    })
    authorities: UserAuthority[] = [];

    constructor(username: string = null,
                token: string = null,
                authorities: UserAuthority[] = null,
                roles: string[] = null,
                securityTokenKey: string = null) {
        this.username = username;
        this.token = token;
        this.authorities = authorities;
        this.roles = roles;
        this.securityTokenKey = securityTokenKey;
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
