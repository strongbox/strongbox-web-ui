import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {BehaviorSubject} from 'rxjs';
import {Navigate} from '@ngxs/router-plugin';
import {Select, Store} from '@ngxs/store';
import {ToastrService} from 'ngx-toastr';

import {User, UserResponse} from '../../user.model';
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
                            this.user$.next(response.user);
                            this.loading$.next(false);
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
