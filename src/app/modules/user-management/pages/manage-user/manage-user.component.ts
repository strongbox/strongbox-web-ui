import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';
import {BehaviorSubject, Subject} from 'rxjs';
import {Actions, ofActionDispatched, Select, Store} from '@ngxs/store';
import {Navigate} from '@ngxs/router-plugin';
import {ToastrService} from 'ngx-toastr';
import {plainToClass} from 'class-transformer';
import {takeUntil} from 'rxjs/operators';

import {FormErrorAction} from '../../../../state/app.actions';
import {User, UserForm, UserFormFieldsData, UserOperations, UserPrivilege, UserResponse, UserRole} from '../../user.model';
import {UserManagementService} from '../../services/user-management.service';
import {SessionState} from '../../../core/auth/state/session.state';
import {ApiResponse, handle404error} from '../../../core/core.model';
import {FADE_IN_OUT_OVERLAP} from '../../../../shared/animations';
import {Breadcrumb} from '../../../../shared/layout/components/breadcrumb/breadcrumb.model';

@Component({
    selector: 'app-manage-user',
    templateUrl: './manage-user.component.html',
    styleUrls: ['../view-user/view-user.component.scss', './manage-user.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        FADE_IN_OUT_OVERLAP
    ]
})
export class ManageUserComponent implements OnInit, OnDestroy {

    @Select(SessionState.hasAuthority('UPDATE_USER'))
    public hasUpdateUserAuthority$;

    @Select(SessionState.hasAuthority('CREATE_USER'))
    public hasCreateUserAuthority$;

    public loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    public user$: BehaviorSubject<User> = new BehaviorSubject<User>(null);
    public assignableRoles$: BehaviorSubject<UserRole[]> = new BehaviorSubject<UserRole[]>([]);

    public operation: UserOperations = UserOperations.CREATE;

    public username = null;

    public userForm: FormGroup;

    public breadcrumbs: Breadcrumb[] = [
        {label: 'Users', url: ['/admin/users']}
    ];

    private destroy = new Subject();

    public compareSelectedRoles = (val1: string, val2: string) => val1 === val2;

    constructor(private service: UserManagementService,
                private route: ActivatedRoute,
                private fb: FormBuilder,
                private store: Store,
                private actions$: Actions,
                private notify: ToastrService,
                private cdr: ChangeDetectorRef) {
    }

    isCreate() {
        return this.operation === UserOperations.CREATE;
    }

    isUpdate() {
        return this.operation === UserOperations.UPDATE;
    }

    save() {
        if (this.userForm.valid) {
            this.loading$.next(true);
            const user: User = plainToClass(User, this.userForm.getRawValue()) as any;
            this.service.manageUser(user, this.operation).subscribe((response: ApiResponse) => {
                if (response.isValid()) {
                    this.store.dispatch(new Navigate(['/admin/users']));
                    this.notify.success('User has been successfully saved!');
                } else {
                    this.loading$.next(false);
                }
            });
        }
    }

    ngOnInit() {
        this.route.paramMap.subscribe((params: ParamMap) => {
            const username = params.get('username');
            if (!username) {
                this.breadcrumbs.push({label: 'New user', url: [], active: true});
                this.operation = UserOperations.CREATE;
                this.userForm = new UserForm(this.operation).getForm();
                this.service.getUserFormFields().subscribe((fields: UserFormFieldsData) => {
                    this.assignableRoles$.next(fields.assignableRoles);
                    this.loading$.next(false);
                });

                this.user$.next(new User());
            } else {
                this.breadcrumbs.push({label: username, url: [], active: true});
                this.operation = UserOperations.UPDATE;
                this.username = username;
                this.service
                    .getUser(username, true)
                    .subscribe(
                        (response: UserResponse) => {
                            this.user$.next(response.user);
                            this.assignableRoles$.next(response.assignableRoles);
                            this.loading$.next(false);
                            this.userForm = new UserForm(this.operation, response.user).getForm();
                        },
                        (e) => {
                            handle404error(e, ['/admin/users'], this.notify, this.store);
                        }
                    );
            }
        });

        this.actions$
            .pipe(ofActionDispatched(FormErrorAction), takeUntil(this.destroy))
            .subscribe((action: FormErrorAction) => {
                action.payload.errorsToForm(this.userForm);
                this.cdr.detectChanges(); // necessary to show the error message.
            });
    }

    ngOnDestroy() {
        this.destroy.next();
        this.destroy.complete();
    }

}
