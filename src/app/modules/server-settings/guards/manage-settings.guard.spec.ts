import {TestBed} from '@angular/core/testing';
import {Router} from '@angular/router';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {NgxsModule, Store} from '@ngxs/store';

import {defaultSessionState, SessionState} from '../../core/auth/state/session.state';
import {AuthService} from '../../core/auth/auth.service';
import {AuthenticatedUser, UserAuthority} from '../../core/auth/auth.model';
import {ManageSettingsGuard} from './manage-settings.guard';


describe('Guard: ManageSettings should', () => {
    let createUserGuard: ManageSettingsGuard;
    let store: Store;

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
                ManageSettingsGuard,
                AuthService,
                {provide: Router, useValue: router}
            ]
        }).compileComponents(); // compile template and css

        createUserGuard = TestBed.get(ManageSettingsGuard);
        store = TestBed.get(Store);
    });

    it('allow logged in users with ADMIN authority to access route', () => {
        store.reset(adminSession);
        createUserGuard.canActivate().subscribe((result) => {
            expect(result).toBe(true);
        });
    });

    it('prevent unauthenticated users to access route', () => {
        store.reset(guestSession);
        createUserGuard.canActivate().subscribe((result) => {
            expect(result).toBe(false);
        });
    });
});
