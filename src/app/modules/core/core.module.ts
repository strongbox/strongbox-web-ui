import {NgModule, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {FlexLayoutModule} from '@angular/flex-layout';
import {RouterModule} from '@angular/router';
import {NgProgressModule} from '@ngx-progressbar/core';
import {NgProgressHttpModule} from '@ngx-progressbar/http';
import {NgxsReduxDevtoolsPluginModule} from '@ngxs/devtools-plugin';
import {NgxsRouterPluginModule} from '@ngxs/router-plugin';
import {NgxsModule} from '@ngxs/store';
import {NgxsLoggerPluginModule} from '@ngxs/logger-plugin';
import {NgxsFormPluginModule} from '@ngxs/form-plugin';
import {ToastrModule} from 'ngx-toastr';

import {MaterialModule} from '../../shared/material.module';
import {PageNotFoundComponent} from './pages/page-not-found/page-not-found.component';
import {HomepageComponent} from './pages/homepage/homepage.component';
import {RepositorySearchResultsComponent} from './pages/search/repository-search-results.component';
import {environment} from '../../../environments/environment';
import {ApiURLInterceptor} from './services/interceptors/api-url.interceptor';
import {RepositorySearchService} from './pages/search/repository-search.service';
import {SessionState} from './auth/state/session.state';
import {AuthService} from './auth/auth.service';
import {LoginDialogComponent} from './dialogs/login/login.dialog.component';
import {AppState} from '../../state/app.state';
import {TokenInterceptor} from './services/interceptors/token.interceptor';
import {AuthGuard} from './auth/auth.guard';
import {MyAccountComponent} from './pages/account/my-account.component';
import {AccountService} from './pages/account/account.service';
import {AccountFormState} from './pages/account/state/accountFormState';
import {ErrorInterceptor} from './services/interceptors/error.interceptor';
import {ConfirmDialogComponent} from './dialogs/confirm/confirm.dialog.component';
import {FormHelperModule} from '../../shared/form/form-helper.module';
import {LayoutModule} from '../../shared/layout/layout.module';
import {NgProgressRouterModule} from '@ngx-progressbar/router';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,

        // User Interface (layout, material, etc)
        FlexLayoutModule,
        LayoutModule,
        MaterialModule,
        FormHelperModule,
        ToastrModule.forRoot({
            autoDismiss: true,
            disableTimeOut: false,
            progressBar: true,
            preventDuplicates: false,
            progressAnimation: 'decreasing',
            timeOut: 3500,
            extendedTimeOut: 2000,
            positionClass: 'toast-bottom-right'
        }),

        // State management
        NgxsModule.forRoot([
            AppState,
            SessionState,
            AccountFormState
        ]),
        NgxsRouterPluginModule.forRoot(),
        NgxsFormPluginModule.forRoot(),

        (environment.production === false ? NgxsReduxDevtoolsPluginModule.forRoot() : []),
        (environment.production === false ? NgxsLoggerPluginModule.forRoot() : []),

        // Fancy progress loader.
        NgProgressModule.withConfig({
            color: '#2684bd',
            spinner: false,
            thick: false,
            fixed: true,
            debounceTime: 50
        }),
        NgProgressHttpModule,
        NgProgressRouterModule
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        MaterialModule,
        FormHelperModule,

        NgxsModule,
        NgxsRouterPluginModule,

        NgProgressModule,
        NgProgressHttpModule,

        LoginDialogComponent,
        ConfirmDialogComponent
    ],
    declarations: [
        HomepageComponent,
        LoginDialogComponent,
        ConfirmDialogComponent,
        RepositorySearchResultsComponent,
        PageNotFoundComponent,
        MyAccountComponent
    ],
    entryComponents: [
        LoginDialogComponent,
        ConfirmDialogComponent
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ApiURLInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ErrorInterceptor,
            multi: true
        },
        AuthService,
        AuthGuard,
        AccountService,
        RepositorySearchService,
    ]
})
export class CoreModule {
    /* make sure CoreModule is imported only by one NgModule the AppModule */
    constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
        if (parentModule) {
            throw new Error('CoreModule is already loaded. Import only in AppModule');
        }
    }
}
