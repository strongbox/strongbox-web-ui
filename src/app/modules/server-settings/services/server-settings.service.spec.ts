import {TestBed} from '@angular/core/testing';

import {ServerSettingsService} from './server-settings.service';
import {HttpClientModule} from '@angular/common/http';

describe('ServerSettingsService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        imports: [
            HttpClientModule
        ]
    }));

    it('should be created', () => {
        const service: ServerSettingsService = TestBed.get(ServerSettingsService);
        expect(service).toBeTruthy();
    });
});
