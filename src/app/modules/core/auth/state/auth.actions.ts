import {UserCredentials} from '../auth.model';
import {SessionStateModel} from './session.state';

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

export class UnauthorizedAccessAction {
    static readonly type = '[Auth] Unauthorized access';

    constructor(public payload: any = null) {
    }
}

export class SetSessionStateModelAction {
    static readonly type = '[Session] Setting session state model';

    constructor(public payload: SessionStateModel = null) {
    }
}
