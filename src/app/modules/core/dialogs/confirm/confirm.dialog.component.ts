import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Actions, ofActionDispatched, Store} from '@ngxs/store';
import {BehaviorSubject, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {RouterNavigation} from '@ngxs/router-plugin';

@Component({
    selector: 'app-confirm-dialog',
    templateUrl: './confirm.dialog.component.html',
    styleUrls: ['./confirm.dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit, OnDestroy {

    public data: ConfirmDialogData = {
        title: 'Are you sure?',
        message: 'Are you sure you want to proceed with this action?',
        type: 'delete',
        autoCloseOnConfirm: true,
        onConfirm: null
    };

    public events: Subject<ConfirmDialogEvents> = new Subject(); // 'initialized'|'cancel'|'pending'|'confirm'

    public loading$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    private destroy$: Subject<any> = new Subject();

    constructor(private actions: Actions,
                private store: Store,
                private dialogRef: MatDialogRef<ConfirmDialogComponent>,
                @Inject(MAT_DIALOG_DATA) data: any) {

        if (data !== null) {
            Object.getOwnPropertyNames(data).forEach((property) => {
                if (this.data.hasOwnProperty(property) && property !== 'showLoading') {
                    this.data[property] = data[property];
                }
            });
        }
    }

    close(status: boolean | null = true) {
        this.dialogRef.close(status);
    }

    confirm(status: boolean | null = true) {
        if (typeof this.data.onConfirm === 'function') {
            this.data.onConfirm(this.dialogRef);
        }

        if (status === true) {
            this.events.next(ConfirmDialogEvents.CONFIRMED);
        } else {
            this.events.next(ConfirmDialogEvents.CANCELLED);
        }

        if (!status || this.data.autoCloseOnConfirm) {
            this.dialogRef.close(status);
        }
    }

    showSpinner(state: boolean = true) {
        this.loading$.next(state);
    }

    ngOnInit(): void {
        this.events.next(ConfirmDialogEvents.INITIALIZED);

        this.dialogRef.backdropClick().pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.confirm(null);
        });

        this.loading$.pipe(takeUntil(this.destroy$)).subscribe((state: boolean) => {
            if (state) {
                this.dialogRef.updateSize('30vw', '20vh');
                this.events.next(ConfirmDialogEvents.PENDING);
            } else {
                this.dialogRef.updateSize();
                this.events.next(ConfirmDialogEvents.FINISHED);
            }
        });

        this.actions
            .pipe(takeUntil(this.destroy$), ofActionDispatched(RouterNavigation))
            .subscribe(() => {
                this.close(null);
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}

export interface ConfirmDialogData {
    title?: string;
    message?: string;
    type?: 'warn' | 'delete';
    autoCloseOnConfirm?: boolean;
    onConfirm: Function;
}

export enum ConfirmDialogEvents {
    INITIALIZED = 1,
    PENDING = 2,
    FINISHED = 3,
    CONFIRMED = 4,
    CANCELLED = 5
}
