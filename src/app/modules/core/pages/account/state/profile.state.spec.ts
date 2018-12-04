import {AccountFormState} from './accountFormState';

describe('ProfileState', () => {

    it('formState() should return a proper value', () => {
        const form = {
            formState: {
                model: {
                    password: '123',
                    repeatPassword: '123',
                    securityTokenKey: '4321',
                },
                dirty: false,
                status: '',
                errors: {}
            }
        };

        const expected = form.formState;

        expect(AccountFormState.formState(form)).toBe(expected);
    });

    it('model() should return a proper value', () => {
        const form = {
            formState: {
                model: {
                    password: '123',
                    repeatPassword: '123',
                    securityTokenKey: '4321',
                },
                dirty: false,
                status: '',
                errors: {}
            }
        };

        const expected = form.formState.model;

        expect(AccountFormState.model(form)).toBe(expected);
    });

});
