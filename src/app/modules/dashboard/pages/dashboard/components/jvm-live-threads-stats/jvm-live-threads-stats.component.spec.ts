import {ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

import {JvmLiveThreadsStatsComponent} from './jvm-live-threads-stats.component';
import {MaterialModule} from '../../../../../../shared/material.module';

describe('JvmLiveThreadsStatsComponent', () => {
    let component: JvmLiveThreadsStatsComponent;
    let fixture: ComponentFixture<JvmLiveThreadsStatsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NoopAnimationsModule,
                MaterialModule,
                HttpClientTestingModule,
                RouterTestingModule
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
