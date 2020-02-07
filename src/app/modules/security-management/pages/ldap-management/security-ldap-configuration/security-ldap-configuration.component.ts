import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {BehaviorSubject} from 'rxjs';

import {Breadcrumb} from '../../../../../shared/layout/components/breadcrumb/breadcrumb.model';
import {LdapConfigurationService} from '../../../services/ldap-configuration.service';
import {finalize} from 'rxjs/operators';

@Component({
    selector: 'app-security-ldap-configuration',
    templateUrl: './security-ldap-configuration.component.html',
    styleUrls: ['./security-ldap-configuration.component.scss']
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
        groupSearchBase: new FormControl(),
        groupSearchFilter: new FormControl(),
        groupRoleAttribute: new FormControl(),
        userDnPatternList: new FormControl([]),
    });

    constructor(private service: LdapConfigurationService) {
    }

    ngOnInit() {
        this.service.getConfiguration().subscribe((result: any) => {
            this.ldapSettings = result;

            this.ldapConnectionForm.patchValue(result);
            this.ldapConnectionForm.get('groupRoleAttribute').patchValue(result.authorities.groupRoleAttribute);

            console.log(result, this.ldapConnectionForm);
            this.loading$.next(false);
        });
    }

    save() {
        this.loading$.next(true);
        this.service
            .saveConfiguration({...this.ldapSettings, ...this.ldapConnectionForm.getRawValue()})
            .pipe(
                finalize(() => this.loading$.next(false)),
            )
            .subscribe((result: any) => {
                console.log('save result: ', result);
            });
    }

    test() {
        this.loading$.next(true);

        this.service.testConfiguration(
            {...this.ldapSettings, ...this.ldapConnectionForm.getRawValue()},
            'stodorov',
            'password'
        ).pipe(
            finalize(() => this.loading$.next(false))
        ).subscribe((result) => console.log('test result', result));
    }

}
