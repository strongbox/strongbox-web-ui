import {ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {ToastrModule} from 'ngx-toastr';

import {CpuStatsComponent} from './cpu-stats.component';
import {MaterialModule} from '../../../../../../shared/material.module';

describe('CpuStatsComponent', () => {
    let component: CpuStatsComponent;
    let fixture: ComponentFixture<CpuStatsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NoopAnimationsModule,
                MaterialModule,
                HttpClientTestingModule,
                RouterTestingModule,
                ToastrModule.forRoot()
            ],
            declarations: [CpuStatsComponent]
        });

        fixture = TestBed.createComponent(CpuStatsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create an instance', () => {
        expect(component).toBeTruthy();
    });

});
