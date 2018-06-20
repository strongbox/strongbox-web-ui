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
}
