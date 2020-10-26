import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxsModule} from '@ngxs/store';
import {DragDropModule} from '@angular/cdk/drag-drop';

import {StorageManagementRoutingModule} from './storage-management-routing.module';
import {MaterialModule} from '../../shared/material.module';
import {LayoutModule} from '../../shared/layout/layout.module';
import {FormHelperModule} from '../../shared/form/form-helper.module';
import {ManageRepositoryComponent} from './pages/manage-repository/manage-repository.component';
import {BrowseStoragesComponent} from './pages/browse-storages/browse-storages.component';
import {ListStoragesComponent} from './pages/browse-storages/components/list-storages/list-storages.component';
import {ListRepositoriesComponent} from './pages/browse-storages/components/list-repositories/list-repositories.component';
import {StorageFormDialogComponent} from './dialogs/storage-form/storage-form.dialog.component';
import {BrowseStoragesState} from './pages/browse-storages/state/browse-storages.state.model';
import {BrowseRepositoryComponent} from './pages/browse-repository/browse-repository.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        DragDropModule,
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
        BrowseRepositoryComponent
    ]
})
export class StorageManagementModule {
}
