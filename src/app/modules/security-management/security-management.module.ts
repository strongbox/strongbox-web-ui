import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SecurityManagementRoutingModule} from './security-management-routing.module';
import {SecurityManagementIndexComponent} from './pages/security-management-index/security-management-index.component';
import {MaterialModule} from '../../shared/material.module';
import {LayoutModule} from '../../shared/layout/layout.module';
import {FormHelperModule} from '../../shared/form/form-helper.module';
import {SecurityLdapConfigurationComponent} from './pages/ldap-management/security-ldap-configuration/security-ldap-configuration.component';
import {SecurityLdapRoleMappingFormFieldComponent} from './pages/ldap-management/security-ldap-configuration/components/security-ldap-role-mapping-form-field/security-ldap-role-mapping-form-field.component';

@NgModule({
    declarations: [
        SecurityManagementIndexComponent,
        SecurityLdapConfigurationComponent,
        SecurityLdapRoleMappingFormFieldComponent
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
