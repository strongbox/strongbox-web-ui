import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';

import {SecurityLdapConfigurationComponent} from './security-ldap-configuration.component';
import {MaterialModule} from '../../../../../shared/material.module';
import {LayoutModule} from '../../../../../shared/layout/layout.module';
import {FormHelperModule} from '../../../../../shared/form/form-helper.module';

describe('SecurityLdapConfigurationComponent', () => {
    let component: SecurityLdapConfigurationComponent;
    let fixture: ComponentFixture<SecurityLdapConfigurationComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SecurityLdapConfigurationComponent],
            imports: [
                NoopAnimationsModule,
                HttpClientTestingModule,
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
        fixture = TestBed.createComponent(SecurityLdapConfigurationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
