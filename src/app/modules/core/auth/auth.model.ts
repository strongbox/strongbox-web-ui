export class User {
    constructor(public username: string = null,
                public token: string = null,
                public authorities: UserAuthority[] = null,
                public firstName: string = null,
                public lastName: string = null) {
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
}

export class UserCredentials {
    constructor(public username: string, public password: string) {
    }
}

export class UserAuthority {
    constructor(public name: string) {
    }
}
