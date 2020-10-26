import {TestBed} from '@angular/core/testing';

import {AqlAutocompleteService} from './aql-autocomplete.service';

describe('AqlAutocompleteService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: AqlAutocompleteService = TestBed.inject(AqlAutocompleteService);
        expect(service).toBeTruthy();
    });
});
