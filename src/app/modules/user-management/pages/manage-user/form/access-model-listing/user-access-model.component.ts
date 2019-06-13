import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import {SelectionModel} from '@angular/cdk/collections';
import {MatSort, MatTableDataSource} from '@angular/material';
import {Observable, Subject} from 'rxjs';
import {map} from 'rxjs/operators';

import {FADE_IN_OUT_OVERLAP, FADE_OUT} from '../../../../../../shared/animations';
import {PathPrivilege, UserForm, UserPrivilege} from '../../../../user.model';
import {FormDataService} from '../../../../../../shared/form/services/form-data.service';
import {AutocompleteOption} from '../../../../../../shared/form/autocomplete/autocomplete.model';
import {DefaultAutocompleteDataSource} from '../../../../../../shared/form/autocomplete/default-autocomplete.data-source';

@Component({
    selector: 'app-user-access-model-listing',
    templateUrl: './user-access-model.component.html',
    styleUrls: ['./user-access-model.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        FADE_OUT,
        FADE_IN_OUT_OVERLAP,
    ]
})
export class UserAccessModelComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {

    @Input()
    public parentForm: FormGroup;

    @Input()
    public assignablePrivileges: UserPrivilege[] = [];

    /**
     * Table variables
     */
    public readonly displayAllColumns: string[] = ['select', 'storageId', 'repositoryId', 'path', 'privileges', 'wildcard', 'actions'];
    public readonly displayViewColumns: string[] = ['storageId', 'repositoryId', 'path', 'privileges', 'wildcard', 'actions'];
    public displayedColumns: string[] = this.displayAllColumns;
    public dataSource: MatTableDataSource<PathPrivilege> = new MatTableDataSource<PathPrivilege>();
    public selection = new SelectionModel<PathPrivilege>(true, []);
    public sort;

    public privilege: PathPrivilege = null;
    public privilegeIndex: number = null;

    public privilegeForm: FormGroup;

    public showEditForm = false;

    storageField: FormControl;
    repositoryField: FormControl;

    storageSearchDataSource;
    repositorySearchDataSource;

    private destroy = new Subject();

    constructor(private cdr: ChangeDetectorRef, private formDataService: FormDataService) {
    }

    compareSelected = (val1: string, val2: string) => val1 === val2;

    @ViewChild(MatSort, { static: false }) set content(content: ElementRef) {
        this.sort = content;
        if (this.sort) {
            this.dataSource.sort = this.sort;
        }
    }

    // tslint:disable:semicolon
    storageAutocompleteService = (search: string): Observable<AutocompleteOption<any>[]> => {
        return this
            .formDataService
            .findStorages(search)
            .pipe(
                map((a: string[]) => a.map(v => new AutocompleteOption<any>(v, v)))
            );
    };

    repositoryAutocompleteService = (search: string): Observable<AutocompleteOption<any>[]> => {
        return this
            .formDataService
            .findRepositoriesByStorage(this.storageField.value, search)
            .pipe(
                map((a: string[]) => a.map(v => new AutocompleteOption<any>(v, v)))
            );
    };

    ngOnInit() {
    }

    ngOnDestroy() {
        this.destroy.next();
        this.destroy.complete();
    }

    ngAfterViewInit() {
        if (this.parentForm.disabled) {
            this.displayedColumns = this.displayViewColumns;
        }
        this.updateDataSource();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.parentForm.disabled) {
            this.displayedColumns = this.displayViewColumns;
        }
        this.updateDataSource();
    }

    private updateDataSource() {
        this.dataSource = new MatTableDataSource(this.repositoriesAccess().getRawValue());
    }

    repositoriesAccess(): FormArray {
        return this.parentForm.get('accessModel').get('repositoriesAccess') as FormArray; // PathPrivilege
    }

    updateCollection(form): void {
        const value = form.value;
        if (this.privilegeIndex !== null) {
            this.repositoriesAccess().at(this.privilegeIndex).setValue(value);
            this.dataSource.data.splice(this.privilegeIndex, 1);
        } else {
            // We need to push a NEW form with the values from the old one into the parent because of
            // weird issues. https://github.com/angular/angular/issues/25814
            this.repositoriesAccess().push(UserForm.generateAccessModelPathForm(value));
            this.dataSource.data.push(value);
        }

        // Update the table records.
        this.updateDataSource();
    }

    showForm(privilege = null, index = null) {
        if (privilege !== null && index !== null) {
            this.privilege = privilege;
            this.privilegeIndex = index;
        }

        this.privilegeForm = UserForm.generateAccessModelPathForm(privilege);

        if (this.isParentFormDisabled()) {
            this.privilegeForm.disable();
        }

        this.storageField = this.privilegeForm.get('storageId') as FormControl;
        this.repositoryField = this.privilegeForm.get('repositoryId') as FormControl;

        this.storageSearchDataSource = new DefaultAutocompleteDataSource(null, this.storageAutocompleteService, true);
        this.repositorySearchDataSource = new DefaultAutocompleteDataSource(null, this.repositoryAutocompleteService, true);

        // we need to show the form, so that @ViewChild will be able to pickup the element and then force change detection.
        this.showEditForm = true;
        this.cdr.detectChanges();
    }

    resetState() {
        this.privilege = null;
        this.privilegeIndex = null;
        this.privilegeForm = null;
        this.showEditForm = false;
    }

    save() {
        this.updateCollection(this.privilegeForm);
        this.resetState();
    }

    delete(index = null) {
        if (index === null && this.privilegeIndex !== null) {
            index = this.privilegeIndex;
        }

        if (index !== null) {
            this.repositoriesAccess().removeAt(index);
            this.updateDataSource();

            if (this.dataSource.data.length === 0) {
                this.selection.clear();
            }
        }

        this.resetState();
    }

    deleteSelected() {
        const selected = this.selection.selected;

        selected.forEach((selectedPathPrivilege: PathPrivilege) => {
            const index = this.repositoriesAccess()
                .getRawValue()
                .findIndex((formPathPrivilege) => {
                    return formPathPrivilege.path === selectedPathPrivilege.path
                        && formPathPrivilege.groupRepositoryId === selectedPathPrivilege.repositoryId
                        && formPathPrivilege.storageId === selectedPathPrivilege.storageId;
                });

            if (index > -1) {
                this.repositoriesAccess().removeAt(index);
            }
        });

        this.selection.clear();
        this.updateDataSource();
    }

    isSomeSelected() {
        return this.selection.selected.length > 0;
    }

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource.data.forEach(row => this.selection.select(row));
    }

    isParentFormDisabled() {
        return this.parentForm ? this.parentForm.disabled : false;
    }

}
