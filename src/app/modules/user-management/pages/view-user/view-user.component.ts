import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {BehaviorSubject} from 'rxjs';
import {Navigate} from '@ngxs/router-plugin';
import {Select, Store} from '@ngxs/store';

import {User} from '../../user.model';
import {UserManagementService} from '../../services/user-management.service';
import {SessionState} from '../../../core/auth/session.state';

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

    constructor(private service: UserManagementService, private route: ActivatedRoute, private store: Store) {
    }

    ngOnInit() {
        this.route.paramMap.subscribe((params: ParamMap) => {
            const username = params.get('username');
            if (username) {
                this.service.getUser(username).subscribe((response: User) => {
                    this.user$.next(response);
                    this.loading$.next(false);
                });
            } else {
                this.store.dispatch(new Navigate(['/']));
            }
        });
    }

}
