import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';

import {SecurityManagementIndexComponent} from './security-management-index.component';
import {MaterialModule} from '../../../../shared/material.module';
import {LayoutModule} from '../../../../shared/layout/layout.module';
import {FormHelperModule} from '../../../../shared/form/form-helper.module';

describe('SecurityManagementIndexComponent', () => {
    let component: SecurityManagementIndexComponent;
    let fixture: ComponentFixture<SecurityManagementIndexComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SecurityManagementIndexComponent],
            imports: [
                RouterTestingModule,
                MaterialModule,
                LayoutModule,
                ReactiveFormsModule,
                FormsModule,
                FormHelperModule
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SecurityManagementIndexComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
