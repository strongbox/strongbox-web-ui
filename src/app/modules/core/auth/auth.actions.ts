import {UserCredentials} from './auth.model';

export class LoginAction {
    static readonly type = '[Auth] Login';

    constructor(public payload: UserCredentials) {
    }
}

export class LoginSuccess {
    static readonly type = '[Auth] Login success';
}

export class LogoutAction {
    static readonly type = '[Auth] Logout';
}

export class CheckCredentials {
    static readonly type = '[Auth] Credentials check';
}

export class LoginFailed {
    static readonly type = '[Auth] Login failed';

    constructor(public payload) {
    }
}
