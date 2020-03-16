import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ChartsModule} from 'ng2-charts';

import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {DashboardRoutingModule} from './dashboard-routing.module';
import {DashboardMetricsService} from './services/dashboard-metrics.service';
import {MaterialModule} from '../../shared/material.module';
import {LayoutModule} from '../../shared/layout/layout.module';
import {CpuStatsComponent} from './pages/dashboard/components/cpu-stats/cpu-stats.component';
import {JvmMemoryStatsComponent} from './pages/dashboard/components/jvm-memory-stats/jvm-memory-stats.component';
import {JvmLiveThreadsStatsComponent} from './pages/dashboard/components/jvm-live-threads-stats/jvm-live-threads-stats.component';

@NgModule({
    imports: [
        CommonModule,

        LayoutModule,
        MaterialModule,

        ChartsModule,

        DashboardRoutingModule
    ],
    declarations: [
        DashboardComponent,
        CpuStatsComponent,
        JvmMemoryStatsComponent,
        JvmLiveThreadsStatsComponent
    ],
    providers: [
        DashboardMetricsService
    ]
})
export class DashboardModule {
}
