import {RouteManagementModule} from './route-management.module';

describe('Module: UserManagementModule', () => {
    let userManagementModule: RouteManagementModule;

    beforeEach(() => {
        userManagementModule = new RouteManagementModule();
    });

    it('should create an instance', () => {
        expect(userManagementModule).toBeTruthy();
    });
});
