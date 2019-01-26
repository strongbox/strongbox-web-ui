import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {NgxsModule} from '@ngxs/store';
import {ToastrModule} from 'ngx-toastr';

import {ListStoragesComponent} from './list-storages.component';
import {MaterialModule} from '../../../../../../shared/material.module';
import {FormHelperModule} from '../../../../../../shared/form/form-helper.module';
import {LayoutModule} from '../../../../../../shared/layout/layout.module';
import {AppState} from '../../../../../../state/app.state';
import {BrowseStoragesState} from '../../state/browse-storages.state.model';
import {StorageManagerService} from '../../../../services/storage-manager.service';

describe('ListStoragesComponent', () => {
    let component: ListStoragesComponent;
    let fixture: ComponentFixture<ListStoragesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                BrowserAnimationsModule,
                MaterialModule,
                LayoutModule,
                HttpClientTestingModule,
                NgxsModule.forRoot([AppState, BrowseStoragesState]),
                FormHelperModule,
                ToastrModule.forRoot()
            ],
            providers: [StorageManagerService],
            declarations: [ListStoragesComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ListStoragesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
