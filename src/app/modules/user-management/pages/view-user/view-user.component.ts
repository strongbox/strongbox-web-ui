import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {FormGroup} from '@angular/forms';
import {BehaviorSubject} from 'rxjs';
import {Navigate} from '@ngxs/router-plugin';
import {Select, Store} from '@ngxs/store';
import {ToastrService} from 'ngx-toastr';

import {User, UserForm, UserOperations, UserResponse} from '../../user.model';
import {UserManagementService} from '../../services/user-management.service';
import {SessionState} from '../../../core/auth/state/session.state';
import {handle404error} from '../../../core/core.model';
import {plainToClass} from 'class-transformer';

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
                    .getUser(username)
                    .subscribe(
                        (response: UserResponse) => {
                            const user: User = plainToClass(User, response.user) as any;
                            this.user$.next(user);
                            this.loading$.next(false);
                            this.userForm = new UserForm(UserOperations.VIEW, user).getForm();
                            console.log('is disabled', this.userForm.disabled);
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
