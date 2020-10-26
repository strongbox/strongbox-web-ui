import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {BehaviorSubject} from 'rxjs';
import {Select, Store} from '@ngxs/store';
import {ToastrService} from 'ngx-toastr';
import {Navigate} from '@ngxs/router-plugin';

import {User} from '../../user.model';
import {UserManagementService} from '../../services/user-management.service';
import {SessionState} from '../../../core/auth/state/session.state';
import {ConfirmDialogComponent} from '../../../core/dialogs/confirm/confirm.dialog.component';
import {Breadcrumb} from '../../../../shared/layout/components/breadcrumb/breadcrumb.model';

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

    loading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
    deleteLoading = false;

    breadcrumbs: Breadcrumb[] = [
        {label: 'Users', url: ['/admin/users']}
    ];

    constructor(private service: UserManagementService,
                private dialog: MatDialog,
                private notify: ToastrService,
                private store: Store) {
    }

    confirmDeletion(user: User) {
        const dialogRef = this.dialog.open(
            ConfirmDialogComponent,
            {
                panelClass: 'deleteDialog',
                data: {
                    dangerConfirm: true,
                    message: 'You are about to delete the user ' + user.username + '!',
                    onConfirm: (ref: MatDialogRef<ConfirmDialogComponent>) => {
                        this.deleteLoading = true;

                        this.service.deleteUser(user).subscribe(
                            (result: any) => {
                                this.deleteLoading = false;

                                this.data.next(
                                    this.data
                                        .getValue()
                                        .filter((value: User) => {
                                            return value.username !== user.username;
                                        })
                                );

                                ref.close(true);

                                this.notify.success('User has been successfully deleted!');
                            });

                    }
                }
            });
    }

    navigate(url) {
        this.store.dispatch(new Navigate(url));
    }

    ngOnInit() {
        this.service.getUsers().subscribe((results: User[]) => {
            this.loading$.next(false);
            this.data.next(results);
        });
    }

}
