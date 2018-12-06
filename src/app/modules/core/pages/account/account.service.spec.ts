import {inject, TestBed} from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';

import {AccountService} from './account.service';

describe('Service: AccountService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [AccountService]
        });
    });

    it('should be created', inject([AccountService], (service: AccountService) => {
        expect(service).toBeTruthy();
    }));
});
