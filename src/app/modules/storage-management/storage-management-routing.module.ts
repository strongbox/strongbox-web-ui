import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {BrowseStoragesComponent} from './pages/browse-storages/browse-storages.component';
import {StoragesResolver} from './resolvers/storages.resolver';
import {StorageResolver} from './resolvers/storage.resolver';
import {ListStoragesComponent} from './pages/browse-storages/components/list-storages/list-storages.component';
import {ListRepositoriesComponent} from './pages/browse-storages/components/list-repositories/list-repositories.component';
import {ManageRepositoryComponent} from './pages/manage-repository/manage-repository.component';

const routes: Routes = [
    {
        path: 'browse',
        component: BrowseStoragesComponent,
        children: [
            {
                path: ':storageId',
                component: ListRepositoriesComponent,
                outlet: 'repositoriesFor',
                resolve: {
                    data: StorageResolver
                }
            },
            {
                path: '',
                component: ListRepositoriesComponent,
                outlet: 'repositoriesFor',
                resolve: {
                    data: StorageResolver
                }
            },
            {
                path: '',
                component: ListStoragesComponent,
                resolve: {
                    storages: StoragesResolver
                }
            },

        ]
    },
    {
        path: ':storageId/create/:type',
        component: ManageRepositoryComponent
    },
    {
        path: ':storageId/:repositoryId',
        component: ManageRepositoryComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StorageManagementRoutingModule {
}
