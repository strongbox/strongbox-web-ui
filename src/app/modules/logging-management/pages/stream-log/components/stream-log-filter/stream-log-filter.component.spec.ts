import { async, ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {NgxsModule} from '@ngxs/store';
import {ToastrModule} from 'ngx-toastr';

import {StreamLogFilterComponent} from './stream-log-filter.component';
import {LayoutModule} from '../../../../../../shared/layout/layout.module';
import {MaterialModule} from '../../../../../../shared/material.module';
import {FormHelperModule} from '../../../../../../shared/form/form-helper.module';

describe('Component: StreamLogFilterComponent', () => {
    let component: StreamLogFilterComponent;
    let fixture: ComponentFixture<StreamLogFilterComponent>;
    const filtersData = ['filter1', 'filter2', 'filter3'];

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                NoopAnimationsModule,
                FormsModule,
                ReactiveFormsModule,
                LayoutModule,
                MaterialModule,
                FormHelperModule,
                HttpClientTestingModule,
                NgxsModule.forRoot(),
                ToastrModule.forRoot(),
            ],
            declarations: [StreamLogFilterComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StreamLogFilterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should save and restore history', () => {

        component.filters = filtersData;
        component.saveLocalStorageHistory();

        component.filters = [];
        component.restoreLocalStorageHistory();

        expect(component.filters).toEqual(filtersData);
    });

    it('should delete history', () => {
        component.filters = filtersData;
        component.saveLocalStorageHistory();
        component.deleteHistory(new Event('mouse'), filtersData[0]);

        expect(component.filters.length).toBeLessThan(filtersData.length);
    });

});
