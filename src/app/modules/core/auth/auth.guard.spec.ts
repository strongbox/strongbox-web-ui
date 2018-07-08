import {TestBed} from '@angular/core/testing';
import {Router} from '@angular/router';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {NgxsModule, Store} from '@ngxs/store';

import {AuthGuard} from './auth.guard';
import {AuthService} from './auth.service';
import {defaultSessionState, SessionState} from './session.state';

describe('AuthGuard should', () => {
    let authGuard: AuthGuard;
    let store: Store;

    const authenticatedSession = {
        session: {
            ...defaultSessionState,
            state: 'authenticated'
        }
    };

    const guestSession = {
        session: defaultSessionState
    };

    // async beforeEach
    beforeEach(() => {
        const router = {
            navigate: jasmine.createSpy('navigate')
        };

        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                NgxsModule.forRoot([
                    SessionState
                ]),
            ],
            providers: [
                AuthGuard,
                AuthService,
                {provide: Router, useValue: router}
            ]
        }).compileComponents(); // compile template and css

        authGuard = TestBed.get(AuthGuard);
        store = TestBed.get(Store);
    });

    it('allow logged in users to access route', () => {
        store.reset(authenticatedSession);
        authGuard.canActivate().subscribe((result) => {
            expect(result).toBe(true);
        });
    });

    it('prevent unauthenticated users to access route', () => {
        store.reset(guestSession);
        authGuard.canActivate().subscribe((result) => {
            expect(result).toBe(false);
        });
    });
});
