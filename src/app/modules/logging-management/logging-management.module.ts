import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {VirtualScrollerModule} from 'ngx-virtual-scroller';

import {ManageLoggersComponent} from './pages/manage-loggers/manage-loggers.component';
import {LayoutModule} from '../../shared/layout/layout.module';
import {MaterialModule} from '../../shared/material.module';
import {FormHelperModule} from '../../shared/form/form-helper.module';
import {LoggingService} from './services/logging.service';
import {LoggingManagementRouting} from './logging-management.routing';
import {BrowseLogsComponent} from './pages/browse-logs/browse-logs.component';
import {StreamLogComponent} from './pages/stream-log/stream-log.component';
import {StreamLogFilterComponent} from './pages/stream-log/components/stream-log-filter/stream-log-filter.component';

@NgModule({
    declarations: [
        ManageLoggersComponent,
        BrowseLogsComponent,
        StreamLogComponent,
        StreamLogFilterComponent
    ],
    imports: [
        CommonModule,
        LayoutModule,
        MaterialModule,
        VirtualScrollerModule,
        FormHelperModule,
        LoggingManagementRouting
    ],
    providers: [
        LoggingService
    ]
})
export class LoggingManagementModule {
}
