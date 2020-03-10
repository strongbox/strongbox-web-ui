import {ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

import {JvmMemoryStatsComponent} from './jvm-memory-stats.component';
import {MaterialModule} from '../../../../../../shared/material.module';

describe('JvmMemoryStatsComponent', () => {
    let component: JvmMemoryStatsComponent;
    let fixture: ComponentFixture<JvmMemoryStatsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NoopAnimationsModule,
                MaterialModule,
                HttpClientTestingModule,
                RouterTestingModule
            ],
            declarations: [JvmMemoryStatsComponent]
        });

        fixture = TestBed.createComponent(JvmMemoryStatsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create an instance', () => {
        expect(component).toBeTruthy();
    });

});
