import {Transform, Type} from 'class-transformer';

export enum AuthenticationState {
    AUTHENTICATED       = 'authenticated',
    GUEST               = 'guest',
    INVALID_CREDENTIALS = 'invalid.credentials',
    ERROR               = 'error',
    PENDING             = 'pending'
}

export class AuthenticatedUser {
    username: string = null;
    token: string = null;
    roles: string[] = null;
    securityTokenKey: string = null;

    @Type(() => UserAuthority)
    @Transform((incoming) => {
        return incoming.map((value) => {
            if (typeof value === 'string') {
                return new UserAuthority(value);
            } else if (value instanceof UserAuthority) {
                return value;
            } else {
                console.error(value);
                throw new Error('Could not transform UserAuthority because it contained non-transformable value!');
            }

        });
    })
    authorities: UserAuthority[] = [];

    private cache = {};

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
        authority = authority ? authority.toUpperCase() : '';

        if (this.cache.hasOwnProperty(authority)) {
            return this.cache[authority];
        }

        if (this.authorities) {
            const hasAuthority = this.authorities.filter((val: UserAuthority) => {
                return val.name.toUpperCase() === authority;
            }).length > 0;

            this.cache[authority] = hasAuthority;

            return hasAuthority;
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
