import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {CommonModule} from '@angular/common';

import {EnvironmentInfoComponent} from './environment-info.component';
import {MaterialModule} from '../../../../shared/material.module';
import {LayoutModule} from '../../../../shared/layout/layout.module';
import {ToastrModule} from 'ngx-toastr';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('Component: EnvironmentInfoComponent', () => {
    let component: EnvironmentInfoComponent;
    let fixture: ComponentFixture<EnvironmentInfoComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                MaterialModule,
                LayoutModule,
                HttpClientTestingModule,
                RouterTestingModule,
                ToastrModule.forRoot()
            ],
            declarations: [
                EnvironmentInfoComponent
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EnvironmentInfoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
