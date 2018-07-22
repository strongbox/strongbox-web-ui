import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
import {HttpErrorResponse} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';
import {Select} from '@ngxs/store';

import {User} from '../../user.model';
import {UserManagementService} from '../../services/user-management.service';
import {SessionState} from '../../../core/auth/session.state';
import {ConfirmDialogComponent} from '../../../core/dialogs/confirm/confirm.dialog.component';

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
    deleteLoading = false;

    constructor(private service: UserManagementService, private dialog: MatDialog, private snackBar: MatSnackBar) {
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

                                this.snackBar.open('User has been successfully deleted!', null, {
                                    duration: 3500
                                });
                            },
                            (error: HttpErrorResponse) => {
                                this.snackBar.open('An error occurred while deleting the user! Please check Strongbox\'s logs!', null, {
                                    duration: 3500
                                });
                            });

                    }
                }
            });
    }

    ngOnInit() {
        this.isLoadingResults = true;

        this.service.getUsers().subscribe((results: User[]) => {
            this.isLoadingResults = false;
            this.data.next(results);
        });
    }

}
