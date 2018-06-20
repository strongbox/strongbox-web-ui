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

import {MaterialModule} from '../../shared/material.module';
import {PageNotFoundComponent} from './pages/page-not-found/page-not-found.component';
import {HomepageComponent} from './pages/homepage/homepage.component';
import {RepositorySearchResultsComponent} from './pages/search/repository-search-results.component';
import {CoreRoutingModule} from './core.routing.module';
import {environment} from '../../../environments/environment';
import {ApiURLInterceptor} from './services/interceptors/api-url.interceptor';
import {CodeSnippet} from './pipes/code-snippet.pipe';
import {RepositorySearchService} from './pages/search/repository-search.service';
import {CoreRouterResolver} from './core.router.resolver';
import {SessionState} from './auth/session.state';
import {AuthService} from './auth/auth.service';
import {LoginDialogComponent} from './dialogs/login/login.dialog.component';
import {AppState} from '../../state/app.state';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,

        FlexLayoutModule,
        MaterialModule,

        // Order is important!
        CoreRoutingModule,

        // State management
        NgxsModule.forRoot([
            AppState,
            SessionState
        ]),
        NgxsRouterPluginModule.forRoot(),
        NgxsReduxDevtoolsPluginModule.forRoot(),
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
        FormsModule,
        ReactiveFormsModule,

        MaterialModule,
        FlexLayoutModule,
        CoreRoutingModule,

        NgxsModule,
        NgxsRouterPluginModule,

        NgProgressModule,
        NgProgressHttpModule,

        LoginDialogComponent
    ],
    declarations: [
        HomepageComponent,
        RepositorySearchResultsComponent,
        PageNotFoundComponent,
        CodeSnippet,
        LoginDialogComponent
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
        CoreRouterResolver,
        AuthService,
        RepositorySearchService
    ]
})
export class CoreModule {
}
