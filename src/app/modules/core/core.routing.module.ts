import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomepageComponent} from './pages/homepage/homepage.component';
import {PageNotFoundComponent} from './pages/page-not-found/page-not-found.component';
import {RepositorySearchResultsComponent} from './pages/search/repository-search-results.component';
import {CoreRouterResolver} from './core.router.resolver';

const routes: Routes = [
    {path: '', component: HomepageComponent, resolve: {crisis: CoreRouterResolver}},
    {path: 'search', redirectTo: 'search/', pathMatch: 'full'},
    {path: 'search/:query', component: RepositorySearchResultsComponent, resolve: {crisis: CoreRouterResolver}},
    {path: '**', component: PageNotFoundComponent, resolve: {crisis: CoreRouterResolver}}
];

@NgModule({
    // TODO Preload modules to which we actually have access to.
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class CoreRoutingModule {
}
