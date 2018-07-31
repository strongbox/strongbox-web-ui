import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BehaviorSubject, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Select, Store} from '@ngxs/store';
import {UpdateFormValue} from '@ngxs/form-plugin';
import {ToastrService} from 'ngx-toastr';

import {AuthenticatedUser} from '../../auth/auth.model';
import {ProfileFormValidator} from './profile.form.validator';
import {ProfileService} from './profile.service';
import {ProfileUpdateData} from './profile.model';
import {SessionState} from '../../auth/state/session.state';
import {ProfileFormState} from './state/profile.form.state';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

    @Select(ProfileFormState.formState)
    public formState$;

    @Select(SessionState.authorities)
    public authorities$;

    @Select(SessionState.roles)
    public roles$;

    public user$: BehaviorSubject<AuthenticatedUser> = new BehaviorSubject(new AuthenticatedUser());

    public form: FormGroup;

    public loading: BehaviorSubject<boolean> = new BehaviorSubject(false);

    public links = ['Account', 'Authorities', 'Access Model'];
    public activeLink = 0;

    constructor(private service: ProfileService,
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
        const model = this.store.selectSnapshot(ProfileFormState.model);

        const data: ProfileUpdateData = {
            password: model.password,
            securityTokenKey: model.securityTokenKey
        };

        this.loading.next(true);
        this.service
            .profile(data)
            .subscribe((result: any) => {
                this.loading.next(false);
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
            validator: ProfileFormValidator.validate
        });

        this.service.profile().subscribe((user: AuthenticatedUser) => {
            this.user$.next(user);

            this.store.dispatch(new UpdateFormValue({
                value: {
                    securityTokenKey: user.securityTokenKey
                },
                path: 'profile.formState'
            }));
        });
    }
}
