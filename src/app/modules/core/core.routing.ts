import {NgModule} from '@angular/core';
import {Routes, RouterModule, PreloadAllModules} from '@angular/router';
import {HomepageComponent} from './pages/homepage/homepage.component';
import {PageNotFoundComponent} from './pages/page-not-found/page-not-found.component';

const routes: Routes = [
    {path: '', component: HomepageComponent},
    {path: '**', component: PageNotFoundComponent}
];

@NgModule({
    // TODO Preload modules to which we actually have access to.
    imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
    exports: [RouterModule]
})
export class CoreRoutingModule {
}
