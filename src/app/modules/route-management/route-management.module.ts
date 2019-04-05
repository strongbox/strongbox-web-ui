import {NgModule} from '@angular/core';
import { ListRoutesComponent } from './pages/list-routes/list-routes.component';
import { RouteManagementService } from './services/route-management.service';
import { RouteManagementRouting } from './route-management.routing';
import { LayoutModule } from 'src/app/shared/layout/layout.module';
import { MaterialModule } from 'src/app/shared/material.module';

@NgModule({
    imports: [
        RouteManagementRouting,
        LayoutModule,
        MaterialModule
    ],
    declarations: [
        ListRoutesComponent
    ],
    providers: [
        RouteManagementService
    ]
})
export class RouteManagementModule {

}
