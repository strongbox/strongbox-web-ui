import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {NgxsModule} from '@ngxs/store';
import {NgxsFormPluginModule} from '@ngxs/form-plugin';

import {ManageSettingsComponent} from './manage-settings.component';
import {FormHelperModule} from '../../../../shared/form/form-helper.module';
import {MaterialModule} from '../../../../shared/material.module';
import {LayoutModule} from '../../../../shared/layout/layout.module';
import {AppState} from '../../../../state/app.state';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('ManageSettingsComponent', () => {
    let component: ManageSettingsComponent;
    let fixture: ComponentFixture<ManageSettingsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                BrowserAnimationsModule,
                MaterialModule,
                FormsModule,
                FormHelperModule,
                LayoutModule,
                ReactiveFormsModule,
                HttpClientTestingModule,
                NgxsModule.forRoot([AppState]),
                NgxsFormPluginModule,
                FormHelperModule
            ],
            declarations: [ManageSettingsComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ManageSettingsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
