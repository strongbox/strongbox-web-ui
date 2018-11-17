import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {CommonModule} from '@angular/common';

import {EnvironmentInfoComponent} from './environment-info.component';
import {MaterialModule} from '../../../../shared/material.module';
import {LayoutModule} from '../../../../shared/layout/layout.module';
import {HttpClientModule} from '@angular/common/http';
import {ToastrModule} from 'ngx-toastr';
import {RouterTestingModule} from '@angular/router/testing';

describe('EnvironmentInfoComponent', () => {
    let component: EnvironmentInfoComponent;
    let fixture: ComponentFixture<EnvironmentInfoComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                MaterialModule,
                LayoutModule,
                HttpClientModule,
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
