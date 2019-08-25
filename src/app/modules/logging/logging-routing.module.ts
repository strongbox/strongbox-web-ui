import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {AuthGuard} from '../core/auth/auth.guard';
import {LoggingComponent} from './pages/logging/logging.component';

const routes: Routes = [
    {
        path: '',
        component: LoggingComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LoggingRoutingModule {
}
