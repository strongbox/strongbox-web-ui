import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {FlexLayoutModule} from '@angular/flex-layout';

import {PageNotFoundComponent} from './pages/page-not-found/page-not-found.component';
import {HomepageComponent} from './pages/homepage/homepage.component';
import {MaterialModule} from '../../shared/material.module';
import {CoreRoutingModule} from './core.routing';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,

        FlexLayoutModule,
        MaterialModule,

        // Order is important!
        CoreRoutingModule
    ],
    exports: [
        MaterialModule,
        FlexLayoutModule,
        CoreRoutingModule
    ],
    declarations: [
        HomepageComponent,
        PageNotFoundComponent
    ]
})
export class CoreModule {
}
