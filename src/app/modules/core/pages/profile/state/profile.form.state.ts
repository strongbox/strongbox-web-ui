import {State} from '@ngxs/store';

export interface ProfileStateModel {
    formState: {
        model: {
            password?: string;
            repeatPassword?: string;
            securityTokenKey?: string
        },
        dirty?: boolean,
        status?: string,
        errors?: any
    };
}

@State<ProfileStateModel>({
    name: 'profile',
    defaults: {
        formState: {
            model: {
                password: null,
                repeatPassword: null,
                securityTokenKey: null,
            },
            dirty: false,
            status: '',
            errors: {}
        }
    }
})
export class ProfileFormState {
}
