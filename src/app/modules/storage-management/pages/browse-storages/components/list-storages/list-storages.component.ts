import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MatDialog, MatDialogConfig, MatTableDataSource} from '@angular/material';
import {BehaviorSubject, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {animate, group, state, style, transition, trigger} from '@angular/animations';
import {ToastrService} from 'ngx-toastr';
import {Store} from '@ngxs/store';
import {Navigate} from '@ngxs/router-plugin';

import {StorageEntity} from '../../../../storage.model';
import {StorageFormDialogComponent} from '../../../../dialogs/storage-form/storage-form.dialog.component';
import {ConfirmDialogComponent, ConfirmDialogData, ConfirmDialogEvents} from '../../../../../core/dialogs/confirm/confirm.dialog.component';
import {StorageManagerService} from '../../../../services/storage-manager.service';
import {ApiResponse} from '../../../../../core/core.model';

@Component({
    selector: 'app-list-storages',
    templateUrl: './list-storages.component.html',
    styleUrls: ['./list-storages.component.scss'],
    animations: [
        trigger('slideInOut', [
            state('in', style({height: '*', opacity: '*', transform: '*'})),
            transition(':leave', [
                group([
                    animate('250ms cubic-bezier(.36,1.04,.59,.95)', style({height: 0, padding: 0})),
                    animate('220ms cubic-bezier(.36,1.04,.59,.95)', style({transform: 'perspective(172px) rotateX(90deg)', opacity: 0}))
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

    loading$: BehaviorSubject<boolean> = new BehaviorSubject(true);

    selectedStorage: BehaviorSubject<StorageEntity> = new BehaviorSubject(null);
    storagesSource: MatTableDataSource<StorageEntity> = new MatTableDataSource([]);

    showSearch$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    destroy$: Subject<any> = new Subject();

    constructor(private dialog: MatDialog,
                public route: ActivatedRoute,
                private cdk: ChangeDetectorRef,
                private notify: ToastrService,
                private service: StorageManagerService,
                private store: Store) {
    }

    applyFilter(filterValue: string) {
        this.storagesSource.filter = filterValue.trim().toLowerCase();
    }

    openStorageForm(storage: StorageEntity = null) {
        this.dialog
            .open(StorageFormDialogComponent, {data: {storageId: storage !== null && storage !== undefined ? storage.id : null}})
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

                this.service
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

    ngOnInit(): void {
        this.route.data.pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
            this.loading$.next(false);
            this.storagesSource.data = data !== null && data['storages'] !== undefined ? data['storages'] : [];
        });

        this.showSearch$.pipe(takeUntil(this.destroy$)).subscribe(data => !!data ? this.storagesSource.filter = null : null);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}

