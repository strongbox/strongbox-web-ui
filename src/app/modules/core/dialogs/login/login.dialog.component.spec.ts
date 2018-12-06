import {ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {NgxsModule, Store} from '@ngxs/store';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {of} from 'rxjs';

import {LoginDialogComponent} from './login.dialog.component';
import {MaterialModule} from '../../../../shared/material.module';
import {InvalidCredentialsAction} from '../../auth/state/auth.actions';
import {AppState} from '../../../../state/app.state';
import {SessionState} from '../../auth/state/session.state';


describe('Dialog: LoginDialogComponent', () => {
    let component: LoginDialogComponent;
    let fixture: ComponentFixture<LoginDialogComponent>;
    let store: Store;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NoopAnimationsModule,
                MaterialModule,
                HttpClientTestingModule,
                RouterTestingModule,
                NgxsModule.forRoot([AppState, SessionState]),
                ReactiveFormsModule
            ],
            declarations: [LoginDialogComponent],
            providers: [
                {provide: MAT_DIALOG_DATA, useValue: {}},
                {provide: MatDialogRef, useValue: {afterClosed: () => of(null)}}
            ]
        });

        fixture = TestBed.createComponent(LoginDialogComponent);
        store = TestBed.get(Store);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create an instance', () => {
        expect(component).toBeTruthy();
    });

    it('should handle dispatched InvalidCredentialsAction', () => {
        expect(component).toBeTruthy();
        expect(component.form.hasError('wrongCredentials')).toBe(false);
        store.dispatch(new InvalidCredentialsAction());
        expect(component.form.hasError('wrongCredentials')).toBe(true);
    });
});
