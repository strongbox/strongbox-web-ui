import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {NgxsModule} from '@ngxs/store';
import {ToastrModule} from 'ngx-toastr';

import {BrowseLogsComponent} from './browse-logs.component';
import {LayoutModule} from '../../../../shared/layout/layout.module';
import {MaterialModule} from '../../../../shared/material.module';
import {FormHelperModule} from '../../../../shared/form/form-helper.module';

describe('Component: BrowseLogsComponent', () => {
    let component: BrowseLogsComponent;
    let fixture: ComponentFixture<BrowseLogsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                NoopAnimationsModule,
                FormsModule,
                ReactiveFormsModule,
                LayoutModule,
                MaterialModule,
                FormHelperModule,
                HttpClientTestingModule,
                NgxsModule.forRoot(),
                ToastrModule.forRoot()
            ],
            declarations: [BrowseLogsComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BrowseLogsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
