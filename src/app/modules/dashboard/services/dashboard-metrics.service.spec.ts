import {inject, TestBed} from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';

import {DashboardMetricsService} from './dashboard-metrics.service';

describe('Service: DashboardMetricsService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            providers: [DashboardMetricsService]
        });
    });

    it('should be created', inject([DashboardMetricsService], (service: DashboardMetricsService) => {
        expect(service).toBeTruthy();
    }));
});
