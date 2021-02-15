import { async, ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {NgxsModule} from '@ngxs/store';
import {ToastrModule} from 'ngx-toastr';

import {VirtualScrollerModule} from 'ngx-virtual-scroller';
import {StreamLogComponent} from './stream-log.component';
import {LayoutModule} from '../../../../shared/layout/layout.module';
import {MaterialModule} from '../../../../shared/material.module';
import {FormHelperModule} from '../../../../shared/form/form-helper.module';
import {StreamLogFilterComponent} from './components/stream-log-filter/stream-log-filter.component';

import {StreamLogDataSource} from './stream-log.datasource';
import {of} from 'rxjs';
import {ConnectionState, EventSourceMessage} from '../../../core/rxjs/fromEventSource';
import {bufferTime, take} from 'rxjs/operators';


describe('StreamLogComponent', () => {
    let component: StreamLogComponent;
    let fixture: ComponentFixture<StreamLogComponent>;

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
                VirtualScrollerModule
            ],
            declarations: [StreamLogComponent, StreamLogFilterComponent]
        }).compileComponents();

        const dataSourceMock = new StreamLogDataSource();
        spyOn(dataSourceMock, 'getEventSource').and.returnValue(
            of({
                connectionState: ConnectionState.OPEN,
                type: 'stream',
                data: 'some log message',
                rawEvent: null
            } as EventSourceMessage).pipe(
                take(1),
                bufferTime(800, null, 2000)
            )
        );

        fixture = TestBed.createComponent(StreamLogComponent);
        component = fixture.componentInstance;

        spyOn(component, 'getDataSourceInstance').and.returnValue(dataSourceMock);

        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
