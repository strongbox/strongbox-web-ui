import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';

import {DirectoryListingService} from './directory-listing.service';

describe('Service: DirectoryListingService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        imports: [HttpClientTestingModule]
    }));

    it('should be created', () => {
        const service: DirectoryListingService = TestBed.inject(DirectoryListingService);
        expect(service).toBeTruthy();
    });
});
