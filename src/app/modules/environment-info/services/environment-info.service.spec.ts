import {TestBed} from '@angular/core/testing';

import {EnvironmentInfoService} from './environment-info.service';
import {HttpClientModule} from '@angular/common/http';

describe('EnvironmentInfoService', () => {
    beforeEach(() => TestBed.configureTestingModule({imports: [HttpClientModule]}));

    it('should be created', () => {
        const service: EnvironmentInfoService = TestBed.inject(EnvironmentInfoService);
        expect(service).toBeTruthy();
    });
});
