import {TestBed} from '@angular/core/testing';

import {LoggingService} from './logging.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('Service: LoggingService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
    }));

    it('should be created', () => {
        const service: LoggingService = TestBed.inject(LoggingService);
        expect(service).toBeTruthy();
    });
});
