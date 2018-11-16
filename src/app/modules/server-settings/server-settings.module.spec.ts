import {ServerSettingsModule} from './server-settings.module';

describe('Module: ServerSettings', () => {
    let userManagementModule: ServerSettingsModule;

    beforeEach(() => {
        userManagementModule = new ServerSettingsModule();
    });

    it('should create an instance', () => {
        expect(userManagementModule).toBeTruthy();
    });
});
