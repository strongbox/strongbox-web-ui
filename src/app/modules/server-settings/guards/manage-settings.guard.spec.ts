import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {NgxsModule, Store} from '@ngxs/store';

import {defaultSessionState, SessionState} from '../../core/auth/state/session.state';
import {AuthService} from '../../core/auth/auth.service';
import {AuthenticatedUser, UserAuthority} from '../../core/auth/auth.model';
import {ManageSettingsGuard} from './manage-settings.guard';


describe('Guard: ManageSettings should', () => {
    let guard: ManageSettingsGuard;
    let store: Store;

    const adminSession = {
        session: {
            user: new AuthenticatedUser('authenticated-admin-user', null, [new UserAuthority('ADMIN')]),
            token: null,
            state: 'authenticated'
        }
    };

    const lowPrivileges = {
        session: {
            user: new AuthenticatedUser('authenticated-user', null, [new UserAuthority('SOME_PRIV')]),
            token: null,
            state: 'authenticated'
        }
    };

    const guestSession = {
        session: defaultSessionState
    };

    // async beforeEach
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                NgxsModule.forRoot([SessionState]),
            ],
            providers: [
                ManageSettingsGuard,
                AuthService
            ]
        }).compileComponents(); // compile template and css

        guard = TestBed.inject(ManageSettingsGuard);
        store = TestBed.inject(Store);
    });

    it('allow logged in users with ADMIN authority to access route', () => {
        store.reset(adminSession);
        guard.canActivate().subscribe((result: boolean) => {
            expect(result).toBe(true);
        });
    });

    it('prevent users with low authority to access route', () => {
        store.reset(lowPrivileges);
        guard.canActivate().subscribe((result: boolean) => {
            expect(result).toBe(false);
        });
    });

    it('prevent unauthenticated users to access route', () => {
        store.reset(guestSession);
        guard.canActivate().subscribe((result: boolean) => {
            expect(result).toBe(false);
        });
    });
});
