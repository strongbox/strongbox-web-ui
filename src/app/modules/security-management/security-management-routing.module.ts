import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {SecurityManagementIndexComponent} from './pages/security-management-index/security-management-index.component';
import {AuthGuard} from '../core/auth/auth.guard';
import {SecurityLdapConfigurationComponent} from './pages/ldap-management/security-ldap-configuration/security-ldap-configuration.component';

const routes: Routes = [
    {path: '', pathMatch: 'full', component: SecurityManagementIndexComponent, canActivate: [AuthGuard]},
    {path: 'ldap/configuration', component: SecurityLdapConfigurationComponent, canActivate: [AuthGuard]},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SecurityManagementRoutingModule {
}
