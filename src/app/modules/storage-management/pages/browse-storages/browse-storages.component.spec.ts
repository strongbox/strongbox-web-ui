import { async, ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {NgxsModule} from '@ngxs/store';
import {NgxsFormPluginModule} from '@ngxs/form-plugin';
import {ToastrModule} from 'ngx-toastr';

import {BrowseStoragesComponent} from './browse-storages.component';
import {MaterialModule} from '../../../../shared/material.module';
import {FormHelperModule} from '../../../../shared/form/form-helper.module';
import {LayoutModule} from '../../../../shared/layout/layout.module';
import {AppState} from '../../../../state/app.state';
import {BrowseStoragesState} from './state/browse-storages.state.model';
import {ListStoragesComponent} from './components/list-storages/list-storages.component';
import {ListRepositoriesComponent} from './components/list-repositories/list-repositories.component';

describe('StorageManagerComponent', () => {
    let component: BrowseStoragesComponent;
    let fixture: ComponentFixture<BrowseStoragesComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                BrowserAnimationsModule,
                MaterialModule,
                FormsModule,
                FormHelperModule,
                LayoutModule,
                ReactiveFormsModule,
                HttpClientTestingModule,
                NgxsModule.forRoot([AppState, BrowseStoragesState]),
                NgxsFormPluginModule,
                FormHelperModule,
                ToastrModule.forRoot()
            ],
            declarations: [
                BrowseStoragesComponent,
                ListStoragesComponent,
                ListRepositoriesComponent
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BrowseStoragesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
