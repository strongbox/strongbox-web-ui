import {TestBed} from '@angular/core/testing';

import {DirectoryListingService} from './directory-listing.service';

describe('DirectoryListingService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: DirectoryListingService = TestBed.get(DirectoryListingService);
        expect(service).toBeTruthy();
    });
});
