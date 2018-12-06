import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {AuthGuard} from '../core/auth/auth.guard';
import {ManageSettingsComponent} from './pages/manage-settings/manage-settings.component';
import {ManageSettingsGuard} from './guards/manage-settings.guard';

const routes: Routes = [
    {
        path: '',
        component: ManageSettingsComponent,
        canActivate: [AuthGuard, ManageSettingsGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ServerSettingsRouting {
}

