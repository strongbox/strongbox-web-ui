import {TestBed} from '@angular/core/testing';
import {Router} from '@angular/router';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {NgxsModule, Store} from '@ngxs/store';

import {ViewUserGuard} from './view-user.guard';
import {defaultSessionState, SessionState} from '../../core/auth/state/session.state';
import {AuthService} from '../../core/auth/auth.service';
import {AuthenticatedUser, UserAuthority} from '../../core/auth/auth.model';


describe('Guard: ViewUser should', () => {
    let viewUserGuard: ViewUserGuard;
    let store: Store;

    const userSession = {
        session: {
            user: new AuthenticatedUser('authenticated-user', null, [new UserAuthority('VIEW_USER')]),
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
                ViewUserGuard,
                AuthService,
                {provide: Router, useValue: router}
            ]
        }).compileComponents(); // compile template and css

        viewUserGuard = TestBed.get(ViewUserGuard);
        store = TestBed.get(Store);
    });

    it('allow logged in users with VIEW_USER authority to access route', () => {
        store.reset(userSession);
        viewUserGuard.canActivate().subscribe((result: boolean) => {
            expect(result).toBe(true);
        });
    });

    it('allow logged in users with ADMIN authority to access route', () => {
        store.reset(adminSession);
        viewUserGuard.canActivate().subscribe((result: boolean) => {
            expect(result).toBe(true);
        });
    });

    it('prevent unauthenticated users to access route', () => {
        store.reset(guestSession);
        viewUserGuard.canActivate().subscribe((result: boolean) => {
            expect(result).toBe(false);
        });
    });
});
