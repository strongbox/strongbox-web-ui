import {UserCredentials} from './auth.model';

export class LoginAction {
    static readonly type = '[Auth] Login';

    constructor(public payload: UserCredentials) {
    }
}

export class LogoutAction {
    static readonly type = '[Auth] Logout';
}

export class CheckCredentialsAction {
    static readonly type = '[Auth] Credentials check';
}

export class CredentialsExpiredAction {
    static readonly type = '[Auth] Credentials have expired';

    constructor(public payload: any = null) {
    }
}

export class InvalidCredentialsAction {
    static readonly type = '[Auth] Invalid credentials';

    constructor(public payload: any = null) {
    }
}
