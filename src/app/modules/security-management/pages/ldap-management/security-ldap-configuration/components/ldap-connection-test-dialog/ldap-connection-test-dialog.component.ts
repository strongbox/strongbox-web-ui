import {Component, Inject} from '@angular/core';
import {LdapConfigurationService} from '../../../../../services/ldap-configuration.service';
import {ToastrService} from 'ngx-toastr';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {BehaviorSubject} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {finalize} from 'rxjs/operators';

@Component({
    selector: 'app-ldap-connection-test-dialog',
    templateUrl: './ldap-connection-test-dialog.component.html',
    styleUrls: ['./ldap-connection-test-dialog.component.scss']
})
export class LdapConnectionTestDialogComponent {

    loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    form: FormGroup = new FormGroup({
        username: new FormControl(null, [Validators.required]),
        password: new FormControl(null, [Validators.required])
    });

    constructor(private service: LdapConfigurationService,
                private notify: ToastrService,
                public dialogRef: MatDialogRef<LdapConnectionTestDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    test() {
        this.loading$.next(true);
        this.service.testConfiguration(
            this.data,
            this.form.get('username').value,
            this.form.get('password').value
        ).pipe(
            finalize(() => this.loading$.next(false))
        ).subscribe((result) => {
            this.notify.success('Configuration test was successful!');
        });
    }

}
