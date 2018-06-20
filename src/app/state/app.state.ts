import {Action, Select, Selector, State, StateContext} from '@ngxs/store';
import {MatDialog} from '@angular/material/dialog';

import {CloseLoginDialogAction, HideSideNavAction, OpenLoginDialogAction, ShowSideNavAction, ToggleSideNavAction} from './app.actions';
import {LoginDialogComponent} from '../modules/core/dialogs/login/login.dialog.component';
import {take} from 'rxjs/operators';

export interface AppStateModel {
    sideNav: boolean;
    query: string | null;
    loginModalOpened: boolean;
}

export const defaultAppState: AppStateModel = {
    sideNav: false,
    query: null,
    loginModalOpened: false
};

@State<AppStateModel>({
    name: 'app',
    defaults: defaultAppState
})
export class AppState {

    @Select()
    public session$;

    @Selector()
    static sideNav(session: AppStateModel) {
        return session.sideNav;
    }

    @Selector()
    static query(session: AppStateModel) {
        return session.query;
    }

    constructor(private dialog: MatDialog) {
    }

    @Action(ShowSideNavAction)
    showSideNav(ctx: StateContext<AppStateModel>) {
        ctx.patchState({sideNav: true});
    }

    @Action(HideSideNavAction)
    hideSideNav(ctx: StateContext<AppStateModel>) {
        ctx.patchState({sideNav: false});
    }

    @Action(ToggleSideNavAction)
    toggleSideNav(ctx: StateContext<AppStateModel>) {
        this.session$.pipe(take(1)).subscribe((session) => {
            if (session.hasOwnProperty('state') && session.state === 'authenticated') {
                ctx.patchState({sideNav: !ctx.getState().sideNav});
            }
        });
    }

    @Action(OpenLoginDialogAction)
    openLoginDialogAction(ctx: StateContext<AppStateModel>, {payload}: OpenLoginDialogAction) {
        this.session$.pipe(take(1)).subscribe((session) => {
            if (!ctx.getState().loginModalOpened && session.hasOwnProperty('state') && session.state !== 'authenticated' ) {
                ctx.patchState({loginModalOpened: true});
                this.dialog.open(LoginDialogComponent, {data: payload});
            }
        });
    }

    @Action(CloseLoginDialogAction)
    closeLoginDialogAction(ctx: StateContext<AppStateModel>) {
        if (ctx.getState().loginModalOpened) {
            ctx.patchState({loginModalOpened: false});
        }
    }

}
