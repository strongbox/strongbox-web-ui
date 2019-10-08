import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ManageLoggersComponent} from './pages/manage-loggers/manage-loggers.component';
import {LayoutModule} from '../../shared/layout/layout.module';
import {MaterialModule} from '../../shared/material.module';
import {FormHelperModule} from '../../shared/form/form-helper.module';
import {LoggingService} from './services/logging.service';
import {LoggingManagementRouting} from './logging-management.routing';

@NgModule({
    declarations: [
        ManageLoggersComponent,
    ],
    imports: [
        CommonModule,
        LayoutModule,
        MaterialModule,
        FormHelperModule,
        LoggingManagementRouting
    ],
    providers: [
        LoggingService
    ]
})
export class LoggingManagementModule {
}
