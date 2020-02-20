import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';

import {LdapConfigurationService} from './ldap-configuration.service';

describe('LdapConfigurationService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        imports: [HttpClientTestingModule]
    }));

    it('should be created', () => {
        const service: LdapConfigurationService = TestBed.get(LdapConfigurationService);
        expect(service).toBeTruthy();
    });
});
