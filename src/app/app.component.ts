import {ChangeDetectionStrategy, Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {animate, group, state, style, transition, trigger} from '@angular/animations';
import {Actions, Select, Store} from '@ngxs/store';
import {Navigate} from '@ngxs/router-plugin';
import {Subject} from 'rxjs';

import {AuthService} from './modules/core/auth/auth.service';
import {LogoutAction} from './modules/core/auth/state/auth.actions';
import {OpenLoginDialogAction, SearchQuerySubmitAction} from './state/app.actions';
import {AppState} from './state/app.state';
import {SessionState} from './modules/core/auth/state/session.state';
import {AbstractAutocompleteDataSource} from './shared/form/autocomplete/autocomplete.model';
import {AqlAutocompleteDataSource} from './shared/form/autocomplete/aql-autocomplete/aql-autocomplete.data-source';
import {AqlAutocompleteService} from './shared/form/services/aql-autocomplete.service';

@Component({
    selector: 'app-strongbox',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('slideInOut', [
            state('in', style({top: '*', height: '*', opacity: 0})),

            transition(':leave', [
                group([
                    animate('250ms cubic-bezier(.95,.59,.36,1.04)', style({top: '-20px'})),
                    animate(150, style({opacity: 0}))
                ])

            ]),

            transition(':enter', [
                style({height: '*', top: '-20px', opacity: 0}),

                group([
                    animate('250ms cubic-bezier(.36,1.04,.59,.95)', style({top: 0})),
                    animate(150, style({opacity: 1}))
                ])

            ])
        ]),
        trigger('slideSideInOut', [
            state('in', style({left: '*', height: '*', opacity: 0})),

            transition(':leave', [
                group([
                    animate('250ms cubic-bezier(.95,.59,.36,1.04)', style({left: '-30px'})),
                    animate(150, style({opacity: 0}))
                ])

            ]),

            transition(':enter', [
                style({height: '*', left: '-20px', opacity: 0}),

                group([
                    animate('250ms cubic-bezier(.36,1.04,.59,.95)', style({left: 0})),
                    animate(200, style({opacity: 1}))
                ])

            ])
        ])
    ]
})
export class AppComponent implements OnInit, OnDestroy {

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

    @Select(AppState.isHomepage)
    public isHomepage$;

    public navigation = [
        {title: 'Dashboard', url: ['/admin/dashboard'], icon: 'ion-md-desktop'},
        {
            title: 'Storages',
            url: ['/admin/storages'],
            icon: 'ion-md-cube',
            // https://github.com/angular/angular/issues/22588
            alternatives: [
                ['/admin/storages']
            ]
        },
        {title: 'Security', url: ['/admin/security'], icon: 'ion-md-lock', marginLeft: '2px'},
        {title: 'Users', url: ['/admin/users'], icon: 'ion-md-people'},
        {title: 'Routes', url: ['/admin/routes'], icon: 'ion-md-git-branch'},
        {title: 'System', url: ['/admin/server-settings'], icon: 'ion-md-build'},
        {title: 'About', url: ['/admin/environment-info'], icon: 'ion-md-information-circle-outline'},
        {title: 'My account', url: ['/my-account'], icon: 'ion-md-person'}
    ];

    private destroy$: Subject<any> = new Subject();

    constructor(public auth: AuthService,
                private activatedRoute: ActivatedRoute,
                private aqlService: AqlAutocompleteService,
                private actions: Actions,
                private router: Router,
                private store: Store) {
    }

    @HostListener('window:keydown', ['$event'])
    onKeyup(event: KeyboardEvent) {
        if (event.code === 'KeyH' && event.altKey === true) {
            event.preventDefault();
            this.store.dispatch(new Navigate(['/']));
        }

        if (event.code === 'KeyS' && event.altKey === true) {
            event.preventDefault();
            // this.toggleSideNav();
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
            this.store.dispatch(new Navigate(['/my-account']));
        }

        if (event.code === 'KeyU' && event.altKey === true) {
            event.preventDefault();
            this.store.dispatch(new Navigate(['/admin/users']));
        }
    }

    openLoginDialog() {
        this.store.dispatch(new OpenLoginDialogAction());
    }

    submitSearchRequest(searchQuery = '') {
        this.store.dispatch(new SearchQuerySubmitAction(searchQuery));
    }

    ngOnInit(): void {
        this.aqlDataSource = new AqlAutocompleteDataSource(
            null,
            (search, cursorPosition) => this.aqlService.search(search, cursorPosition)
        );
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
