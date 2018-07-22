import {TestBed} from '@angular/core/testing';
import {Router} from '@angular/router';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {NgxsModule, Store} from '@ngxs/store';

import {defaultSessionState, SessionState} from '../../core/auth/session.state';
import {AuthService} from '../../core/auth/auth.service';
import {AuthenticatedUser, UserAuthority} from '../../core/auth/auth.model';
import {CreateUserGuard} from './create-user.guard';


describe('CreateUserGuard should', () => {
    let createUserGuard: CreateUserGuard;
    let store: Store;

    const userSession = {
        session: {
            user: new AuthenticatedUser('authenticated-user', null, [new UserAuthority('CREATE_USER')]),
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
                CreateUserGuard,
                AuthService,
                {provide: Router, useValue: router}
            ]
        }).compileComponents(); // compile template and css

        createUserGuard = TestBed.get(CreateUserGuard);
        store = TestBed.get(Store);
    });

    it('allow logged in users with CREATE_USER authority to access route', () => {
        store.reset(userSession);
        createUserGuard.canActivate().subscribe((result) => {
            expect(result).toBe(true);
        });
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
