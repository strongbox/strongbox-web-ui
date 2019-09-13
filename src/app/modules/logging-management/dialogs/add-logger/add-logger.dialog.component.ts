import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {ToastrService} from 'ngx-toastr';
import {takeUntil, tap} from 'rxjs/operators';
import {BehaviorSubject, Subject} from 'rxjs';

import {Logger} from '../../logging.model';
import {LoggingService} from '../../services/logging.service';
import {GenericMessages} from '../../../core/core.model';

@Component({
    selector: 'app-add-logger.dialog',
    templateUrl: './add-logger.dialog.component.html',
    styleUrls: ['./add-logger.dialog.component.scss']
})
export class AddLoggerDialogComponent implements OnInit, OnDestroy {

    form: FormGroup;
    logger: Logger = new Logger();
    levels: string[];

    loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    private destroy$: Subject<any> = new Subject();

    constructor(private dialogRef: MatDialogRef<AddLoggerDialogComponent>,
                private formBuilder: FormBuilder,
                private service: LoggingService,
                private notify: ToastrService,
                @Inject(MAT_DIALOG_DATA) data: any) {
        if (data.searchTerm != null && data.searchTerm.trim() !== '') {
            this.logger.package = data.searchTerm.trim();
        }

        this.levels = data.levels;
    }

    ngOnInit() {
        this.form = this.formBuilder.group({
            package: new FormControl(this.logger.package, [Validators.required]),
            configuredLevel: new FormControl(this.logger.configuredLevel, [Validators.required])
        });

        this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((formValue: any) => {
            this.logger.package = formValue.package;
            this.logger.configuredLevel = formValue.configuredLevel;
            this.logger.effectiveLevel = formValue.effectiveLevel;
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    save() {
        this.loading$.next(true);

        // Update object.
        this.logger.package = this.form.get('package').value;
        this.logger.configuredLevel = this.form.get('configuredLevel').value;
        this.logger.effectiveLevel = this.logger.configuredLevel;

        this.service
            .save(this.logger)
            .pipe(takeUntil(this.destroy$), tap(() => this.loading$.next(true)))
            .subscribe((successful: boolean) => {
                if (successful) {
                    this.notify.success(GenericMessages.SAVE_SUCCESSFUL);
                    this.dialogRef.close(this.logger);
                } else {
                    this.notify.error(GenericMessages.SAVE_FAILED);
                }
            }, (e) => {
                this.notify.error(GenericMessages.SAVE_FAILED);
                console.error(GenericMessages.SAVE_FAILED, e);
            });
    }
}
