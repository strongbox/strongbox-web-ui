import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {FormHelperModule} from '../../shared/form/form-helper.module';
import {MaterialModule} from '../../shared/material.module';
import {LayoutModule} from '../../shared/layout/layout.module';
import {ManageSettingsComponent} from './pages/manage-settings/manage-settings.component';
import {ServerSettingsRouting} from './server-settings.routing';
import {ManageSettingsGuard} from './guards/manage-settings.guard';
import {ServerSettingsService} from './services/server-settings.service';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        LayoutModule,
        FormHelperModule,
        ServerSettingsRouting
    ],
    declarations: [ManageSettingsComponent],
    providers: [
        ManageSettingsGuard,
        ServerSettingsService
    ]
})
export class ServerSettingsModule {
}
