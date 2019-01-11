import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {BehaviorSubject, Subject} from 'rxjs';
import {plainToClass} from 'class-transformer';
import {ToastrService} from 'ngx-toastr';
import {takeUntil} from 'rxjs/operators';
import {Actions, ofActionDispatched, Store} from '@ngxs/store';
import {RouterNavigation} from '@ngxs/router-plugin';

import {StorageManagerService} from '../../services/storage-manager.service';
import {StorageEntity} from '../../storage.model';
import {ApiResponse} from '../../../core/core.model';

@Component({
    selector: 'app-storages-dialog',
    templateUrl: './storage-form.dialog.component.html',
    styleUrls: ['./storage-form.dialog.component.scss']
})
export class StorageFormDialogComponent implements OnInit, OnDestroy {

    public form: FormGroup;
    public loading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    private storage: StorageEntity = null;
    private destroy$: Subject<any> = new Subject();

    constructor(private actions: Actions,
                private dialog: MatDialog,
                private dialogRef: MatDialogRef<StorageFormDialogComponent>,
                private store: Store,
                private storageService: StorageManagerService,
                private notify: ToastrService,
                @Inject(MAT_DIALOG_DATA) data: any) {
        if (data['storage'] !== null) {
            this.storage = data['storage'];
        }
    }

    close() {
        this.dialogRef.close(null);
    }

    submit() {
        if (this.form.valid) {
            this.loading$.next(true);
            this.dialogRef.updateSize('35vw', null);

            const storageEntity: StorageEntity = plainToClass(StorageEntity, this.form.getRawValue()) as any;

            this.storageService
                .saveStorage(this.storage ? this.storage.id : null, storageEntity)
                .pipe(takeUntil(this.destroy$))
                .subscribe((response: ApiResponse) => {
                    if (response.isValid()) {
                        this.notify.success(response.message);
                        this.dialogRef.close(storageEntity);
                    } else {
                        this.notify.error(response.message);
                        this.loading$.next(false);
                    }
                });
        }
    }

    ngOnInit() {
        this.form = new FormGroup({
            id: new FormControl(this.storage ? this.storage.id : '', [Validators.required]),
            basedir: new FormControl(this.storage ? this.storage.basedir : '')
        });

        this.dialogRef.updateSize('35vw', null);

        this.actions
            .pipe(takeUntil(this.destroy$), ofActionDispatched(RouterNavigation))
            .subscribe(() => {
                this.close();
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

}
