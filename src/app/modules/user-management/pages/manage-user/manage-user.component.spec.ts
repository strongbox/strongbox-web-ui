import { async, ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ToastrModule} from 'ngx-toastr';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import {NgxsModule} from '@ngxs/store';
import {NgxsFormPluginModule} from '@ngxs/form-plugin';

import {MaterialModule} from '../../../../shared/material.module';
import {FormHelperModule} from '../../../../shared/form/form-helper.module';
import {ManageUserComponent} from './manage-user.component';
import {AppState} from '../../../../state/app.state';
import {UserAccessModelComponent} from './form/access-model-listing/user-access-model.component';
import {LayoutModule} from '../../../../shared/layout/layout.module';

describe('Component: ManageUserComponent', () => {
    let component: ManageUserComponent;
    let fixture: ComponentFixture<ManageUserComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                BrowserAnimationsModule,
                FormsModule,
                ReactiveFormsModule,
                LayoutModule,
                MaterialModule,
                FormHelperModule,
                HttpClientTestingModule,
                ToastrModule.forRoot(),
                NgxsModule.forRoot([AppState]),
                NgxsFormPluginModule
            ],
            declarations: [ManageUserComponent, UserAccessModelComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ManageUserComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
