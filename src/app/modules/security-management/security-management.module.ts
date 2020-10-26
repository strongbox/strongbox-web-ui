import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SecurityManagementRoutingModule} from './security-management-routing.module';
import {SecurityManagementIndexComponent} from './pages/security-management-index/security-management-index.component';
import {MaterialModule} from '../../shared/material.module';
import {LayoutModule} from '../../shared/layout/layout.module';
import {FormHelperModule} from '../../shared/form/form-helper.module';
// tslint:disable-next-line:max-line-length
import {SecurityLdapConfigurationComponent} from './pages/ldap-management/security-ldap-configuration/security-ldap-configuration.component';
import {SecurityLdapRoleMappingFormFieldComponent} from './pages/ldap-management/security-ldap-configuration/components/security-ldap-role-mapping-form-field/security-ldap-role-mapping-form-field.component';
import {LdapConnectionTestDialogComponent} from './pages/ldap-management/security-ldap-configuration/components/ldap-connection-test-dialog/ldap-connection-test-dialog.component';

@NgModule({
    declarations: [
        SecurityManagementIndexComponent,
        SecurityLdapConfigurationComponent,
        SecurityLdapRoleMappingFormFieldComponent,
        LdapConnectionTestDialogComponent
    ],
    imports: [
        CommonModule,
        LayoutModule,
        MaterialModule,
        FormHelperModule,
        SecurityManagementRoutingModule
    ]
})
export class SecurityManagementModule {
}
