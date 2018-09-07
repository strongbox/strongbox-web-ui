import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Store} from '@ngxs/store';

@Component({
    selector: 'app-confirm-dialog',
    templateUrl: './confirm.dialog.component.html',
    styleUrls: ['./confirm.dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {

    public data = {
        title: 'Are you sure?',
        message: 'Are you sure you want to proceed with this action?',
        dangerConfirm: true,
        onConfirm: null
    };

    constructor(private store: Store,
                private dialogRef: MatDialogRef<ConfirmDialogComponent>,
                @Inject(MAT_DIALOG_DATA) data: any) {

        if (data !== null) {
            if (data.title) {
                this.data.title = data.title;
            }

            if (data.message) {
                this.data.message = data.message;
            }

            if (data.dangerConfirm) {
                this.data.dangerConfirm = data.dangerConfirm;
            }

            if (data.onConfirm) {
                this.data.onConfirm = data.onConfirm;
            }
        }
    }

    confirmAction() {
        if (typeof this.data.onConfirm === 'function') {
            this.data.onConfirm(this.dialogRef);
        } else {
            this.dialogRef.close(true);
        }
    }

    ngOnInit() {
    }

}
