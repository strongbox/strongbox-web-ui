import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BehaviorSubject, of} from 'rxjs';
import {Select, Store} from '@ngxs/store';
import {UpdateFormValue} from '@ngxs/form-plugin';

import {User} from '../../auth/auth.model';
import {ProfileFormValidator} from './profile.form.validator';
import {ProfileService} from './profile.service';
import {ProfileUpdateData} from './profile.model';
import {catchError} from 'rxjs/operators';
import {SessionState} from '../../auth/session.state';
import {MatSnackBar} from '@angular/material';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

    @Select(state => state.profile.formState)
    public formState;

    @Select(SessionState.authorities)
    public authorities$;

    @Select(SessionState.roles)
    public roles$;

    public user$: BehaviorSubject<User> = new BehaviorSubject(new User());

    public form: FormGroup;

    public loading = false;
    public result = '';

    constructor(private service: ProfileService,
                private formBuilder: FormBuilder,
                private store: Store,
                private snackBar: MatSnackBar) {
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
        const formState = this.store.selectSnapshot(state => state.profile.formState.model);

        const data: ProfileUpdateData = {
            password: formState.password,
            securityTokenKey: formState.securityTokenKey
        };

        this.loading = true;
        this.service
            .profile(data)
            .pipe(
                catchError((err) => {
                    console.log(err);
                    return of(err);
                })
            )
            .subscribe((result: any) => {
                this.loading = false;
                this.snackBar.open(result.message, null, {
                    duration: 3500
                });
            });
    }

    ngOnInit() {
        this.form = this.formBuilder.group({
            password: [''],
            repeatPassword: [''],
            securityTokenKey: ['', [Validators.required]]
        }, {
            validator: ProfileFormValidator.validate.bind(this)
        });

        this.service.profile().subscribe((user: User) => {
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
