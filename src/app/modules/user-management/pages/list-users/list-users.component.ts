import {Component, OnInit} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Select} from '@ngxs/store';

import {User} from '../../user.model';
import {UserManagementService} from '../../services/user-management.service';
import {SessionState} from '../../../core/auth/session.state';

@Component({
    selector: 'app-list-users',
    templateUrl: './list-users.component.html',
    styleUrls: ['./list-users.component.scss']
})
export class ListUsersComponent implements OnInit {

    @Select(SessionState.hasAuthority('CREATE_USER'))
    hasCreateUserAuthority$;

    @Select(SessionState.hasAuthority('VIEW_USER'))
    hasViewUserAuthority$;

    @Select(SessionState.hasAuthority('UPDATE_USER'))
    hasUpdateUserAuthority$;

    @Select(SessionState.hasAuthority('DELETE_USER'))
    hasDeleteUserAuthority$;

    displayedColumns: string[] = ['username', 'enabled', 'actions'];
    data: BehaviorSubject<User[]> = new BehaviorSubject<User[]>(null);

    isLoadingResults = true;

    constructor(private service: UserManagementService) {
    }

    ngOnInit() {
        this.isLoadingResults = true;

        this.service.getUsers().subscribe((results: User[]) => {
            this.isLoadingResults = false;
            this.data.next(results);
        });
    }

}
