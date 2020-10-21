import {TestBed} from '@angular/core/testing';

import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {NgxsModule} from '@ngxs/store';

import {BootProgressService} from './boot-progress.service';

describe('BootProgressService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        imports: [
            HttpClientTestingModule,
            RouterTestingModule,
            NgxsModule.forRoot()
        ]
    }));

    it('should be created', () => {
        const service: BootProgressService = TestBed.inject(BootProgressService);
        expect(service).toBeTruthy();
    });
});
