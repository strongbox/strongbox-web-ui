import {NgModule} from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListRoutesComponent } from './pages/list-routes/list-routes.component';
import { ManageRouteComponent } from './pages/manage-route/manage-route.component';
import { AuthGuard } from '../core/auth/auth.guard';

const routes: Routes = [
    {
        path: '',
        component: ListRoutesComponent,
        canActivate: [AuthGuard]
    },
    {
        path: ':uuid/edit',
        component: ManageRouteComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'create',
        component: ManageRouteComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RouteManagementRouting {

}