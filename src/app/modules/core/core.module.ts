import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {FlexLayoutModule} from '@angular/flex-layout';
import {NgProgressModule} from '@ngx-progressbar/core';
import {NgProgressHttpModule} from '@ngx-progressbar/http';
import {NgxsReduxDevtoolsPluginModule} from '@ngxs/devtools-plugin';
import {NgxsRouterPluginModule} from '@ngxs/router-plugin';
import {NgxsModule} from '@ngxs/store';
import {NgxsLoggerPluginModule} from '@ngxs/logger-plugin';
import {RouterModule} from '@angular/router';

import {MaterialModule} from '../../shared/material.module';
import {PageNotFoundComponent} from './pages/page-not-found/page-not-found.component';
import {HomepageComponent} from './pages/homepage/homepage.component';
import {RepositorySearchResultsComponent} from './pages/search/repository-search-results.component';
import {environment} from '../../../environments/environment';
import {ApiURLInterceptor} from './services/interceptors/api-url.interceptor';
import {CodeSnippet} from './pipes/code-snippet.pipe';
import {RepositorySearchService} from './pages/search/repository-search.service';
import {CoreRouterResolver} from './core.router.resolver';
import {SessionState} from './auth/session.state';
import {AuthService} from './auth/auth.service';
import {LoginDialogComponent} from './dialogs/login/login.dialog.component';
import {AppState} from '../../state/app.state';
import {TokenInterceptor} from './services/interceptors/token.interceptor';
import {AuthGuard} from './auth/auth.guard';
import {ProfileComponent} from './pages/profile/profile.component';
import {NgxsFormPluginModule} from '@ngxs/form-plugin';
import {ProfileService} from './pages/profile/profile.service';
import {ProfileFormState} from './pages/profile/state/profile.form.state';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,

        FlexLayoutModule,
        MaterialModule,

        // State management
        NgxsModule.forRoot([
            AppState,
            SessionState,
            ProfileFormState
        ]),
        NgxsRouterPluginModule.forRoot(),
        NgxsFormPluginModule.forRoot(),

        (environment.production === false ? NgxsReduxDevtoolsPluginModule.forRoot() : []),
        (environment.production === false ? NgxsLoggerPluginModule.forRoot() : []),

        // Fancy progress loader.
        NgProgressModule.forRoot({
            color: '#2684bd',
            spinner: false,
            thick: true,
            debounceTime: 100
        }),
        NgProgressHttpModule
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        MaterialModule,
        FlexLayoutModule,

        NgxsModule,
        NgxsRouterPluginModule,

        NgProgressModule,
        NgProgressHttpModule,

        LoginDialogComponent
    ],
    declarations: [
        CodeSnippet,
        HomepageComponent,
        LoginDialogComponent,
        RepositorySearchResultsComponent,
        PageNotFoundComponent,
        ProfileComponent
    ],
    entryComponents: [
        LoginDialogComponent
    ],
    providers: [
        /* Intercept and rewrite requests to point to localhost:48080 when in development */
        (environment.strongboxUrl === null ? [] : {
            provide: HTTP_INTERCEPTORS,
            useClass: ApiURLInterceptor,
            multi: true
        }),
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true
        },
        CoreRouterResolver,
        AuthService,
        AuthGuard,
        ProfileService,
        RepositorySearchService
    ]
})
export class CoreModule {
}
