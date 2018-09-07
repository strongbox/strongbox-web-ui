import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {NgxsModule} from '@ngxs/store';
import {NgxsFormPluginModule} from '@ngxs/form-plugin';
import {ToastrModule} from 'ngx-toastr';

import {UserAccessModelComponent} from './user-access-model.component';
import {MaterialModule} from '../../../../../../shared/material.module';
import {FormHelperModule} from '../../../../../../shared/form-helper.module';
import {AppState} from '../../../../../../state/app.state';
import {UserAccessModelComponentEnums, UserForm} from '../../../../user.model';

describe('Component: UserAccessModelComponent', () => {
    let component: UserAccessModelComponent;
    let fixture: ComponentFixture<UserAccessModelComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                BrowserAnimationsModule,
                FormsModule,
                ReactiveFormsModule,
                MaterialModule,
                FormHelperModule,
                HttpClientTestingModule,
                ToastrModule.forRoot(),
                NgxsModule.forRoot([AppState]),
                NgxsFormPluginModule
            ],
            declarations: [UserAccessModelComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UserAccessModelComponent);
        component = fixture.componentInstance;
        component.parentForm = new UserForm().getForm();
        component.type = UserAccessModelComponentEnums.repositoryPrivileges;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
