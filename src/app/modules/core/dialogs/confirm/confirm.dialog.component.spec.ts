import {ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {NgxsModule} from '@ngxs/store';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {of} from 'rxjs';

import {MaterialModule} from '../../../../shared/material.module';
import {ConfirmDialogComponent} from './confirm.dialog.component';
import {AppState} from '../../../../state/app.state';

describe('Dialog: ConfirmDialogComponent', () => {
    let component: ConfirmDialogComponent;
    let fixture: ComponentFixture<ConfirmDialogComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                NoopAnimationsModule,
                MaterialModule,
                HttpClientTestingModule,
                NgxsModule.forRoot([AppState]),
                ReactiveFormsModule
            ],
            declarations: [ConfirmDialogComponent],
            providers: [
                {provide: MAT_DIALOG_DATA, useValue: {}},
                {
                    provide: MatDialogRef, useValue: {
                        afterClosed: () => of(null),
                        backdropClick: () => of(null),
                        close: () => of(null),
                        updateSize: () => of(null)
                    }
                }
            ]
        });

        fixture = TestBed.createComponent(ConfirmDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create an instance', () => {
        expect(component).toBeTruthy();
    });
});
