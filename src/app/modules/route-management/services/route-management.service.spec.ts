import {inject, TestBed} from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';

import {RouteManagementService} from './route-management.service';

describe('Service: RouteManagementService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            providers: [RouteManagementService]
        });
    });

    it('should be created', inject([RouteManagementService], (service: RouteManagementService) => {
        expect(service).toBeTruthy();
    }));
});
