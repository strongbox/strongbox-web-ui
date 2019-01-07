import {ChangeDetectorRef, Component, OnInit, Renderer2} from '@angular/core';
import {MatDialog, MatDialogRef, MatTableDataSource} from '@angular/material';
import {ActivatedRoute, NavigationEnd, NavigationStart, Router} from '@angular/router';
import {Store} from '@ngxs/store';
import {BehaviorSubject} from 'rxjs';
import {distinctUntilChanged, filter} from 'rxjs/operators';
import {Navigate} from '@ngxs/router-plugin';
import {ToastrService} from 'ngx-toastr';

import {Repository} from '../../../../repository.model';
import {ConfirmDialogComponent} from '../../../../../core/dialogs/confirm/confirm.dialog.component';
import {StorageManagerService} from '../../../../services/storage-manager.service';
import {ApiResponse} from '../../../../../core/core.model';

@Component({
    selector: 'app-list-repositories',
    templateUrl: './list-repositories.component.html',
    styleUrls: ['./list-repositories.component.scss']
})
export class ListRepositoriesComponent implements OnInit {

    storageId = null;
    loading$: BehaviorSubject<boolean> = new BehaviorSubject(true);

    repositoriesSource: MatTableDataSource<Repository> = new MatTableDataSource([]);
    repositoryColumns = ['repository', 'type', 'layout', 'policy', 'status'];
    repositoryColumnsWithActions = [...this.repositoryColumns, 'actions'];

    constructor(private cdr: ChangeDetectorRef,
                private dialog: MatDialog,
                private notify: ToastrService,
                private renderer: Renderer2,
                private router: Router,
                private route: ActivatedRoute,
                private service: StorageManagerService,
                private store: Store) {
    }

    navigateToRepository(repo: Repository) {
        this.store.dispatch(new Navigate(['/admin/storages/', repo.storageId, repo.id]));
    }

    confirmDeletion(repo: Repository) {
        this.dialog.open(
            ConfirmDialogComponent,
            {
                panelClass: 'deleteDialog',
                data: {
                    dangerConfirm: true,
                    message: 'You are about to delete the repository ' + repo.id + ' in ' + repo.storageId + '!',
                    onConfirm: (ref: MatDialogRef<ConfirmDialogComponent>) => {
                        this.service
                            .deleteRepository(repo.storageId, repo.id)
                            .subscribe((result: ApiResponse) => {
                                ref.close(true);
                                if (result.isValid()) {
                                    this.notify.success(result.message);
                                    this.repositoriesSource.data = this.repositoriesSource.data.filter((r: Repository) => r.id !== repo.id);
                                    this.cdr.detectChanges();
                                } else {
                                    this.notify.error(result.message);
                                }
                            });
                    }
                }
            });
    }

    ngOnInit() {
        this.router
            .events
            .pipe(
                filter(e => e instanceof NavigationStart || e instanceof NavigationEnd),
                distinctUntilChanged()
            )
            .subscribe((event: NavigationStart | NavigationEnd) => {
                if (event instanceof NavigationStart && event.url.startsWith('/admin/storages/browse')) {
                    this.loading$.next(true);
                } else if (event instanceof NavigationEnd && event.url.startsWith('/admin/storages/browse')) {
                    this.loading$.next(false);
                }
            });

        this.route.data.subscribe((resolved: any) => {
            this.loading$.next(false);

            let dataSource = [];
            if (resolved !== null && resolved['data'] !== undefined && resolved['data'] !== null) {
                // Cosmetic: add a "repository" property to display it in the table.
                dataSource = resolved['data']['storage']['repositories'].map(r => {
                    return {...r, repository: r.id};
                });

                this.storageId = resolved['data']['storageId'];
            }

            this.repositoriesSource.data = dataSource;
        });
    }

}
