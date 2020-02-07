import {Component, OnInit} from '@angular/core';
import {Breadcrumb} from '../../../../shared/layout/components/breadcrumb/breadcrumb.model';

@Component({
    selector: 'app-security-management-index',
    templateUrl: './security-management-index.component.html',
    styleUrls: ['./security-management-index.component.scss']
})
export class SecurityManagementIndexComponent implements OnInit {

    breadcrumbs: Breadcrumb[] = [
        {label: 'Security management', url: ['/admin/security']}
    ];

    links = [
/*        {
            route: ['providers'],
            icon: 'ion-md-funnel',
            title: 'Authentication Providers Order',
            content: 'Configure the order in which the authentication providers are cycled through.'
        },
        {
            route: ['roles'],
            icon: 'ion-md-lock',
            title: 'Role management',
            content: 'Create and manage roles to further fine-tune user access level.'
        },*/
        {
            route: ['ldap/configuration'],
            icon: 'ion-md-settings',
            title: 'LDAP Configuration',
            content: 'Configure the LDAP connection and map the external LDAP roles to existing Strongbox roles.'
        }
    ];

    constructor() {
    }

    ngOnInit() {
    }

}
