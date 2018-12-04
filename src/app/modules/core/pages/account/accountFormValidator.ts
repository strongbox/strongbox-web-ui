import {FormGroup} from '@angular/forms';

export class AccountFormValidator {
    static validate(form: FormGroup) {
        const passwordField = form.get('password');
        const repeatPasswordField = form.get('repeatPassword');
        const password = passwordField.value;
        const repeatPassword = repeatPasswordField.value;

        let errors: any = {};

        if (repeatPassword !== password) {
            errors['passwordMismatch'] = true;
        }

        if (password.length < 8 && password.length > 0) {
            errors['passwordLength'] = true;
        }

        if (errors.passwordMismatch || errors.passwordLength) {
            passwordField.setErrors(errors);
            repeatPasswordField.setErrors(errors);
            return errors;
        }

        passwordField.setErrors(null);
        repeatPasswordField.setErrors(null);

        return null;
    }
}

