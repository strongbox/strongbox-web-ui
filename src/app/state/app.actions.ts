import {defaultAppSideNavState, SideNavStateModel} from './app.state.interfaces';
import {ApiResponse} from '../modules/core/core.model';

export class ShowSideNavAction {
    static readonly type = '[App] Show sidenav';
}

export class HideSideNavAction {
    static readonly type = '[App] Hide sidenav';
}

export class ToggleSideNavAction {
    static readonly type = '[App] Toggle sidenav';
}

export class OpenLoginDialogAction {
    static readonly type = '[App] Open login dialog';

    constructor(public payload: any = null) {
    }
}

export class CloseLoginDialogAction {
    static readonly type = '[App] Closing login dialog';

    constructor(public payload: any) {
    }
}

export class SetViewPortAction {
    static readonly type = '[App] Setting view port';

    constructor(public payload: { mobile: boolean, mqAlias: string, sideNav: SideNavStateModel } = {
        mobile: false,
        mqAlias: null,
        sideNav: defaultAppSideNavState
    }) {
    }
}

export class FormErrorAction {
    static readonly type = '[App] Form error message received';

    constructor(public payload: ApiResponse) {
    }
}
