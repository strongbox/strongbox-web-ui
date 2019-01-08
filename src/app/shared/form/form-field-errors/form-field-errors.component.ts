import {Component, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';

import {ApiFormError} from '../../../modules/core/core.model';

/* tslint:disable:component-selector */
@Component({
    selector: 'form-field-errors',
    templateUrl: './form-field-errors.component.html',
    styleUrls: ['./form-field-errors.component.scss']
})
export class FormFieldErrorsComponent {

    @Input()
    field: FormGroup = null;

    constructor() {
    }

    isFieldSet() {
        return this.field instanceof FormGroup;
    }

    getApiErrors() {
        if (this.isFieldSet()) {
            if (this.field.invalid && this.field.errors instanceof ApiFormError) {
                return this.field.errors.messages;
            }
        }

        return [];
    }

    getFormErrors() {
        if (this.isFieldSet()) {
            if (this.field.invalid && !(this.field.errors instanceof ApiFormError)) {
                let errors = [];

                Object.keys(this.field.errors).forEach((key) => {
                    const error = this.field.errors[key];
                    if (key === 'required') {
                        errors.push('This field is required!');
                    } else if (key === 'minlength') {
                        errors.push('This field requires more than ' + error.requiredLength + ' characters');
                    } else if (key === 'maxlength') {
                        errors.push('This field requires less than ' + error.requiredLength + ' characters');
                    } else if (key === 'pattern') {
                        errors.push('This field requires the following pattern ' + error.requiredPattern + ' but got ' + error.actualValue);
                    } else {
                        errors.push(this.field.errors[key]);
                    }
                });

                return errors;
            }
        }

        return [];
    }

}
