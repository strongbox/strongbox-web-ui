import {NgModule} from '@angular/core';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {CommonModule} from '@angular/common';

import {ListRoutesComponent} from './pages/list-routes/list-routes.component';
import {RouteManagementService} from './services/route-management.service';
import {RouteManagementRouting} from './route-management.routing';
import {LayoutModule} from 'src/app/shared/layout/layout.module';
import {MaterialModule} from 'src/app/shared/material.module';
import {ManageRouteComponent} from './pages/manage-route/manage-route.component';
import {FormHelperModule} from 'src/app/shared/form/form-helper.module';

@NgModule({
    imports: [
        DragDropModule,
        CommonModule,
        RouteManagementRouting,
        LayoutModule,
        MaterialModule,
        FormHelperModule
    ],
    declarations: [
        ListRoutesComponent,
        ManageRouteComponent
    ],
    providers: [
        RouteManagementService
    ]
})
export class RouteManagementModule {

}
