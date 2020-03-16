import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ToastrModule} from 'ngx-toastr';
import {ChartsModule} from 'ng2-charts';

import {MaterialModule} from '../../../../shared/material.module';
import {LayoutModule} from '../../../../shared/layout/layout.module';

import {DashboardComponent} from './dashboard.component';
import {CpuStatsComponent} from './components/cpu-stats/cpu-stats.component';
import {JvmMemoryStatsComponent} from './components/jvm-memory-stats/jvm-memory-stats.component';
import {JvmLiveThreadsStatsComponent} from './components/jvm-live-threads-stats/jvm-live-threads-stats.component';

describe('DashboardComponent', () => {
    let component: DashboardComponent;
    let fixture: ComponentFixture<DashboardComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DashboardComponent, CpuStatsComponent, JvmMemoryStatsComponent, JvmLiveThreadsStatsComponent],
            imports: [
                NoopAnimationsModule,
                HttpClientTestingModule,
                RouterTestingModule,
                MaterialModule,
                LayoutModule,
                ToastrModule.forRoot(),
                ChartsModule
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DashboardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
