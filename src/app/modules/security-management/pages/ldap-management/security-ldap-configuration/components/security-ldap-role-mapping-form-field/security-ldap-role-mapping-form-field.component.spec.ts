import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {async, ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {Component, ViewChild} from '@angular/core';
import {HttpClientTestingModule} from '@angular/common/http/testing';

import {SecurityLdapRoleMappingFormFieldComponent} from './security-ldap-role-mapping-form-field.component';
import {MaterialModule} from '../../../../../../../shared/material.module';
import {LayoutModule} from '../../../../../../../shared/layout/layout.module';
import {FormHelperModule} from '../../../../../../../shared/form/form-helper.module';
import {LdapRoleMapping} from '../../../../../ldap-role-mapping.model';

describe('Form Field: SecurityLdapRoleMappingComponent', () => {
    let component: SecurityLdapRoleMappingFormFieldComponent;
    let fixture: ComponentFixture<SecurityLdapRoleMappingFormFieldComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                NoopAnimationsModule,
                HttpClientTestingModule,
                MaterialModule,
                LayoutModule,
                ReactiveFormsModule,
                FormHelperModule
            ],
            declarations: [SecurityLdapRoleMappingFormFieldComponent, DummyComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SecurityLdapRoleMappingFormFieldComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should render existing roles when [value] is set', () => {
        const preElements = fixture.nativeElement.querySelectorAll('.role-mapping-item');
        expect(preElements.length).toEqual(0);

        const list: LdapRoleMapping[] = [
            {externalRole: 'external1', strongboxRole: 'internal1'},
            {externalRole: 'external2', strongboxRole: 'internal2'},
        ];

        component.value = list;
        fixture.detectChanges();

        const postElements = fixture.nativeElement.querySelectorAll('.role-mapping-item');
        expect(postElements).toBeTruthy();
        expect(postElements.length).toEqual(list.length);
    });

    it('should renter existing roles when inside formGroup', () => {
        const dummyFixture = TestBed.createComponent(DummyComponent);
        const dummyComponent = dummyFixture.componentInstance;
        dummyFixture.detectChanges();

        expect(dummyComponent.roleMappingField.value).toBeTruthy();
        expect(dummyComponent.roleMappingField.value.length).toEqual(3);
        expect(component.form.valid).toBeTruthy();
    });

    it('should propagate invalid form status', () => {
        const preElements = fixture.nativeElement.querySelectorAll('.role-mapping-item');
        expect(preElements.length).toEqual(0);

        const list: LdapRoleMapping[] = [
            {externalRole: 'external1', strongboxRole: 'internal1'},
            {externalRole: 'external2', strongboxRole: 'internal2'},
            {externalRole: 'external3', strongboxRole: 'internal3'},
            {externalRole: 'external4', strongboxRole: null},
        ];

        component.value = list;
        fixture.detectChanges();

        const postElements = fixture.nativeElement.querySelectorAll('.role-mapping-item');
        expect(postElements).toBeTruthy();
        expect(postElements.length).toEqual(list.length);
        expect(component.form.invalid).toBeTruthy();
    });

});

@Component({
    selector: 'app-dummy-component',
    template: `
        <ng-container [formGroup]="form">
            <app-security-ldap-role-mapping-form-field formControlName="roleMappingList" #roleMappingField>
            </app-security-ldap-role-mapping-form-field>
        </ng-container>
    `
})
export class DummyComponent {

    @ViewChild('roleMappingField', {static: true, read: SecurityLdapRoleMappingFormFieldComponent})
    roleMappingField: SecurityLdapRoleMappingFormFieldComponent;

    form: FormGroup = new FormGroup({
        roleMappingList: new FormControl()
    });

    constructor() {
        this.form.get('roleMappingList').setValue([
            {externalRole: 'external1', strongboxRole: 'internal1'},
            {externalRole: 'external2', strongboxRole: 'internal2'},
            {externalRole: 'external3', strongboxRole: 'internal3'},
        ]);
    }
}
