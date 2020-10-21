import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MediaChange, MediaObserver} from '@angular/flex-layout';
import {Action, NgxsOnInit, Select, Selector, State, StateContext} from '@ngxs/store';
import {Navigate, RouterNavigation} from '@ngxs/router-plugin';
import {filter, take} from 'rxjs/operators';
import {NavigationStart, Router} from '@angular/router';

import {
    CloseLoginDialogAction,
    HideSideNavAction,
    OpenLoginDialogAction,
    SearchQuerySubmitAction,
    SearchQueryValueUpdateAction,
    SetViewPortAction,
    ShowSideNavAction,
    ToggleSideNavAction
} from './app.actions';
import {LoginDialogComponent} from '../modules/core/dialogs/login/login.dialog.component';
import {AppStateModel, defaultAppState, SideNavStateModel, ViewPortStateModel} from './app.state.interfaces';
import {LogoutAction} from '../modules/core/auth/state/auth.actions';

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
    static aqlQuery(state: AppStateModel) {
        return state.aqlQuery;
    }

    @Selector()
    static isMobile(state: AppStateModel) {
        return state.viewPort.mobile;
    }

    @Selector()
    static viewport(state: AppStateModel): ViewPortStateModel {
        return state.viewPort;
    }

    @Selector()
    static isLoginModalOpened(state: AppStateModel) {
        return state.loginModalOpened;
    }

    @Selector()
    static isHomepage(state: AppStateModel) {
        return state.isHomepage;
    }

    constructor(private dialog: MatDialog,
                private mediaObserver: MediaObserver,
                private router: Router) {
    }

    ngxsOnInit(ctx: StateContext<AppStateModel>) {
        this.mediaObserver.media$.subscribe((change: MediaChange) => {
            const isMobile = (change.mqAlias === 'xs' || change.mqAlias === 'sm' || change.mqAlias === 'md');

            const sideNav: SideNavStateModel = {
                opened: false,
                position: isMobile ? 'end' : 'start',
                mode: isMobile ? 'over' : 'side',
            };

            ctx.dispatch(new SetViewPortAction({mobile: isMobile, mqAlias: change.mqAlias, sideNav: sideNav}));
        });

        this.router
            .events
            .pipe(filter((e) => e instanceof NavigationStart))
            .subscribe((event: NavigationStart) => {
                ctx.patchState({...ctx.getState(), isHomepage: event.url === '/' || event.url === ''});
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
            viewPort: <ViewPortStateModel>{
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
    closeLoginDialogAction(ctx: StateContext<AppStateModel>, {payload}) {
        if (ctx.getState().loginModalOpened) {
            ctx.patchState({loginModalOpened: false});
        }

        if (payload instanceof MatDialogRef) {
            payload.close(null);
        }
    }

    @Action(LogoutAction)
    logoutAction(ctx: StateContext<AppStateModel>) {
        ctx.dispatch(new Navigate(['/']));
    }

    @Action(SearchQueryValueUpdateAction)
    updateAqlQueryValue(ctx: StateContext<AppStateModel>, {payload}) {
        ctx.patchState({aqlQuery: payload});
    }

    @Action(SearchQuerySubmitAction)
    submitAqlQuery(ctx: StateContext<AppStateModel>, {payload}) {
        ctx.patchState({aqlQuery: payload});
        if (payload !== null && payload !== '') {
            ctx.dispatch(new Navigate(['search', payload]));
        }
    }

}
