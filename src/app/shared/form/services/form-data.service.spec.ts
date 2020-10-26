import {TestBed} from '@angular/core/testing';

import {FormDataService} from './form-data.service';
import {HttpClientModule} from '@angular/common/http';

describe('FormDataServiceService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        imports: [
            HttpClientModule
        ]
    }));

    it('should be created', () => {
        const service: FormDataService = TestBed.inject(FormDataService);
        expect(service).toBeTruthy();
    });
});
