import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {NgxsModule} from '@ngxs/store';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {of} from 'rxjs';

import {MaterialModule} from '../../../../shared/material.module';
import {ConfirmDialogComponent} from './confirm.dialog.component';

describe('Dialog: ConfirmDialogComponent', () => {
    let component: ConfirmDialogComponent;
    let fixture: ComponentFixture<ConfirmDialogComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NoopAnimationsModule,
                MaterialModule,
                HttpClientTestingModule,
                NgxsModule.forRoot([]),
                ReactiveFormsModule
            ],
            declarations: [ConfirmDialogComponent],
            providers: [
                {provide: MAT_DIALOG_DATA, useValue: {}},
                {provide: MatDialogRef, useValue: {afterClosed: () => of(null)}}
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
