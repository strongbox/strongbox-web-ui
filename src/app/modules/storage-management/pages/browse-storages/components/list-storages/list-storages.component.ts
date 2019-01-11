import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MatDialog, MatDialogConfig, MatTableDataSource} from '@angular/material';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {animate, group, state, style, transition, trigger} from '@angular/animations';
import {ToastrService} from 'ngx-toastr';
import {Select, Store} from '@ngxs/store';
import {Navigate} from '@ngxs/router-plugin';

import {StorageEntity} from '../../../../storage.model';
import {StorageFormDialogComponent} from '../../../../dialogs/storage-form/storage-form.dialog.component';
import {ConfirmDialogComponent, ConfirmDialogData, ConfirmDialogEvents} from '../../../../../core/dialogs/confirm/confirm.dialog.component';
import {StorageManagerService} from '../../../../services/storage-manager.service';
import {ApiResponse} from '../../../../../core/core.model';
import {BrowseStoragesSelectStorage, BrowseStoragesToggleStoragesSearchInput} from '../../state/browse-storages.actions';
import {BrowseStoragesState} from '../../state/browse-storages.state.model';

@Component({
    selector: 'app-list-storages',
    templateUrl: './list-storages.component.html',
    styleUrls: ['./list-storages.component.scss'],
    animations: [
        trigger('slideInOut', [
            state('in', style({height: '*', opacity: '*', transform: '*'})),
            transition(':leave', [
                style({height: 40, opacity: 1, transform: 'perspective(172px) rotateX(0deg)'}),

                group([
                    animate('250ms cubic-bezier(.36,1.04,.59,.95)', style({height: 0, opacity: 0})),
                    animate('220ms cubic-bezier(.36,1.04,.59,.95)', style({transform: 'perspective(172px) rotateX(90deg)'}))
                ])
            ]),

            transition(':enter', [
                style({height: 0, opacity: 0, transform: 'perspective(172px) rotateX(90deg)'}),

                group([
                    animate('250ms cubic-bezier(.36,1.04,.59,.95)', style({height: 40, opacity: 1})),
                    animate('220ms cubic-bezier(.36,1.04,.59,.95)', style({transform: 'perspective(172px) rotateX(0deg)'}))
                ])
            ])
        ])
    ]
})
export class ListStoragesComponent implements OnInit, OnDestroy {

    @Select(BrowseStoragesState.selectedStorage)
    selectedStorage$: Observable<string>;

    @Select(BrowseStoragesState.loadingStorages)
    loadingStorages$: Observable<boolean>;

    @Select(BrowseStoragesState.showStorageSearchInput)
    showSearch$: Observable<boolean>;

    @Select(BrowseStoragesState.storages)
    storages$: Observable<StorageEntity[]>;

    storagesSource: MatTableDataSource<StorageEntity> = new MatTableDataSource([]);

    destroy$: Subject<any> = new Subject();

    constructor(private cdk: ChangeDetectorRef,
                private dialog: MatDialog,
                private notify: ToastrService,
                public route: ActivatedRoute,
                private storageService: StorageManagerService,
                private store: Store) {
    }

    toggleStorageSearch() {
        this.store.dispatch(new BrowseStoragesToggleStoragesSearchInput());
    }

    getStorageRoute(storageId: string) {
        return ['/admin/storages', storageId];
    }

    applyFilter(filterValue: string) {
        this.storagesSource.filter = filterValue.trim().toLowerCase();
    }

    openStorageForm(storage: StorageEntity = null) {
        this.dialog
            .open(StorageFormDialogComponent, {data: {storage: storage !== null && storage !== undefined ? storage : null}})
            .afterClosed()
            .pipe(takeUntil(this.destroy$))
            .subscribe(result => {
                if (result instanceof StorageEntity) {
                    const exists = this.storagesSource.data.find((value: StorageEntity, index: number) => {
                        return value.id === result.id;
                    });

                    if (!exists) {
                        this.storagesSource.data = [...this.storagesSource.data, result].sort((a, b) => a.id.localeCompare(b.id));
                        this.cdk.detectChanges();
                    }
                }
            });
    }

    deleteStorage(storage: StorageEntity) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, <MatDialogConfig>{
            panelClass: 'deleteDialog',
            data: <ConfirmDialogData>{
                type: 'delete',
                autoCloseOnConfirm: false
            }
        });
        const instance: ConfirmDialogComponent = dialogRef.componentInstance;
        instance.events.pipe(takeUntil(this.destroy$)).subscribe((event: ConfirmDialogEvents) => {
            if (event === ConfirmDialogEvents.CONFIRMED) {
                instance.showSpinner(true);

                this.storageService
                    .deleteStorage(storage.id)
                    .subscribe((result: ApiResponse) => {
                        instance.close(result.isValid());
                        if (result.isValid()) {
                            this.storagesSource.data = this.storagesSource.data.filter((s) => s.id !== storage.id);
                            this.cdk.detectChanges();
                            this.notify.success(result.message);
                            this.store.dispatch(new Navigate(['/admin/storages/browse/']));
                        } else {
                            this.notify.error(result.message);
                        }
                    });
            }
        });
    }

    updateSelectedStorage(storageId: string) {
        this.store.dispatch(new BrowseStoragesSelectStorage(storageId));
    }

    ngOnInit(): void {
        this.storages$
            .pipe(takeUntil(this.destroy$))
            .subscribe((storages: StorageEntity[]) => {
                this.storagesSource.data = storages !== null ? storages : [];
                this.cdk.detectChanges();
            });

        this.showSearch$
            .pipe(takeUntil(this.destroy$))
            .subscribe(data => !!data ? this.storagesSource.filter = null : null);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}

