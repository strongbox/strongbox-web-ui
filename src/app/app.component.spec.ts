import {TestBed} from '@angular/core/testing';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {NgProgressModule} from '@ngx-progressbar/core';
import {NgProgressHttpModule} from '@ngx-progressbar/http';
import {FormsModule} from '@angular/forms';
import {NgxsModule} from '@ngxs/store';

import {AppComponent} from './app.component';
import {MaterialModule} from './shared/material.module';
import {AuthService} from './modules/core/auth/auth.service';
import {SessionState} from './modules/core/auth/state/session.state';
import {AppState} from './state/app.state';

describe('AppComponent', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                BrowserModule,
                NoopAnimationsModule,
                HttpClientTestingModule,
                NgProgressModule.forRoot(),
                NgProgressHttpModule,
                NgxsModule.forRoot([AppState, SessionState]),
                MaterialModule,
                FormsModule,
                RouterTestingModule
            ],
            declarations: [
                AppComponent
            ],
            providers: [
                AuthService
            ]
        }).compileComponents();
    });

    it('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    });
});
