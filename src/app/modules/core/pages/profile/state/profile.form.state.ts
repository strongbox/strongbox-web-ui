import {Selector, State} from '@ngxs/store';

export interface ProfileStateModel {
    formState: {
        model: {
            password: string;
            repeatPassword: string;
            securityTokenKey: string
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
                password: '',
                repeatPassword: '',
                securityTokenKey: null,
            },
            dirty: false,
            status: '',
            errors: {}
        }
    }
})
export class ProfileFormState {
    @Selector()
    static formState(state: ProfileStateModel) {
        return state.formState;
    }

    @Selector()
    static model(state: ProfileStateModel) {
        return state.formState.model;
    }
}
