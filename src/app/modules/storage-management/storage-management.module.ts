import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxsModule} from '@ngxs/store';

import {StorageManagementRoutingModule} from './storage-management-routing.module';
import {MaterialModule} from '../../shared/material.module';
import {LayoutModule} from '../../shared/layout/layout.module';
import {FormHelperModule} from '../../shared/form/form-helper.module';
import {ManageRepositoryComponent} from './pages/manage-repository/manage-repository.component';
import {BrowseStoragesComponent} from './pages/browse-storages/browse-storages.component';
import {ListStoragesComponent} from './pages/browse-storages/components/list-storages/list-storages.component';
import {ListRepositoriesComponent} from './pages/browse-storages/components/list-repositories/list-repositories.component';
import {StorageFormDialogComponent} from './dialogs/storage-form/storage-form.dialog.component';
import {ManageHostedRepositoryComponent} from './pages/manage-repository/manage-hosted-repository/manage-hosted-repository.component';
import {ManageGroupRepositoryComponent} from './pages/manage-repository/manage-group-repository/manage-group-repository.component';
import {ManageProxyRepositoryComponent} from './pages/manage-repository/manage-proxy-repository/manage-proxy-repository.component';
import {BrowseStoragesState} from './pages/browse-storages/state/browse-storages.state.model';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        LayoutModule,
        MaterialModule,
        FormHelperModule,

        NgxsModule.forFeature([BrowseStoragesState]),

        StorageManagementRoutingModule,
    ],
    declarations: [
        BrowseStoragesComponent,
        ListStoragesComponent,
        ListRepositoriesComponent,
        ManageRepositoryComponent,
        StorageFormDialogComponent,
        ManageHostedRepositoryComponent,
        ManageGroupRepositoryComponent,
        ManageProxyRepositoryComponent,
    ],
    entryComponents: [
        StorageFormDialogComponent
    ]
})
export class StorageManagementModule {
}
