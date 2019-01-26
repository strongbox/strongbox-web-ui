import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {BrowseStoragesComponent} from './pages/browse-storages/browse-storages.component';
import {ManageRepositoryComponent} from './pages/manage-repository/manage-repository.component';
import {BrowseRepositoryComponent} from './pages/browse-repository/browse-repository.component';
import {AuthGuard} from '../core/auth/auth.guard';

const routes: Routes = [
    {
        path: ':storageId/create/:type',
        component: ManageRepositoryComponent,
        canActivate: [AuthGuard]
    },
    {
        path: ':storageId/:repositoryId/update',
        component: ManageRepositoryComponent,
        canActivate: [AuthGuard]
    },
    {
        path: ':storageId/:repositoryId',
        canActivate: [AuthGuard],
        children: [
            // This has been done for a reason.
            // https://www.bennadel.com/blog/3347-a-single-route-parameter-can-match-multiple-url-segments-in-angular-4-4-4.htm
            {
                path: '**',
                component: BrowseRepositoryComponent
            }
        ]
    },
    {
        path: ':storageId',
        component: BrowseStoragesComponent,
        canActivate: [AuthGuard]
    },
    {
        path: '',
        component: BrowseStoragesComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StorageManagementRoutingModule {
}
