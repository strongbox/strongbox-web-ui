import {ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {ChartsModule} from 'ng2-charts';

import {MaterialModule} from '../../../../../../shared/material.module';

import {JvmLiveThreadsStatsComponent} from './jvm-live-threads-stats.component';

describe('JvmLiveThreadsStatsComponent', () => {
    let component: JvmLiveThreadsStatsComponent;
    let fixture: ComponentFixture<JvmLiveThreadsStatsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NoopAnimationsModule,
                MaterialModule,
                HttpClientTestingModule,
                RouterTestingModule,
                ChartsModule
            ],
            declarations: [JvmLiveThreadsStatsComponent]
        });

        fixture = TestBed.createComponent(JvmLiveThreadsStatsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create an instance', () => {
        expect(component).toBeTruthy();
    });

});
