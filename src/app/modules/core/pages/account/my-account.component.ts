import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BehaviorSubject} from 'rxjs';
import {Select, Store} from '@ngxs/store';
import {UpdateFormValue} from '@ngxs/form-plugin';
import {ToastrService} from 'ngx-toastr';

import {AuthenticatedUser} from '../../auth/auth.model';
import {AccountFormValidator} from './accountFormValidator';
import {AccountService} from './account.service';
import {AccountUpdateData} from './account.model';
import {SessionState} from '../../auth/state/session.state';
import {AccountFormState} from './state/accountFormState';
import {Breadcrumb} from '../../../../shared/layout/components/breadcrumb/breadcrumb.model';

@Component({
    selector: 'app-my-account',
    templateUrl: './my-account.component.html',
    styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent implements OnInit {

    @Select(AccountFormState.formState)
    public formState$;

    @Select(SessionState.authorities)
    public authorities$;

    @Select(SessionState.roles)
    public roles$;

    public user$: BehaviorSubject<AuthenticatedUser> = new BehaviorSubject(new AuthenticatedUser());

    public form: FormGroup;

    public loading$: BehaviorSubject<boolean> = new BehaviorSubject(true);

    public breadcrumbs: Breadcrumb[] = [
        {label: 'My account', url: [], active: true}
    ];

    constructor(private service: AccountService,
                private formBuilder: FormBuilder,
                private store: Store,
                private toaster: ToastrService) {
    }

    hasError(field, error = 'required') {
        return this.form.get(field).hasError(error);
    }

    randomString(length = 30) {
        const p = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const token = Array(length).fill(null).map(a => p[Math.floor(Math.random() * p.length)]).join('');
        this.form.get('securityTokenKey').setValue(token);
    }

    save() {
        const model = this.store.selectSnapshot(AccountFormState.model);

        const data: AccountUpdateData = {
            password: model.password,
            securityTokenKey: model.securityTokenKey
        };

        this.loading$.next(true);
        this.service
            .profile(data)
            .subscribe((result: any) => {
                this.loading$.next(false);
                this.toaster.success(result.message, null, {
                    timeOut: 3500
                });
            });
    }

    ngOnInit() {
        this.form = this.formBuilder.group({
            password: ['', [Validators.nullValidator]],
            repeatPassword: ['', [Validators.nullValidator]],
            securityTokenKey: ['', [Validators.required]]
        }, {
            validator: AccountFormValidator.validate
        });

        this.service.profile().subscribe((user: AuthenticatedUser) => {
            this.user$.next(user);

            this.store.dispatch(new UpdateFormValue({
                value: {
                    securityTokenKey: user.securityTokenKey
                },
                path: 'profile.formState'
            }));

            this.loading$.next(false);
        });
    }
}
