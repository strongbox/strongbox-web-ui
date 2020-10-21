import {AbstractAuthorityGuard} from './abstract-authority-guard';
import {async, TestBed} from '@angular/core/testing';
import {NgxsModule, Store} from '@ngxs/store';
import {HttpClientTestingModule} from '@angular/common/http/testing';

import {defaultSessionState, SessionState, SessionStateModel} from '../auth/state/session.state';
import {AuthenticatedUser, UserAuthority} from '../auth/auth.model';
import {AuthService} from '../auth/auth.service';
import {SetSessionStateModelAction} from '../auth/state/auth.actions';

describe('Guard: Abstract Authority Guard', () => {

    let store: Store;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                NgxsModule.forRoot([SessionState]),
            ],
            providers: [
                AuthService,
                TestGuard,
                TestAllAuthoritiesGuard,
                TestAnyAuthoritiesGuard,
                TestCombineAuthoritiesGuard,
                TestHighAuthorityGuard
            ]
        }).compileComponents();

        store = TestBed.inject(Store);
        store.reset(defaultSessionState);
    }));

    it('should allow admin authority', () => {
        store.dispatch(new SetSessionStateModelAction(<SessionStateModel> {
            user: new AuthenticatedUser('admin', 'token', [new UserAuthority('ADMIN')]),
            token: null,
            state: 'authenticated'
        }));

        TestBed.inject(TestGuard).canActivate().subscribe((result: boolean) => {
            expect<boolean>(result).toBe(true);
        });
    });

    it('should prevent access when the any/all collections are empty and there is no admin authority.', () => {
        store.dispatch(new SetSessionStateModelAction(<SessionStateModel> {
            user: new AuthenticatedUser('user', 'token', [new UserAuthority('FAKE')]),
            token: null,
            state: 'authenticated'
        }));

        TestBed.inject(TestGuard).canActivate().subscribe((result: boolean) => {
            expect<boolean>(result).toBe(false);
        });
    });

    it('prevent users with low authority to access route', () => {
        store.dispatch(new SetSessionStateModelAction(<SessionStateModel> {
            user: new AuthenticatedUser('test', 'token', [
                new UserAuthority('LOW_AUTHORITY')
            ]),
            token: null,
            state: 'authenticated'
        }));

        TestBed.inject(TestGuard).canActivate().subscribe((result: boolean) => {
            expect<boolean>(result).toBe(false);
        });
    });


    it('should allow access when the user has ALL requested authorities', () => {
        store.dispatch(new SetSessionStateModelAction(<SessionStateModel> {
            user: new AuthenticatedUser('test', 'token', [
                new UserAuthority('SOME_ROLE'), new UserAuthority('ANOTHER_ROLE')
            ]),
            token: null,
            state: 'authenticated'
        }));

        TestBed.inject(TestAllAuthoritiesGuard).canActivate().subscribe((result: boolean) => {
            expect<boolean>(result).toBe(true);
        });
    });

    it('should NOT allow access when the user doesn\'t have ALL requested authorities', () => {
        store.dispatch(new SetSessionStateModelAction(<SessionStateModel> {
            user: new AuthenticatedUser('test', 'token', [
                new UserAuthority('ANOTHER_ROLE')
            ]),
            token: null,
            state: 'authenticated'
        }));

        TestBed.inject(TestAllAuthoritiesGuard).canActivate().subscribe((result: boolean) => {
            expect<boolean>(result).toBe(false);
        });
    });

    it('should allow access when user has ANY requested authorities', () => {
        store.dispatch(new SetSessionStateModelAction(<SessionStateModel> {
            user: new AuthenticatedUser('test', 'token', [
                new UserAuthority('FIRST_ROLE'), new UserAuthority('SECOND_ROLE'), new UserAuthority('THIRD_ROLE')
            ]),
            token: null,
            state: 'authenticated'
        }));

        TestBed.inject(TestAnyAuthoritiesGuard).canActivate().subscribe((result: boolean) => {
            expect<boolean>(result).toBe(true);
        });
    });

    it('should NOT allow access when user has NONE of the requested ANY authorities', () => {
        store.dispatch(new SetSessionStateModelAction(<SessionStateModel> {
            user: new AuthenticatedUser('test', 'token', [
                new UserAuthority('FIRST_ROLE-1'), new UserAuthority('SECOND_ROLE-2'), new UserAuthority('THIRD_ROLE-3')
            ]),
            token: null,
            state: 'authenticated'
        }));

        TestBed.inject(TestAnyAuthoritiesGuard).canActivate().subscribe((result: boolean) => {
            expect<boolean>(result).toBe(false);
        });
    });

    it('should allow access when user has ALL and ANY requested authorities (combination)', () => {
        store.dispatch(new SetSessionStateModelAction(<SessionStateModel> {
            user: new AuthenticatedUser('test', 'token', [
                new UserAuthority('SOME_ROLE'), new UserAuthority('ANOTHER_ROLE'),
                new UserAuthority('FIRST_ROLE'), new UserAuthority('SECOND_ROLE'), new UserAuthority('THIRD_ROLE')
            ]),
            token: null,
            state: 'authenticated'
        }));

        TestBed.inject(TestCombineAuthoritiesGuard).canActivate().subscribe((result: boolean) => {
            expect<boolean>(result).toBe(true);
        });
    });

    it('should NOT allow access when user doesn\'t have ANY requested authorities (combination)', () => {
        store.dispatch(new SetSessionStateModelAction(<SessionStateModel> {
            user: new AuthenticatedUser('test', 'token', [
                new UserAuthority('SOME_ROLE'), new UserAuthority('ANOTHER_ROLE'),
                new UserAuthority('FIRST_ROLE-1'), new UserAuthority('SECOND_ROLE-2'), new UserAuthority('THIRD_ROLE-3')
            ]),
            token: null,
            state: 'authenticated'
        }));

        TestBed.inject(TestCombineAuthoritiesGuard).canActivate().subscribe((result: boolean) => {
            expect<boolean>(result).toBe(false);
        });
    });
});


class TestGuard extends AbstractAuthorityGuard {
}

class TestAllAuthoritiesGuard extends AbstractAuthorityGuard {
    allAuthoritiesCollection() {
        return ['SOME_ROLE', 'ANOTHER_ROLE'];
    }
}

class TestAnyAuthoritiesGuard extends AbstractAuthorityGuard {
    allAuthoritiesCollection() {
        return ['FIRST_ROLE', 'THIRD_ROLE'];
    }
}

class TestCombineAuthoritiesGuard extends AbstractAuthorityGuard {
    allAuthoritiesCollection() {
        return ['SOME_ROLE', 'ANOTHER_ROLE'];
    }

    anyAuthoritiesCollection() {
        return ['FIRST_ROLE', 'THIRD_ROLE'];
    }
}

class TestHighAuthorityGuard extends AbstractAuthorityGuard {
    allAuthoritiesCollection() {
        return ['REQUIRES_HIGH_AUTHORITY'];
    }
}

