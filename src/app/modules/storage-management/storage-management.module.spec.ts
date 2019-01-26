import {StorageManagementModule} from './storage-management.module';

describe('Module: StorageManagementModule', () => {
    let module: StorageManagementModule;

    beforeEach(() => {
        module = new StorageManagementModule();
    });

    it('should create an instance', () => {
        expect(module).toBeTruthy();
    });
});
