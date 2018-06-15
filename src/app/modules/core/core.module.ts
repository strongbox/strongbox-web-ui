import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {FlexLayoutModule} from '@angular/flex-layout';
import {NgProgressModule} from '@ngx-progressbar/core';
import {NgProgressHttpModule} from '@ngx-progressbar/http';

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

        NgProgressModule,
        NgProgressHttpModule
    ],
    declarations: [
        HomepageComponent,
        RepositorySearchResultsComponent,
        PageNotFoundComponent,
        CodeSnippet
    ],
    providers: [
        /* Intercept and rewrite requests to point to localhost:48080 when in development */
        (environment.strongboxUrl === null ? [] : {
            provide: HTTP_INTERCEPTORS,
            useClass: ApiURLInterceptor,
            multi: true
        }),
        CoreRouterResolver,
        RepositorySearchService
    ]
})
export class CoreModule {
}
