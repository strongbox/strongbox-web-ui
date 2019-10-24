import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {AuthGuard} from '../core/auth/auth.guard';
import {ManageLoggersComponent} from './pages/manage-loggers/manage-loggers.component';
import {StreamLogComponent} from './pages/stream-log/stream-log.component';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: ManageLoggersComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'stream',
        component: StreamLogComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LoggingManagementRouting {
}
