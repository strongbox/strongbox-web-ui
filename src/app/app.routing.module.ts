import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {AuthGuard} from './modules/core/auth/auth.guard';
import {HomepageComponent} from './modules/core/pages/homepage/homepage.component';
import {PageNotFoundComponent} from './modules/core/pages/page-not-found/page-not-found.component';
import {RepositorySearchResultsComponent} from './modules/core/pages/search/repository-search-results.component';
import {MyAccountComponent} from './modules/core/pages/account/my-account.component';
import {RepositorySearchResultResolver} from './modules/core/resolvers/RepositorySearchResultResolver';
import {BrowseComponent} from './modules/core/pages/browse/browse.component';

const routes: Routes = [
    // Public
    {path: '', pathMatch: 'full', component: HomepageComponent},
    {
        path: 'browse',
        children: [
            // This has been done for a reason.
            // https://www.bennadel.com/blog/3347-a-single-route-parameter-can-match-multiple-url-segments-in-angular-4-4-4.htm
            {
                path: '**',
                component: BrowseComponent
            }
        ]
    },
    {path: 'search', redirectTo: 'search/', pathMatch: 'full'},
    {
        path: 'search/:query',
        component: RepositorySearchResultsComponent,
        resolve: {
            searchResponse: RepositorySearchResultResolver
        }
    },
    // Authenticated only
    {path: 'my-account', component: MyAccountComponent, canActivate: [AuthGuard]},
    // Administration
    {
        path: 'admin/environment-info',
        loadChildren: () => import('./modules/environment-info/environment-info.module').then(m => m.EnvironmentInfoModule)
    },
    {
        path: 'admin/users',
        loadChildren: () => import('./modules/user-management/user-management.module').then(m => m.UserManagementModule)
    },
    {
        path: 'admin/server-settings',
        loadChildren: () => import('./modules/server-settings/server-settings.module').then(m => m.ServerSettingsModule)
    },
    {
        path: 'admin/storages',
        loadChildren: () => import('./modules/storage-management/storage-management.module').then(m => m.StorageManagementModule)
    },
    {
        path: 'admin/routes',
        loadChildren: './modules/route-management/route-management.module#RouteManagementModule'
    },
    {
        path: 'admin/logging',
        loadChildren: './modules/logging-management/logging-management.module#LoggingManagementModule'
    },
    {path: '**', component: PageNotFoundComponent}
];

@NgModule({
    // TODO Preload modules to which we actually have access to.
    imports: [RouterModule.forRoot(routes, {urlUpdateStrategy: 'eager', scrollPositionRestoration: 'top'})],
    exports: [RouterModule],
    providers: [
        RepositorySearchResultResolver
    ]
})
export class AppRoutingModule {
}

