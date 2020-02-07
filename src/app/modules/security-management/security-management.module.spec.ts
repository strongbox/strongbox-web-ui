import {SecurityManagementModule} from './security-management.module';

describe('Module: SecurityManagementModule', () => {
    let securityManagementModule: SecurityManagementModule;

    beforeEach(() => {
        securityManagementModule = new SecurityManagementModule();
    });

    it('should create an instance', () => {
        expect(securityManagementModule).toBeTruthy();
    });
});
