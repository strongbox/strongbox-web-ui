import {TestBed} from '@angular/core/testing';

import {StorageManagerService} from './storage-manager.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';

describe('Service: StorageManagerService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        imports: [
            HttpClientTestingModule,
            RouterTestingModule
        ],
        providers: [
            StorageManagerService
        ]
    }));

    it('should be created', () => {
        const service: StorageManagerService = TestBed.inject(StorageManagerService);
        expect(service).toBeTruthy();
    });
});
