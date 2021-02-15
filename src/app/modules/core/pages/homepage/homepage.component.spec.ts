import { async, ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {HomepageComponent} from './homepage.component';
import {LayoutModule} from '../../../../shared/layout/layout.module';
import {FormHelperModule} from '../../../../shared/form/form-helper.module';
import {MaterialModule} from '../../../../shared/material.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {NgxsModule} from '@ngxs/store';
import {RouterTestingModule} from '@angular/router/testing';
import {AppState} from '../../../../state/app.state';

describe('HomepageComponent', () => {
    let component: HomepageComponent;
    let fixture: ComponentFixture<HomepageComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                BrowserAnimationsModule,
                HttpClientTestingModule,
                NgxsModule.forRoot([AppState]),
                RouterTestingModule,
                LayoutModule,
                MaterialModule,
                FormHelperModule,
                FormsModule,
                ReactiveFormsModule,
            ],
            declarations: [HomepageComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HomepageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
