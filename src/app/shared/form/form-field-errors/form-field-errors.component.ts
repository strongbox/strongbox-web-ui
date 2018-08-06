import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';

import {ApiFormError} from '../../../modules/core/core.model';

/* tslint:disable:component-selector */
@Component({
    selector: 'form-field-errors',
    templateUrl: './form-field-errors.component.html',
    styleUrls: ['./form-field-errors.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormFieldErrorsComponent implements OnInit {

    @Input()
    form: FormGroup = null;

    @Input()
    name: string = null;

    constructor() {
    }

    getApiErrors() {
        if (this.form !== null && this.form.get(this.name)) {
            const field = this.form.get(this.name);
            if (field.errors && field.errors instanceof ApiFormError) {
                return field.errors.messages;
            }
        }

        return [];
    }

    getFormErrors() {
        if (this.form !== null && this.form.get(this.name)) {
            const field = this.form.get(this.name);
            if (field.errors && !(field.errors instanceof ApiFormError)) {
                let errors = [];

                Object.keys(field.errors).forEach((key) => {
                    const error = field.errors[key];
                    if (key === 'required') {
                        errors.push('This field is required!');
                        return;
                    } else if (key === 'minlength') {
                        errors.push('This field requires more than ' + error.requiredLength + ' characters');
                        return;
                    } else if (key === 'maxlength') {
                        errors.push('This field requires less than ' + error.requiredLength + ' characters');
                        return;
                    } else {
                        console.error(field.errors[key]);
                    }
                });

                return errors;
            }
        }

        return [];
    }

    ngOnInit() {
    }

}
