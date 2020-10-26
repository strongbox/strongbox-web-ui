import {TestBed} from '@angular/core/testing';
import {Router} from '@angular/router';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {NgxsModule, Store} from '@ngxs/store';

import {defaultSessionState, SessionState} from '../../core/auth/state/session.state';
import {AuthService} from '../../core/auth/auth.service';
import {AuthenticatedUser, UserAuthority} from '../../core/auth/auth.model';
import {UpdateUserGuard} from './update-user.guard';


describe('Guard: UpdateUserGuard should', () => {
    let updateUserGuard: UpdateUserGuard;
    let store: Store;

    const userSession = {
        session: {
            user: new AuthenticatedUser('authenticated-user', null, [new UserAuthority('UPDATE_USER')]),
            token: null,
            state: 'authenticated'
        }
    };

    const adminSession = {
        session: {
            user: new AuthenticatedUser('authenticated-admin-user', null, [new UserAuthority('ADMIN')]),
            token: null,
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
                UpdateUserGuard,
                AuthService,
                {provide: Router, useValue: router}
            ]
        }).compileComponents(); // compile template and css

        updateUserGuard = TestBed.inject(UpdateUserGuard);
        store = TestBed.inject(Store);
    });

    it('allow logged in users with UPDATE_USER authority to access route', () => {
        store.reset(userSession);
        updateUserGuard.canActivate().subscribe((result: boolean) => {
            expect(result).toBe(true);
        });
    });

    it('allow logged in users with ADMIN authority to access route', () => {
        store.reset(adminSession);
        updateUserGuard.canActivate().subscribe((result: boolean) => {
            expect(result).toBe(true);
        });
    });

    it('prevent unauthenticated users to access route', () => {
        store.reset(guestSession);
        updateUserGuard.canActivate().subscribe((result: boolean) => {
            expect(result).toBe(false);
        });
    });
});
