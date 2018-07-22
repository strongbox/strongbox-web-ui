import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {AuthGuard} from '../core/auth/auth.guard';
import {CoreRouterResolver} from '../core/core.router.resolver';
import {ListUsersComponent} from './pages/list-users/list-users.component';
import {ViewUserGuard} from './guards/view-user.guard';
import {ViewUserComponent} from './pages/view-user/view-user.component';

const routes: Routes = [
    {
        path: '',
        component: ListUsersComponent,
        resolve: {crisis: CoreRouterResolver},
        canActivate: [AuthGuard, ViewUserGuard]
    },
    {
        path: ':username/view',
        component: ViewUserComponent,
        resolve: {crisis: CoreRouterResolver},
        canActivate: [AuthGuard, ViewUserGuard]
    },
    {
        path: ':username/edit',
        component: ListUsersComponent,
        resolve: {crisis: CoreRouterResolver},
        canActivate: [AuthGuard, ViewUserGuard]
    },
];

@NgModule({
    // TODO Preload modules to which we actually have access to.
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserManagementRouting {
}

