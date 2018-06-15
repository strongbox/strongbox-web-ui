import {TestBed} from '@angular/core/testing';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {RouterTestingModule} from '@angular/router/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {NgProgressModule} from '@ngx-progressbar/core';
import {NgProgressHttpModule} from '@ngx-progressbar/http';
import {MaterialModule} from './shared/material.module';
import {FormsModule} from '@angular/forms';

describe('AppComponent', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                BrowserModule,
                NoopAnimationsModule,
                HttpClientTestingModule,
                NgProgressModule.forRoot(),
                NgProgressHttpModule,
                MaterialModule,
                FormsModule,
                RouterTestingModule
            ],
            declarations: [
                AppComponent
            ]
        }).compileComponents();
    });

    it('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    });
});
