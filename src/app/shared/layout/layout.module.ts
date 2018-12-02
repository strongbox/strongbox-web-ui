import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

import {MaterialModule} from '../material.module';
import {PageContainerComponent} from './page-container/page-container.component';
import {BreadcrumbComponent} from './breadcrumb/breadcrumb.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        MaterialModule
    ],
    exports: [
        PageContainerComponent,
        BreadcrumbComponent
    ],
    declarations: [
        PageContainerComponent,
        BreadcrumbComponent
    ]
})
export class LayoutModule {
}
