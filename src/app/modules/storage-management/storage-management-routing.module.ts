import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {BrowseStoragesComponent} from './pages/browse-storages/browse-storages.component';
import {ManageRepositoryComponent} from './pages/manage-repository/manage-repository.component';

const routes: Routes = [
    {
        path: ':storageId/create/:type',
        component: ManageRepositoryComponent
    },
    {
        path: ':storageId/:repositoryId/update',
        component: ManageRepositoryComponent
    },
    {
        path: ':storageId',
        component: BrowseStoragesComponent,
    },
    {
        path: '',
        component: BrowseStoragesComponent,
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StorageManagementRoutingModule {
}
