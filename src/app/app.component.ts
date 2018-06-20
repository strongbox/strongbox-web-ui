import {AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnInit} from '@angular/core';
import {MediaChange, ObservableMedia} from '@angular/flex-layout';
import {Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {Actions, ofActionDispatched, Select, Store} from '@ngxs/store';

import {RepositorySearchService} from './modules/core/pages/search/repository-search.service';
import {AuthService} from './modules/core/auth/auth.service';
import {LogoutAction} from './modules/core/auth/auth.actions';
import {OpenLoginDialogAction, ToggleSideNavAction} from './state/app.actions';

@Component({
    selector: 'app-strongbox',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, AfterViewChecked {
    public isMobile;
    public searchQuery: BehaviorSubject<string> = new BehaviorSubject<string>(null);

    @Select()
    public session$;

    @Select()
    public app$;

    constructor(public router: Router,
                public media: ObservableMedia,
                public auth: AuthService,
                private actions: Actions,
                private store: Store,
                private repositorySearchService: RepositorySearchService,
                private changeDetector: ChangeDetectorRef) {
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
    }

    openLoginDialog() {
        this.store.dispatch(new OpenLoginDialogAction());
    }

    toggleSideNav() {
        this.store.dispatch(new ToggleSideNavAction());
    }

    submitSearchRequest() {
        if (this.searchQuery.getValue() != null) {
            this.router.navigate(['search', this.searchQuery.getValue()]);
        }
    }

    ngOnInit(): void {
        this.media.subscribe((change: MediaChange) => {
            this.isMobile = (change.mqAlias === 'xs' || change.mqAlias === 'sm' || change.mqAlias === 'md');
            this.changeDetector.detectChanges();
        });

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

    ngAfterViewChecked() {
        this.changeDetector.detectChanges();
    }
}
