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

/**
 * This is used to "submit" the query to the server
 */
export class SearchQuerySubmitAction {
    static readonly type = '[App] Search query submitted';

    constructor(public payload: string = '') {
    }
}

/**
 * This is used to "update" the query (i.e. when you are directly landing at localhost/search/my-aql-query
 */
export class SearchQueryValueUpdateAction {
    static readonly type = '[App] Search query value updated';

    constructor(public payload: string = '') {
    }
}

export class FormErrorAction {
    static readonly type = '[App] Form error message received';

    constructor(public payload: ApiResponse) {
    }
}
