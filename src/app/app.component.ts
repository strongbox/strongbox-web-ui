import {ChangeDetectionStrategy, Component, HostListener, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {Actions, ofActionDispatched, Select, Store} from '@ngxs/store';
import {Navigate} from '@ngxs/router-plugin';

import {RepositorySearchService} from './modules/core/pages/search/repository-search.service';
import {AuthService} from './modules/core/auth/auth.service';
import {LogoutAction} from './modules/core/auth/state/auth.actions';
import {HideSideNavAction, OpenLoginDialogAction, ToggleSideNavAction} from './state/app.actions';
import {AppState} from './state/app.state';
import {SessionState} from './modules/core/auth/state/session.state';

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

    public searchQuery: BehaviorSubject<string> = new BehaviorSubject<string>(null);

    constructor(public router: Router,
                public auth: AuthService,
                private actions: Actions,
                private store: Store,
                private repositorySearchService: RepositorySearchService) {
    }

    @HostListener('window:keydown', ['$event'])
    onKeyup(event: KeyboardEvent) {
        if (event.code === 'KeyS' && event.altKey === true) {
            this.toggleSideNav();
        }

        if (event.code === 'KeyL' && event.altKey === true) {
            this.openLoginDialog();
        }

        if (event.code === 'KeyQ' && event.altKey === true) {
            this.store.dispatch(new LogoutAction());
        }

        if (event.code === 'KeyP' && event.altKey === true) {
            this.store.dispatch(new Navigate(['profile']));
        }

        if (event.code === 'KeyU' && event.altKey === true) {
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

    submitSearchRequest() {
        if (this.searchQuery.getValue() != null) {
            this.router.navigate(['search', this.searchQuery.getValue()]);
        }
    }

    sideNavFlex() {
        const isMobile = this.store.selectSnapshot(AppState.isMobile);
        const isSideNavOpened = this.store.selectSnapshot(AppState.isSideNavOpened);

        let fxFlexLeft = '0.1 0 9vw';
        let fxFlexRight = '0.1 0 9vw';

        if (isMobile) {
            fxFlexLeft = '1px';
            fxFlexRight = '1px';
        }

        if (!isMobile && isSideNavOpened) {
            fxFlexLeft = '10px';
            fxFlexRight = '1px';
        }

        return {
            left: fxFlexLeft,
            right: fxFlexRight
        };
    }

    ngOnInit(): void {
        this.searchQuery = this.repositorySearchService.getQueryObservable();
        this.searchQuery.pipe(debounceTime(850)).subscribe((query) => {
            if (query) {
                this.router.navigate(['search', query]);
            }
        });

        this.actions.pipe(ofActionDispatched(LogoutAction)).subscribe(() => {
            this.router.navigate(['/']);
        });
    }
}
