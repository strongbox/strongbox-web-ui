import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {BehaviorSubject, Subject} from 'rxjs';
import {plainToClass} from 'class-transformer';
import {ToastrService} from 'ngx-toastr';
import {takeUntil} from 'rxjs/operators';
import {Actions, ofActionDispatched} from '@ngxs/store';
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
    public storageId: string = null;

    public loading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
    private destroy$: Subject<any> = new Subject();

    constructor(private actions: Actions,
                private dialog: MatDialog,
                private dialogRef: MatDialogRef<StorageFormDialogComponent>,
                private service: StorageManagerService,
                private notify: ToastrService,
                @Inject(MAT_DIALOG_DATA) data: any) {
        if (data !== null && data.hasOwnProperty('storageId')) {
            this.storageId = data.storageId;
        }
    }

    close() {
        this.dialogRef.close(null);
    }

    submit() {
        if (this.form.valid) {
            this.loading$.next(true);
            this.dialogRef.updateSize('35vw', null);

            const storage: StorageEntity = plainToClass(StorageEntity, this.form.getRawValue()) as any;

            this.service
                .saveStorage(this.storageId, storage)
                .pipe(takeUntil(this.destroy$))
                .subscribe((response: ApiResponse) => {
                    if (response.isValid()) {
                        this.notify.success(response.message);
                        this.dialogRef.close(storage);
                    } else {
                        this.notify.error(response.message);
                        this.loading$.next(false);
                    }
                });
        }
    }

    ngOnInit() {
        this.form = new FormGroup({
            id: new FormControl('', [Validators.required]),
            basedir: new FormControl('', [Validators.required])
        });

        this.dialogRef.updateSize('35vw', null);

        if (this.storageId !== null) {
            this.service
                .getStorage(this.storageId)
                .pipe(takeUntil(this.destroy$))
                .subscribe((storage: StorageEntity) => {
                    this.form.patchValue({id: storage.id, basedir: storage.basedir});
                    this.loading$.next(false);
                });
        } else {
            this.loading$.next(false);
        }

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
