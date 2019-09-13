import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {LoggingComponent} from './pages/logging/logging.component';
import {LayoutModule} from '../../shared/layout/layout.module';
import {MaterialModule} from '../../shared/material.module';
import {FormHelperModule} from '../../shared/form/form-helper.module';
import {LoggingService} from './services/logging.service';
import {LoggingManagementRouting} from './logging-management.routing';
import {AddLoggerDialogComponent} from './dialogs/add-logger/add-logger.dialog.component';

@NgModule({
    declarations: [
        LoggingComponent,
        AddLoggerDialogComponent
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
    ],
    entryComponents: [
        AddLoggerDialogComponent
    ]
})
export class LoggingManagementModule {
}
