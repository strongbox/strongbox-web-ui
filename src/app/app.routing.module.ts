import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {AuthGuard} from './modules/core/auth/auth.guard';
import {HomepageComponent} from './modules/core/pages/homepage/homepage.component';
import {PageNotFoundComponent} from './modules/core/pages/page-not-found/page-not-found.component';
import {RepositorySearchResultsComponent} from './modules/core/pages/search/repository-search-results.component';
import {MyAccountComponent} from './modules/core/pages/account/my-account.component';
import {RepositorySearchResultResolver} from './modules/core/resolvers/RepositorySearchResultResolver';

const routes: Routes = [
    {path: '', component: HomepageComponent},
    {path: 'search', redirectTo: 'search/', pathMatch: 'full'},
    {
        path: 'search/:query',
        component: RepositorySearchResultsComponent,
        resolve: {
            searchResponse: RepositorySearchResultResolver
        }
    },
    {path: 'my-account', component: MyAccountComponent, canActivate: [AuthGuard]},
    {
        path: 'admin/users',
        loadChildren: './modules/user-management/user-management.module#UserManagementModule'
    },
    {
        path: 'admin/server-settings',
        loadChildren: './modules/server-settings/server-settings.module#ServerSettingsModule'
    },
    {
        path: 'admin/environment-info',
        loadChildren: './modules/environment-info/environment-info.module#EnvironmentInfoModule'
    },
    {path: '**', component: PageNotFoundComponent}
];

@NgModule({
    // TODO Preload modules to which we actually have access to.
    imports: [RouterModule.forRoot(routes, {urlUpdateStrategy: 'eager'})],
    exports: [RouterModule],
    providers: [
        RepositorySearchResultResolver
    ]
})
export class AppRoutingModule {
}

