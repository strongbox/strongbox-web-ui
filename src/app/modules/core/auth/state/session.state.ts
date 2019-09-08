import {HttpErrorResponse} from '@angular/common/http';
import {Action, createSelector, Selector, State, StateContext, Store} from '@ngxs/store';
import {Navigate} from '@ngxs/router-plugin';
import {catchError, tap} from 'rxjs/operators';
import {of} from 'rxjs';
import {plainToClass} from 'class-transformer';

import {
    CheckCredentialsAction,
    CredentialsExpiredAction,
    InvalidCredentialsAction,
    LoginAction,
    LogoutAction,
    SetSessionStateModelAction,
    UnauthorizedAccessAction
} from './auth.actions';
import {AuthenticatedUser} from '../auth.model';
import {AuthService} from '../auth.service';
import {HideSideNavAction, OpenLoginDialogAction} from '../../../../state/app.actions';

export interface SessionStateModel {
    user: AuthenticatedUser | null;
    token: string | null;
    state: 'authenticated' | 'guest' | 'invalid.credentials' | 'error' | 'pending';
    response?: HttpErrorResponse | string | any;
}

export const defaultSessionState: SessionStateModel = {
    user: null,
    token: null,
    state: 'guest'
};

function initialSessionState() {
    let state: SessionStateModel = defaultSessionState;

    if (localStorage.getItem('session') !== '') {
        let session: SessionStateModel = defaultSessionState;

        try {
            const rawSession: any = JSON.parse(localStorage.getItem('session'));
            session = {
                user: plainToClass(AuthenticatedUser, rawSession.user) as any as AuthenticatedUser,
                token: rawSession.token,
                state: rawSession.state
            };
        } catch (e) {
            console.warn('No valid session found.');
            session = defaultSessionState;
        }

        if (session !== null && session.token !== '') {
            state = session;
        }
    }

    return state;
}

@State<SessionStateModel>({
    name: 'session',
    defaults: initialSessionState()
})
export class SessionState {

    @Selector()
    static token(session: SessionStateModel) {
        return session.token;
    }

    @Selector()
    static user(session: SessionStateModel) {
        return session.user;
    }

    @Selector()
    static state(session: SessionStateModel) {
        return session.state;
    }

    @Selector()
    static isAuthenticated(session: SessionStateModel) {
        return session.user !== null && session.token !== null && session.state === 'authenticated';
    }

    @Selector()
    static authorities(session: SessionStateModel) {
        if (session.user) {
            return session.user.authorities;
        } else {
            return null;
        }
    }

    @Selector()
    static hasAuthority(authority: string) {
        return createSelector(null, (appState: any) => {
            const user: AuthenticatedUser = appState.session.user;
            if (user) {
                return user.hasAuthority(authority);
            } else {
                return false;
            }
        });
    }

    @Selector()
    static roles(session: SessionStateModel) {
        if (session.user) {
            return session.user.roles;
        } else {
            return null;
        }
    }

    constructor(private auth: AuthService, private store: Store) {
    }

    @Action(CheckCredentialsAction)
    checkCredentials() {
        this.auth.checkCredentials().subscribe();
    }

    @Action(SetSessionStateModelAction)
    setAuthentication(ctx: StateContext<SessionStateModel>, {payload}: SetSessionStateModelAction) {
        ctx.setState(payload);
    }

    @Action(LoginAction)
    login(ctx: StateContext<SessionStateModel>, {payload}: LoginAction) {
        ctx.patchState({state: 'pending'});
        return this.auth.login(payload).pipe(
            tap((state: SessionStateModel) => {
                if (state.state === 'authenticated') {
                    localStorage.setItem('session', JSON.stringify(state));
                }
                ctx.setState(state);
            }),
            catchError((state: any, caught) => {
                ctx.patchState(defaultSessionState);
                console.log('Fatal authentication error!', state, caught);
                return of(null);
            })
        );
    }

    @Action(LogoutAction)
    logout(ctx: StateContext<SessionStateModel>) {
        if (ctx.getState().state === 'authenticated') {
            ctx.setState(defaultSessionState);
            localStorage.setItem('session', JSON.stringify(defaultSessionState));
            this.store.dispatch(new HideSideNavAction());
            this.store.dispatch(new Navigate(['/']));
        }
    }

    @Action(CredentialsExpiredAction)
    expired(ctx: StateContext<SessionStateModel>, {payload}: CredentialsExpiredAction) {
        this.store.dispatch([new LogoutAction(), new OpenLoginDialogAction(payload)]);
    }

    @Action(UnauthorizedAccessAction)
    unauthorized(ctx: StateContext<SessionStateModel>, {payload}: UnauthorizedAccessAction) {
        this.store.dispatch([new OpenLoginDialogAction(payload)]);
    }

    @Action(InvalidCredentialsAction)
    invalidCredentialsSessionState(ctx: StateContext<SessionStateModel>) {
        ctx.patchState({state: 'invalid.credentials'});
    }

}
