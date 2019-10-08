import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {AuthGuard} from '../core/auth/auth.guard';
import {ManageLoggersComponent} from './pages/manage-loggers/manage-loggers.component';

const routes: Routes = [
    {
        path: '',
        component: ManageLoggersComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LoggingManagementRouting {
}
