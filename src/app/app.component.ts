import {ChangeDetectionStrategy, Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {Actions, ofActionDispatched, Select, Store} from '@ngxs/store';
import {Navigate} from '@ngxs/router-plugin';
import {distinctUntilChanged} from 'rxjs/operators';

import {AuthService} from './modules/core/auth/auth.service';
import {LogoutAction} from './modules/core/auth/state/auth.actions';
import {
    SearchQuerySubmitAction,
    SearchQueryValueUpdateAction,
    HideSideNavAction,
    OpenLoginDialogAction,
    ToggleSideNavAction
} from './state/app.actions';
import {AppState} from './state/app.state';
import {SessionState} from './modules/core/auth/state/session.state';
import {AqlAutocompleteService} from './shared/form/services/aql-autocomplete.service';
import {AbstractAutocompleteDataSource} from './shared/form/autocomplete/autocomplete.model';
import {AqlAutocompleteDataSource} from './shared/form/autocomplete/aql-autocomplete/aql-autocomplete.data-source';
import {AqlAutocompleteComponent} from './shared/form/autocomplete/aql-autocomplete/aql-autocomplete.component';

@Component({
    selector: 'app-strongbox',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

    @Select()
    public session$;

    @Select(SessionState.isAuthenticated)
    public isAuthenticated$;

    @Select(AppState.sideNav)
    public sideNav$;

    @Select(AppState.isSideNavOpened)
    public sideNavOpened$;

    @Select(AppState.isMobile)
    public isMobile$;

    @Select(AppState.aqlQuery)
    public aqlQuery$;

    public aqlDataSource: AbstractAutocompleteDataSource;

    @ViewChild('aqlSearch')
    private aqlSearch: AqlAutocompleteComponent;

    constructor(public router: Router,
                public auth: AuthService,
                private aqlService: AqlAutocompleteService,
                private actions: Actions,
                private store: Store) {
    }

    @HostListener('window:keydown', ['$event'])
    onKeyup(event: KeyboardEvent) {
        if (event.code === 'KeyS' && event.altKey === true) {
            event.preventDefault();
            this.toggleSideNav();
        }

        if (event.code === 'KeyL' && event.altKey === true) {
            event.preventDefault();
            this.openLoginDialog();
        }

        if (event.code === 'KeyQ' && event.altKey === true) {
            event.preventDefault();
            this.store.dispatch(new LogoutAction());
        }

        if (event.code === 'KeyP' && event.altKey === true) {
            event.preventDefault();
            this.store.dispatch(new Navigate(['profile']));
        }

        if (event.code === 'KeyU' && event.altKey === true) {
            event.preventDefault();
            this.store.dispatch(new Navigate(['admin/users']));
        }
    }

    openLoginDialog() {
        this.store.dispatch(new OpenLoginDialogAction());
    }

    closeSideNavBackdropClick() {
        this.store.dispatch(new HideSideNavAction());
    }

    toggleSideNav() {
        this.store.dispatch(new ToggleSideNavAction());
    }

    submitSearchRequest(searchQuery = '') {
        this.store.dispatch(new SearchQuerySubmitAction(searchQuery));
    }

    sideNavFlex() {
        const isMobile = this.store.selectSnapshot(AppState.isMobile);
        const isSideNavOpened = this.store.selectSnapshot(AppState.isSideNavOpened);

        let fxFlexLeft = '245px';
        let fxFlexRight = '245px';

        if (isMobile) {
            fxFlexLeft = '1px';
            fxFlexRight = '1px';
        }

        if (!isMobile && isSideNavOpened) {
            fxFlexLeft = '5px';
            fxFlexRight = '1px';
        }

        return {
            left: fxFlexLeft,
            right: fxFlexRight
        };
    }

    ngOnInit(): void {
        this.aqlDataSource = new AqlAutocompleteDataSource(
            null,
            (search, cursorPosition) => this.aqlService.search(search, cursorPosition)
        );

        // set aql search input value
        this.actions
            .pipe(ofActionDispatched(SearchQueryValueUpdateAction), distinctUntilChanged())
            .subscribe(({payload: value}) => {
                this.aqlSearch.setInputValue(value);
            });
    }
}
