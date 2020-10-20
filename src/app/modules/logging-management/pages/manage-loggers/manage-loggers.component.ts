import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    ViewChild
} from '@angular/core';
import {MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatTable} from '@angular/material/table';
import {MatDialogRef} from '@angular/material/dialog';
import {BehaviorSubject, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';
import {plainToClass} from 'class-transformer';

import {LoggingService} from '../../services/logging.service';
import {Logger, LoggersResponse} from '../../logging.model';
import {Breadcrumb} from '../../../../shared/layout/components/breadcrumb/breadcrumb.model';
import {GenericMessages} from '../../../core/core.model';

@Component({
    selector: 'app-manage-loggers',
    templateUrl: './manage-loggers.component.html',
    styleUrls: ['./manage-loggers.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageLoggersComponent implements AfterViewInit, OnDestroy {

    displayedColumns: string[] = ['package', 'configuredLevel', 'effectiveLevel', 'actions'];

    loading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
    saving$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    private destroy$ = new Subject();
    private destroyForm$ = new Subject();

    breadcrumbs: Breadcrumb[] = [
        {label: 'Logging', url: ['/admin/loggers']}
    ];

    levels: string[] = [];

    dataSource: MatTableDataSource<Logger> = new MatTableDataSource();

    @ViewChild(MatPaginator)
    paginator: MatPaginator;

    @ViewChild(MatSort, {static: true})
    sort: MatSort;

    @ViewChild(MatTable, {static: true})
    table: MatTable<any>;

    selectedLogger: Logger = null;
    selectedLoggerForm: FormGroup = new FormGroup({});
    selectedLoggerFormVisible = false;

    newLoggerDialog: MatDialogRef<any> = null;

    constructor(private cdr: ChangeDetectorRef,
                private dialog: MatDialog,
                private notify: ToastrService,
                private service: LoggingService) {
    }

    ngAfterViewInit() {
        // Greatly improves the rendering time.
        // Checkout https://stackoverflow.com/a/58742857/393805 and https://github.com/angular/components/issues/11953
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;

        this.service
            .getLoggers()
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: LoggersResponse) => {
                this.levels = response.levels;
                this.dataSource.data = response.loggers;
                // this.cdr.detectChanges();
                this.loading$.next(false);
            });
    }

    ngOnDestroy() {
        this.emitDestroy();
        this.emitDestroyForm();
    }

    generateForm(logger: Logger = null) {
        // prevent multiple forms.
        this.removeForm();

        if (logger) {
            // make a copy of the object to prevent mutuations before the logger has actually been saved.
            this.selectedLogger = plainToClass(Logger, Object.assign({}, logger), {groups: ['all']});
        } else {
            this.selectedLogger = new Logger();
            this.selectedLogger.package = this.dataSource.filter.length > 0 ? this.dataSource.filter : '';
            this.selectedLogger.configuredLevel = 'INFO';
            this.selectedLogger.effectiveLevel = this.selectedLogger.configuredLevel;

            this.dataSource.data.splice(0, 0, this.selectedLogger);

            // update view
            this.renderRows();
        }

        const packageValidation = !!logger ? [] : [Validators.required];
        const configuredLevelValidation = this.isRootPackage(logger) ? [Validators.required] : [];

        this.selectedLoggerForm = new FormGroup({
            package: new FormControl({value: this.selectedLogger.package, disabled: !!logger}, packageValidation),
            configuredLevel: new FormControl(this.selectedLogger.configuredLevel, configuredLevelValidation)
        });

        // keep form values in sync with the model.
        this.selectedLoggerForm
            .valueChanges
            .pipe(takeUntil(this.destroyForm$))
            .subscribe((formValue: any) => {
                this.selectedLogger.configuredLevel = formValue.configuredLevel;
                this.selectedLogger.effectiveLevel = formValue.configuredLevel;
            });

        this.saving$.pipe(takeUntil(this.destroyForm$)).subscribe((savingState) => {
            const pkg = this.selectedLoggerForm.get('package');
            const level = this.selectedLoggerForm.get('configuredLevel');

            // pkg / level may be null depending on when this gets triggered.
            if (pkg && level) {
                if (savingState) {
                    pkg.disable();
                    level.disable();
                } else {
                    level.enable();
                }
            }
        });

        // remove form when necessary.
        this.dataSource.paginator.page.pipe(takeUntil(this.destroyForm$)).subscribe(() => this.removeForm());
        this.dataSource.sort.sortChange.pipe(takeUntil(this.destroyForm$)).subscribe(() => this.removeForm());

        // Show form.
        this.selectedLoggerFormVisible = true;
    }

    removeForm(destroySubscriptions = true) {
        if (this.selectedLogger || this.selectedLoggerFormVisible) {
            this.selectedLogger = null;
            this.selectedLoggerFormVisible = false;
            this.selectedLoggerForm = new FormGroup({});

            this.saving$.next(false);

            if (destroySubscriptions) {
                this.emitDestroyForm();
            }

        }
    }

    saveLogger() {
        this.saving$.next(true);
        this.service
            .save(this.selectedLogger)
            .pipe(takeUntil(this.destroy$))
            .subscribe(
                (updatedLogger: Logger) => this.handleSave(updatedLogger),
                (e) => this.notify.error(GenericMessages.SAVE_FAILED, e)
            );
    }

    clearLogLevel(logger: Logger) {
        // remove any active forms.
        this.removeForm();

        if (this.isRootPackage(logger)) {
            this.notify.error('ROOT package does not support clearing the log level!');
            return;
        }

        this.saving$.next(true);
        this.selectedLogger = plainToClass(Logger, Object.assign({}, logger), {groups: ['all']});
        this.selectedLogger.configuredLevel = null;

        this.service
            .save(this.selectedLogger)
            .pipe(takeUntil(this.destroy$))
            .subscribe(
                (updatedLogger: Logger) => this.handleSave(updatedLogger),
                (e) => this.notify.error(GenericMessages.SAVE_FAILED, e)
            );
    }

    applyFilter(filterValue: string) {
        this.removeForm(false);
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    hasActiveForm(logger: Logger, index: number = null) {
        return this.selectedLogger && this.selectedLogger.package === logger.package;
    }

    isRootPackage(logger: Logger) {
        return logger !== null && logger.package !== null && logger.package.toLocaleLowerCase() === 'root';
    }

    private renderRows() {
        this.table.renderRows();
        this.cdr.markForCheck();
    }

    private updateTableRecords(logger: Logger) {
        const updated = logger.package.trim().toLocaleLowerCase();

        let newData = [...this.dataSource.data];

        const index = newData.findIndex((current) => current.package.trim().toLocaleLowerCase() === updated);

        // update existing index
        if (index > -1) {
            newData[index] = logger;
        } else {
            newData.splice(0, 0, logger);
        }

        this.dataSource.data = newData;

        this.renderRows();
    }

    private handleSave(logger: Logger) {
        this.updateTableRecords(logger);
        this.notify.success(GenericMessages.SAVE_SUCCESSFUL);
        this.removeForm();
    }

    private emitDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
        if (this.newLoggerDialog) {
            this.newLoggerDialog.close();
        }
    }

    private emitDestroyForm() {
        this.destroyForm$.next();
        this.destroyForm$.complete();
        this.destroyForm$ = new Subject();
    }
}
