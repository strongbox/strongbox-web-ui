import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {EnvironmentInfoRoutingModule} from './environment-info-routing.module';
import {EnvironmentInfoComponent} from './pages/environment-info/environment-info.component';
import {EnvironmentInfoService} from './services/environment-info.service';
import {MaterialModule} from '../../shared/material.module';
import {LayoutModule} from '../../shared/layout/layout.module';
import {ViewEnvironmentInfoGuard} from './guards/view-environment-info.guard';

@NgModule({
    imports: [
        CommonModule,
        EnvironmentInfoRoutingModule,
        MaterialModule,
        LayoutModule
    ],
    declarations: [EnvironmentInfoComponent],
    providers: [EnvironmentInfoService, ViewEnvironmentInfoGuard]
})
export class EnvironmentInfoModule {
}
