import {async, ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {NgxsModule} from '@ngxs/store';
import {ToastrModule} from 'ngx-toastr';

import {ListRepositoriesComponent} from './list-repositories.component';
import {MaterialModule} from '../../../../../../shared/material.module';
import {LayoutModule} from '../../../../../../shared/layout/layout.module';
import {AppState} from '../../../../../../state/app.state';
import {BrowseStoragesState} from '../../state/browse-storages.state.model';
import {FormHelperModule} from '../../../../../../shared/form/form-helper.module';
import {StorageManagerService} from '../../../../services/storage-manager.service';

describe('ListRepositoriesComponent', () => {
    let component: ListRepositoriesComponent;
    let fixture: ComponentFixture<ListRepositoriesComponent>;

    beforeEach(waitForAsync(() => {
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
            declarations: [ListRepositoriesComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ListRepositoriesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
