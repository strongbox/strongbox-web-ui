import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {FormGroup} from '@angular/forms';
import {BehaviorSubject} from 'rxjs';
import {Navigate} from '@ngxs/router-plugin';
import {Select, Store} from '@ngxs/store';
import {ToastrService} from 'ngx-toastr';

import {UserPrivilege, UserRole, User, UserForm, UserOperations, UserResponse} from '../../user.model';
import {UserManagementService} from '../../services/user-management.service';
import {SessionState} from '../../../core/auth/state/session.state';
import {handle404error} from '../../../core/core.model';

@Component({
    selector: 'app-view-user',
    templateUrl: './view-user.component.html',
    styleUrls: ['./view-user.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewUserComponent implements OnInit {

    @Select(SessionState.hasAuthority('UPDATE_USER'))
    hasUpdateUserAuthority$;

    loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    user$: BehaviorSubject<User> = new BehaviorSubject<User>(null);
    public assignableRoles$: BehaviorSubject<UserRole[]> = new BehaviorSubject<UserRole[]>([]);
    public assignablePrivileges$: BehaviorSubject<UserPrivilege[]> = new BehaviorSubject<UserPrivilege[]>([]);

    // Necessary to generate the app-user-access-model-listing
    userForm: FormGroup;

    constructor(private service: UserManagementService,
                private route: ActivatedRoute,
                private store: Store,
                private notify: ToastrService) {
    }

    ngOnInit() {
        this.route.paramMap.subscribe((params: ParamMap) => {
            const username = params.get('username');
            if (username) {
                this.service
                    .getUser(username, true)
                    .subscribe(
                        (response: UserResponse) => {
                            this.user$.next(response.user);
                            this.assignableRoles$.next(response.assignableRoles);
                            this.assignablePrivileges$.next(response.assignablePrivileges.filter(v => v.name.indexOf('ARTIFACTS_') > -1));
                            this.loading$.next(false);
                            this.userForm = new UserForm(UserOperations.VIEW, response.user).getForm();
                        },
                        (e) => {
                            handle404error(e, ['/admin/users'], this.notify, this.store);
                        }
                    );
            } else {
                this.store.dispatch(new Navigate(['/']));
            }
        });
    }

}
