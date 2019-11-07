import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {AuthGuard} from '../core/auth/auth.guard';
import {ManageLoggersComponent} from './pages/manage-loggers/manage-loggers.component';
import {StreamLogComponent} from './pages/stream-log/stream-log.component';
import {BrowseLogsComponent} from './pages/browse-logs/browse-logs.component';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: ManageLoggersComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'browse',
        children: [
            // This has been done for a reason.
            // https://www.bennadel.com/blog/3347-a-single-route-parameter-can-match-multiple-url-segments-in-angular-4-4-4.htm
            {
                path: '**',
                component: BrowseLogsComponent
            }
        ],
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
