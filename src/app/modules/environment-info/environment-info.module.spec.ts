import {EnvironmentInfoModule} from './environment-info.module';

describe('Module: EnvironmentInfoModule', () => {
    let module: EnvironmentInfoModule;

    beforeEach(() => {
        module = new EnvironmentInfoModule();
    });

    it('should create an instance', () => {
        expect(module).toBeTruthy();
    });
});
