import {Component, Input, Optional, Self} from '@angular/core';
import {ControlValueAccessor, FormGroup, NgControl} from '@angular/forms';

import {ApiFormError} from '../../../modules/core/core.model';

/* tslint:disable:component-selector */
@Component({
    selector: 'form-field-errors',
    templateUrl: './form-field-errors.component.html',
    styleUrls: ['./form-field-errors.component.scss']
})
export class FormFieldErrorsComponent implements ControlValueAccessor {

    @Input()
    field: FormGroup = null;

    // tslint:disable:semicolon
    onChange = (_: any) => {
    };

    onTouched = () => {
    };

    // tslint:enable:semicolon

    constructor(@Optional() @Self() public ngControl: NgControl) {
        // Setting the value accessor directly (instead of using
        // the providers) to avoid running into a circular import.
        if (this.ngControl != null) {
            this.ngControl.valueAccessor = this;
        }
    }

    getApiErrors() {
        const field = this.field === null ? this.ngControl : this.field;
        if (field !== null) {
            if (field.errors && field.errors instanceof ApiFormError) {
                return field.errors.messages;
            }
        }

        return [];
    }

    getFormErrors() {
        const field = this.field === null ? this.ngControl : this.field;
        if (field !== null) {
            if (field.errors && !(field.errors instanceof ApiFormError)) {
                let errors = [];

                Object.keys(field.errors).forEach((key) => {
                    const error = field.errors[key];
                    if (key === 'required') {
                        errors.push('This field is required!');
                    } else if (key === 'minlength') {
                        errors.push('This field requires more than ' + error.requiredLength + ' characters');
                    } else if (key === 'maxlength') {
                        errors.push('This field requires less than ' + error.requiredLength + ' characters');
                    } else if (key === 'pattern') {
                        errors.push('This field requires the following pattern ' + error.requiredPattern + ' but got ' + error.actualValue);
                    } else {
                        errors.push(field.errors[key]);
                    }
                });

                return errors;
            }
        }

        return [];
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
    }

    writeValue(obj: any): void {
    }

}
