import {MatDialog} from '@angular/material/dialog';
import {MediaChange, ObservableMedia} from '@angular/flex-layout';
import {Action, NgxsOnInit, Select, Selector, State, StateContext} from '@ngxs/store';
import {RouterNavigation} from '@ngxs/router-plugin';
import {take} from 'rxjs/operators';

import {
    CloseLoginDialogAction,
    HideSideNavAction,
    OpenLoginDialogAction,
    SetViewPortAction,
    ShowSideNavAction,
    ToggleSideNavAction
} from './app.actions';

import {LoginDialogComponent} from '../modules/core/dialogs/login/login.dialog.component';
import {SideNavStateModel, AppStateModel, defaultAppState, ViewPortStateModel} from './app.state.interfaces';

@State<AppStateModel>({
    name: 'app',
    defaults: defaultAppState
})
export class AppState implements NgxsOnInit {

    @Select()
    public session$;

    @Selector()
    static sideNav(state: AppStateModel): SideNavStateModel {
        return state.sideNav;
    }

    @Selector()
    static isSideNavOpened(state: AppStateModel) {
        return state.sideNav.opened === true;
    }

    @Selector()
    static query(state: AppStateModel) {
        return state.query;
    }

    @Selector()
    static isMobile(state: AppStateModel) {
        return state.viewPort.mobile;
    }

    @Selector()
    static viewport(state: AppStateModel): ViewPortStateModel {
        return state.viewPort;
    }

    constructor(private dialog: MatDialog,
                private media: ObservableMedia) {
    }

    ngxsOnInit(ctx: StateContext<AppStateModel>) {
        this.media.subscribe((change: MediaChange) => {
            const isMobile = (change.mqAlias === 'xs' || change.mqAlias === 'sm' || change.mqAlias === 'md');

            const sideNav: SideNavStateModel = {
                opened: false,
                position: isMobile ? 'end' : 'start',
                mode: isMobile ? 'over' : 'side',
            };

            ctx.dispatch(new SetViewPortAction({mobile: isMobile, mqAlias: change.mqAlias, sideNav: sideNav}));
        });
    }

    @Action(RouterNavigation)
    routerNavigation(ctx: StateContext<AppStateModel>, {routerState, event}: RouterNavigation) {
        if (ctx.getState().viewPort.mobile && ctx.getState().sideNav.opened) {
            ctx.dispatch(new HideSideNavAction());
        }
    }

    @Action(SetViewPortAction)
    setViewPort(ctx: StateContext<AppStateModel>, {payload}: SetViewPortAction) {
        const state = {
            sideNav: payload.sideNav,
            viewPort: <ViewPortStateModel> {
                mobile: payload.mobile,
                mqAlias: payload.mqAlias
            }
        };

        ctx.patchState(state);
    }

    @Action(ShowSideNavAction)
    showSideNav(ctx: StateContext<AppStateModel>) {
        const state = {
            ...ctx.getState().sideNav,
            opened: true
        };
        ctx.patchState({sideNav: state});
    }

    @Action(HideSideNavAction)
    hideSideNav(ctx: StateContext<AppStateModel>) {
        const state = {
            ...ctx.getState().sideNav,
            opened: false
        };
        ctx.patchState({sideNav: state});
    }

    @Action(ToggleSideNavAction)
    toggleSideNav(ctx: StateContext<AppStateModel>) {
        this.session$.pipe(take(1)).subscribe((session) => {
            if (session.hasOwnProperty('state') && session.state === 'authenticated') {
                const sideNavState = {
                    ...ctx.getState().sideNav,
                    opened: !ctx.getState().sideNav.opened
                };

                ctx.patchState({sideNav: sideNavState});
            }
        });
    }

    @Action(OpenLoginDialogAction)
    openLoginDialogAction(ctx: StateContext<AppStateModel>, {payload}: OpenLoginDialogAction) {
        this.session$.pipe(take(1)).subscribe((state) => {
            if (!ctx.getState().loginModalOpened && state.hasOwnProperty('state') && state.state !== 'authenticated') {
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
