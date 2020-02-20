import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {BehaviorSubject} from 'rxjs';
import {finalize} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';

import {Breadcrumb} from '../../../../../shared/layout/components/breadcrumb/breadcrumb.model';
import {LdapConfigurationService} from '../../../services/ldap-configuration.service';
import {LdapConnectionTestDialogComponent} from './components/ldap-connection-test-dialog/ldap-connection-test-dialog.component';

@Component({
    selector: 'app-security-ldap-configuration',
    templateUrl: './security-ldap-configuration.component.html',
    styleUrls: ['./security-ldap-configuration.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SecurityLdapConfigurationComponent implements OnInit {

    loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

    breadcrumbs: Breadcrumb[] = [
        {label: 'Security management', url: ['/admin/security']},
        {label: 'LDAP Configuration', url: ['']},
    ];

    ldapSettings: any = null;

    ldapConnectionForm: FormGroup = new FormGroup({
        url: new FormControl(),
        managerDn: new FormControl(),
        managerPassword: new FormControl(),
        userSearchBase: new FormControl(),
        userSearchFilter: new FormControl(),
        userDnPatternList: new FormControl([]),
        authorities: new FormGroup({
            groupSearchBase: new FormControl(),
            groupSearchFilter: new FormControl(),
            groupRoleAttribute: new FormControl(),
            searchSubtree: new FormControl(true),
            rolePrefix: new FormControl(''),
            convertToUpperCase: new FormControl(false)
        }),
        roleMappingList: new FormControl(),
        enableProvider: new FormControl()
    });

    constructor(public dialog: MatDialog, private service: LdapConfigurationService, private notify: ToastrService) {
    }

    ngOnInit() {
        this.service.getConfiguration().subscribe((result: any) => {
            this.ldapSettings = result;

            this.ldapConnectionForm.patchValue(result);

            this.loading$.next(false);
        });
    }

    save() {
        this.loading$.next(true);
        this.service
            .saveConfiguration(this.ldapConnectionForm.getRawValue())
            .pipe(finalize(() => this.loading$.next(false)))
            .subscribe((result: any) => {
                this.notify.success('Settings successfully saved!');
            });
    }

    test() {
        this.dialog.open(LdapConnectionTestDialogComponent, {
            width: '350px',
            data: this.ldapConnectionForm.getRawValue()
        });
    }

}
