import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {NgxsModule} from '@ngxs/store';
import {ToastrModule} from 'ngx-toastr';

import {StorageFormDialogComponent} from './storage-form.dialog.component';
import {MaterialModule} from '../../../../shared/material.module';
import {FormHelperModule} from '../../../../shared/form/form-helper.module';
import {StorageManagerService} from '../../services/storage-manager.service';
import {AppState} from '../../../../state/app.state';
import {BrowseStoragesState} from '../../pages/browse-storages/state/browse-storages.state.model';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {of} from 'rxjs';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

describe('StoragesDialogComponent', () => {
    let component: StorageFormDialogComponent;
    let fixture: ComponentFixture<StorageFormDialogComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                NoopAnimationsModule,
                RouterTestingModule,
                MaterialModule,
                FormsModule,
                FormHelperModule,
                ReactiveFormsModule,
                HttpClientTestingModule,
                NgxsModule.forRoot([AppState, BrowseStoragesState]),
                ToastrModule.forRoot()
            ],
            providers: [
                StorageManagerService,
                {provide: MAT_DIALOG_DATA, useValue: {}},
                {
                    provide: MatDialogRef, useValue: {
                        afterClosed: () => of(null),
                        backdropClick: () => of(null),
                        close: () => of(null),
                        updateSize: () => of(null)
                    }
                }
            ],
            declarations: [StorageFormDialogComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StorageFormDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
