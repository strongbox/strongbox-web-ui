import {FormHelperModule} from './form-helper.module';

describe('Module: FormHelperModule', () => {
    let module: FormHelperModule;

    beforeEach(() => {
        module = new FormHelperModule();
    });

    it('should create an instance', () => {
        expect(module).toBeTruthy();
    });
});
