import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxsFormPluginModule} from '@ngxs/form-plugin';
import {NgxsModule} from '@ngxs/store';

import {ViewUserGuard} from './guards/view-user.guard';
import {UpdateUserGuard} from './guards/update-user.guard';
import {DeleteUserGuard} from './guards/delete-user.guard';
import {CreateUserGuard} from './guards/create-user.guard';

import {ListUsersComponent} from './pages/list-users/list-users.component';
import {UserManagementRouting} from './user-management.routing';
import {UserManagementService} from './services/user-management.service';
import {MaterialModule} from '../../shared/material.module';
import {ViewUserComponent} from './pages/view-user/view-user.component';
import {ManageUserComponent} from './pages/manage-user/manage-user.component';
import {FormHelperModule} from '../../shared/form/form-helper.module';
import {UserAccessModelComponent} from './pages/manage-user/form/access-model-listing/user-access-model.component';
import {FormDataService} from '../../shared/form/services/form-data.service';
import {LayoutModule} from '../../shared/layout/layout.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        LayoutModule,
        MaterialModule,
        FormHelperModule,

        NgxsModule.forFeature([]),
        NgxsFormPluginModule.forRoot(),

        UserManagementRouting
    ],
    declarations: [
        ListUsersComponent,
        ViewUserComponent,
        ManageUserComponent,
        UserAccessModelComponent
    ],
    providers: [
        ViewUserGuard,
        UpdateUserGuard,
        DeleteUserGuard,
        CreateUserGuard,
        UserManagementService,
        FormDataService
    ]
})
export class UserManagementModule {
}
