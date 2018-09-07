import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {FormArray, FormGroup} from '@angular/forms';
import {SelectionModel} from '@angular/cdk/collections';
import {MatSort, MatTableDataSource} from '@angular/material';

import {FADE_IN_OUT_OVERLAP, FADE_OUT} from '../../../../../../shared/animations';
import {AssignablePrivilege, PathPrivilege, UserAccessModelComponentEnums, UserForm} from '../../../../user.model';

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
export class UserAccessModelComponent implements AfterViewInit, OnChanges {

    @Input()
    public parentForm: FormGroup;

    @Input()
    public assignablePrivileges: AssignablePrivilege[] = [];

    private _type: any;

    @Input('type')
    set type(value) {
        this._type = value;
    }

    get type() {
        return UserAccessModelComponentEnums[this._type];
    }

    /**
     * Table variables
     */
    public readonly displayAllColumns: string[] = ['select', 'path', 'privileges', 'actions'];
    public readonly displayViewColumns: string[] = ['path', 'privileges', 'actions'];
    public displayedColumns: string[] = this.displayAllColumns;
    public dataSource: MatTableDataSource<PathPrivilege> = new MatTableDataSource<PathPrivilege>();
    public selection = new SelectionModel<PathPrivilege>(true, []);
    public sort;

    public privilege: PathPrivilege = null;
    public privilegeIndex: number = null;

    public privilegeForm: FormGroup;

    public showEditForm = false;

    constructor() {
    }

    public compareSelected = (val1: string, val2: string) => val1 === val2;

    @ViewChild(MatSort) set content(content: ElementRef) {
        this.sort = content;
        if (this.sort) {
            this.dataSource.sort = this.sort;
        }
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
        this.dataSource = new MatTableDataSource(this.collection().getRawValue());
    }

    collection(): FormArray {
        return this.parentForm.get('accessModel').get(this.type) as FormArray;
    }

    updateCollection(form): void {
        const value = form.value;
        if (this.privilegeIndex !== null) {
            this.collection().at(this.privilegeIndex).setValue(value);
            this.dataSource.data.splice(this.privilegeIndex, 1);
        } else {
            // We need to push a NEW form with the values from the old one into the parent because of
            // weird issues. https://github.com/angular/angular/issues/25814
            this.collection().push(UserForm.generateAccessModelPathForm(value, this._type, this.parentForm));
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

        this.privilegeForm = UserForm.generateAccessModelPathForm(privilege, this._type, this.parentForm);

        if (this.isFormDisabled()) {
            this.privilegeForm.disable();
        }

        this.showEditForm = true;
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
        if (index !== null) {
            this.collection().removeAt(index);
            this.updateDataSource();

            if (this.dataSource.data.length === 0) {
                this.selection.clear();
            }
        }

        this.showEditForm = false;
    }

    deleteSelected() {
        const selected = this.selection.selected.map((s) => s.path.trim());

        selected.forEach((p) => {
            this.collection().getRawValue().forEach((v: PathPrivilege, i) => {
                if (selected.indexOf(v.path.trim()) > -1) {
                    this.collection().removeAt(i);
                    return;
                }
            });
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

    privilegeFormPrivileges() {
        return this.privilegeForm.get('privileges').value || [];
    }

    isFormDisabled() {
        return this.parentForm ? this.parentForm.disabled : false;
    }

    isRepositoryType() {
        return this.type === UserAccessModelComponentEnums.repositoryPrivileges;
    }

    isUrlType() {
        return this.type === UserAccessModelComponentEnums.urlToPrivileges;
    }

    isWildcardType() {
        return this.type === UserAccessModelComponentEnums.wildCardPrivileges;
    }
}
