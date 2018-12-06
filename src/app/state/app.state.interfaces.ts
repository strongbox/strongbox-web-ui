// This is in a separate file to prevent "Circular dependency" warnings.

export interface SideNavStateModel {
    opened: boolean;
    position: string;
    mode: string;
}

export interface ViewPortStateModel {
    mobile: boolean;
    tablet: boolean;
    laptop: boolean;
    normal: boolean;
    large: boolean;
    mqAlias: string;
}

export interface AppStateModel {
    sideNav: SideNavStateModel;
    aqlQuery: string | null;
    loginModalOpened: boolean;
    viewPort: ViewPortStateModel;
    isHomepage: boolean;
}

export const defaultAppSideNavState: SideNavStateModel = {
    opened: false,
    position: 'start',
    mode: 'side'
};

export const defaultAppState: AppStateModel = {
    sideNav: defaultAppSideNavState,
    aqlQuery: null,
    loginModalOpened: false,
    isHomepage: true,
    viewPort: {
        mobile: false,
        tablet: false,
        laptop: false,
        normal: true,
        large: false,
        mqAlias: null
    }
};
