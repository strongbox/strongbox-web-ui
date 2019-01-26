import {TestBed} from '@angular/core/testing';

import {StorageManagerService} from './storage-manager.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('Service: StorageManagerService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        imports: [HttpClientTestingModule]
    }));

    it('should be created', () => {
        const service: StorageManagerService = TestBed.get(StorageManagerService);
        expect(service).toBeTruthy();
    });
});
