import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {AddLoggerDialogComponent} from './add-logger.dialog.component';
import {LayoutModule} from '../../../../shared/layout/layout.module';
import {MaterialModule} from '../../../../shared/material.module';
import {FormHelperModule} from '../../../../shared/form/form-helper.module';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {of} from 'rxjs';
import {ToastrModule} from 'ngx-toastr';

describe('Dialog: AddLoggerDialogComponent', () => {
    let component: AddLoggerDialogComponent;
    let fixture: ComponentFixture<AddLoggerDialogComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                BrowserAnimationsModule,
                FormsModule,
                ReactiveFormsModule,
                LayoutModule,
                MaterialModule,
                FormHelperModule,
                HttpClientTestingModule,
                ToastrModule.forRoot(),
            ],
            declarations: [AddLoggerDialogComponent],
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
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AddLoggerDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
