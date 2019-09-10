import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Store} from '@ngxs/store';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
    selector: 'app-update-logger.dialog',
    templateUrl: './update-logger.dialog.component.html',
    styleUrls: ['./update-logger.dialog.component.scss']
})
export class UpdateLoggerDialogComponent implements OnInit {

    public form: FormGroup = this.formBuilder.group({
        package: ['', [Validators.required]],
        level: ['', [Validators.required]]
    });

    constructor(private store: Store,
                private dialogRef: MatDialogRef<UpdateLoggerDialogComponent>,
                private formBuilder: FormBuilder,
                @Inject(MAT_DIALOG_DATA) data: any) {
    }

    ngOnInit() {
    }

    update() {

    }

}
