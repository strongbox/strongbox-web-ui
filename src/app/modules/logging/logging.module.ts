import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoggingComponent} from './pages/logging/logging.component';
import {LayoutModule} from '../../shared/layout/layout.module';
import {MaterialModule} from '../../shared/material.module';
import {FormHelperModule} from '../../shared/form/form-helper.module';
import {LoggingService} from './services/logging.service';
import {LoggingRoutingModule} from './logging-routing.module';
import {UpdateLoggerDialogComponent} from './dialogs/update-logger/update-logger.dialog.component';

@NgModule({
  declarations: [
    LoggingComponent,
    UpdateLoggerDialogComponent
  ],
  imports: [
    CommonModule,
    LayoutModule,
    MaterialModule,
    FormHelperModule,
    LoggingRoutingModule
  ],
  providers: [
    LoggingService
  ]
})
export class LoggingModule {
}
