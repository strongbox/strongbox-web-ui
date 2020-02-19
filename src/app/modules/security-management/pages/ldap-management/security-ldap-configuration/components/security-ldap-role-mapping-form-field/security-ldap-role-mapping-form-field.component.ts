import {Component, ElementRef, Input, OnDestroy, OnInit, Optional, Self} from '@angular/core';
import {ControlValueAccessor, FormArray, FormControl, FormGroup, NgControl, Validators} from '@angular/forms';
import {MatFormFieldControl} from '@angular/material/form-field';
import {of, Subject} from 'rxjs';
import {coerceBooleanProperty} from '@angular/cdk/coercion';
import {catchError, finalize, takeUntil} from 'rxjs/operators';

import {LdapRoleMapping} from '../../../../../ldap-role-mapping.model';
import {UserFormFieldsData, UserRole} from '../../../../../../user-management/user.model';
import {UserManagementService} from '../../../../../../user-management/services/user-management.service';

@Component({
    selector: 'app-security-ldap-role-mapping-form-field',
    templateUrl: './security-ldap-role-mapping-form-field.component.html',
    styleUrls: ['./security-ldap-role-mapping-form-field.component.scss'],
    providers: [
        {provide: MatFormFieldControl, useExisting: SecurityLdapRoleMappingFormFieldComponent}
    ],
})
export class SecurityLdapRoleMappingFormFieldComponent implements ControlValueAccessor, MatFormFieldControl<LdapRoleMapping[]>, OnInit, OnDestroy {
    static nextId = 0;

    private static _formFieldName = 'roleMappingList';

    private _placeholder: string;
    private _required = false;
    private _disabled = false;

    private _roleMappingList = [];

    controlType = 'role-mapping-input';
    id = `${this.controlType}-${SecurityLdapRoleMappingFormFieldComponent.nextId++}`;
    stateChanges = new Subject<void>();
    focused = false;
    describedBy = '';
    errorState = false;

    strongboxRoles: UserRole[] = [];
    strongboxRoleSearchLoading = false;

    form: FormGroup = new FormGroup({
        roleMappingList: new FormArray([])
    });

    /* tslint:disable */
    onChange = (_: any) => {
    };
    onTouched = () => {
    };

    /* tslint:enable */

    get empty() {
        const {value: {externalRole, strongboxRole}} = this.form;

        return !externalRole && !strongboxRole;
    }

    get shouldLabelFloat() {
        return this.focused || !this.empty;
    }

    @Input()
    get placeholder(): string {
        return this._placeholder;
    }

    set placeholder(value: string) {
        this._placeholder = value;
        this.stateChanges.next();
    }


    @Input()
    get required(): boolean {
        return this._required;
    }

    set required(value: boolean) {
        this._required = coerceBooleanProperty(value);
        this.stateChanges.next();
    }

    @Input()
    get disabled(): boolean {
        return this._disabled;
    }

    set disabled(value: boolean) {
        this._disabled = coerceBooleanProperty(value);
        this._disabled ? this.form.disable() : this.form.enable();
        this.stateChanges.next();
    }

    @Input()
    get value(): LdapRoleMapping[] | null {
        return this._roleMappingList;
    }

    set value(list: LdapRoleMapping[] | null) {
        if (list !== null && list !== this._roleMappingList) {
            this._roleMappingList = list;
            list.forEach((roleMapping: LdapRoleMapping) => this.addItem(roleMapping));
            this.form.updateValueAndValidity();
            this.stateChanges.next();

            this.emitFormValidity();

            this.onChange(list);
        }
    }

    constructor(private _userManagementService: UserManagementService,
                private _elementRef: ElementRef<HTMLElement>,
                @Optional() @Self() public ngControl: NgControl) {

        if (this.ngControl != null) {
            this.ngControl.valueAccessor = this;
        }

        this.form
            .valueChanges
            .pipe(takeUntil(this.stateChanges))
            .subscribe(() => {
                this.stateChanges.next();
            });


    }

    ngOnInit() {
        this.strongboxRoleSearchLoading = true;
        this._userManagementService
            .getUserFormFields()
            .pipe(
                catchError(() => of([])), // empty list on error
                finalize(() => this.strongboxRoleSearchLoading = false)
            )
            .subscribe((roles: UserFormFieldsData) => {
                this.strongboxRoles = roles.assignableRoles;
            });
    }

    ngOnDestroy() {
        this.stateChanges.complete();
    }

    setDescribedByIds(ids: string[]) {
        this.describedBy = ids.join(' ');
    }

    writeValue(roleMapping: LdapRoleMapping[] | null): void {
        this.value = roleMapping;
        this.onChange(roleMapping);
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    onContainerClick(event: MouseEvent): void {
        // noop.
    }

    // will be called when an input has been updated to propagate the validation state.
    emitFormValidity() {
        if (this.ngControl !== null && this.ngControl.control !== null) {
            if (this.form.invalid) {
                this.ngControl.control.setErrors([{invalidRoleMappingList: 'Role mapping list contains invalid data!'}]);
            } else {
                this.ngControl.control.setErrors(null);
            }
        }
    }

    addItem(roleMapping: LdapRoleMapping = null) {
        let items = this.form.get(this.getFormFieldName()) as FormArray;
        items.push(this.createItem(roleMapping));
        this.form.updateValueAndValidity();
        this.emitFormValidity();
    }

    createItem(roleMapping: LdapRoleMapping = null) {
        return new FormGroup({
            externalRole: new FormControl(roleMapping ? roleMapping.externalRole : '', [Validators.required]),
            strongboxRole: new FormControl(roleMapping ? roleMapping.strongboxRole : '', [Validators.required])
        });
    }

    deleteItem(index) {
        (this.form.get(this.getFormFieldName()) as FormArray).removeAt(index);
        this.form.updateValueAndValidity();
        this.emitFormValidity();
    }

    getFormFieldName() {
        return SecurityLdapRoleMappingFormFieldComponent._formFieldName;
    }

    getFormControls() {
        return (this.form.get(this.getFormFieldName()) as FormArray).controls;
    }

}
