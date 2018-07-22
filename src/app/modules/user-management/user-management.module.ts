import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ViewUserGuard} from './guards/view-user.guard';

import {ListUsersComponent} from './pages/list-users/list-users.component';
import {UserManagementRouting} from './user-management.routing';
import {UserManagementService} from './services/user-management.service';
import {MaterialModule} from '../../shared/material.module';
import { ViewUserComponent } from './pages/view-user/view-user.component';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        UserManagementRouting
    ],
    declarations: [
        ListUsersComponent,
        ViewUserComponent
    ],
    providers: [
        ViewUserGuard,
        UserManagementService
    ]
})
export class UserManagementModule {
}
