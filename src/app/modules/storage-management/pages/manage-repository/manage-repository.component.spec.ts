import {async, ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {NgxsModule} from '@ngxs/store';
import {NgxsFormPluginModule} from '@ngxs/form-plugin';
import {ToastrModule} from 'ngx-toastr';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {of} from 'rxjs';
import {ActivatedRoute, convertToParamMap} from '@angular/router';
import {NgProgressModule} from 'ngx-progressbar';
import {NgProgressHttpModule} from 'ngx-progressbar/http';

import {ManageRepositoryComponent} from './manage-repository.component';
import {MaterialModule} from '../../../../shared/material.module';
import {FormHelperModule} from '../../../../shared/form/form-helper.module';
import {LayoutModule} from '../../../../shared/layout/layout.module';
import {RepositoryTypeEnum} from '../../repository.model';
import {BrowserModule} from '@angular/platform-browser';
import {AppState} from '../../../../state/app.state';
import {SessionState} from '../../../core/auth/state/session.state';

describe('Component: ManageRepositoryComponent', () => {
    let component: ManageRepositoryComponent;
    let fixture: ComponentFixture<ManageRepositoryComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                BrowserModule,
                RouterTestingModule,
                DragDropModule,
                MaterialModule,
                FormsModule,
                FormHelperModule,
                LayoutModule,
                ReactiveFormsModule,
                HttpClientTestingModule,
                NgxsModule.forRoot([AppState, SessionState]),
                NgxsFormPluginModule,
                NgProgressModule,
                NgProgressHttpModule,
                NoopAnimationsModule,
                ToastrModule.forRoot(),
            ],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: {
                        paramMap: of(convertToParamMap({
                            storageId: 'storage-id',
                            type: RepositoryTypeEnum.HOSTED.toLowerCase()
                        }))
                    }
                }
            ],
            declarations: [ManageRepositoryComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ManageRepositoryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
