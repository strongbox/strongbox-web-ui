import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';

import {ApiFormError} from '../../../modules/core/core.model';

/* tslint:disable:component-selector */
@Component({
    selector: 'form-field-errors',
    templateUrl: './form-field-errors.component.html',
    styleUrls: ['./form-field-errors.component.scss']
})
export class FormFieldErrorsComponent implements OnInit {

    @Input()
    field: FormGroup = null;

    constructor() {
    }

    getApiErrors() {
        if (this.field !== null) {
            if (this.field.errors && this.field.errors instanceof ApiFormError) {
                return this.field.errors.messages;
            }
        }

        return [];
    }

    getFormErrors() {
        if (this.field !== null) {
            if (this.field.errors && !(this.field.errors instanceof ApiFormError)) {
                let errors = [];

                Object.keys(this.field.errors).forEach((key) => {
                    const error = this.field.errors[key];
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
                        console.error(this.field.errors[key]);
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
