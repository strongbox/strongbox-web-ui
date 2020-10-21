import {ChangeDetectorRef, Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Select, Store} from '@ngxs/store';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Navigate} from '@ngxs/router-plugin';
import {ToastrService} from 'ngx-toastr';

import {Repository, RepositoryTypeEnum} from '../../../../repository.model';
import {ConfirmDialogComponent} from '../../../../../core/dialogs/confirm/confirm.dialog.component';
import {StorageManagerService} from '../../../../services/storage-manager.service';
import {ApiResponse} from '../../../../../core/core.model';
import {BrowseStoragesState} from '../../state/browse-storages.state.model';

@Component({
    selector: 'app-list-repositories',
    templateUrl: './list-repositories.component.html',
    styleUrls: ['./list-repositories.component.scss']
})
export class ListRepositoriesComponent implements OnInit, OnDestroy {

    @Select(BrowseStoragesState.repositories)
    repositories$: Observable<Repository[]>;

    @Select(BrowseStoragesState.loadingRepositories)
    loadingRepositories$: Observable<boolean>;

    @Select(BrowseStoragesState.selectedStorage)
    selectedStorage$: Observable<string>;

    repositoriesSource: MatTableDataSource<Repository> = new MatTableDataSource([]);
    repositoryColumns = ['repository', 'type', 'layout', 'policy', 'status'];
    repositoryColumnsWithActions = [...this.repositoryColumns, 'actions'];

    repositoryTypes = Object.values(RepositoryTypeEnum);

    private destroy$: Subject<any> = new Subject();

    constructor(private dialog: MatDialog,
                private cdr: ChangeDetectorRef,
                private notify: ToastrService,
                private renderer: Renderer2,
                private router: Router,
                private route: ActivatedRoute,
                private storageService: StorageManagerService,
                private store: Store) {
    }

    navigateToDirectoryListing(repo: Repository) {
        this.store.dispatch(new Navigate(['/admin/storages/', repo.storageId, repo.id]));
    }

    navigateToRepositoryUpdate(repo: Repository) {
        this.store.dispatch(new Navigate(['/admin/storages/', repo.storageId, repo.id, 'update']));
    }

    createRepositoryLink(type: string) {
        return ['/admin/storages', this.store.selectSnapshot(BrowseStoragesState.selectedStorage), 'create', type];
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
                        this.storageService
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
        this.repositories$
            .pipe(takeUntil(this.destroy$))
            .subscribe((repositories: Repository[]) => {
                let dataSource = [];
                if (repositories !== null) {
                    // Cosmetic: add a "repository" property to display it in the table.
                    dataSource = repositories.map(r => {
                        return {...r, repository: r.id};
                    });
                }

                this.repositoriesSource.data = dataSource;
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

}
