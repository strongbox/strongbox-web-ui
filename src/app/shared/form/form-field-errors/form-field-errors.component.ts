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
    form: FormGroup = null;

    @Input()
    name: string = null;

    constructor() {
    }

    getErrors() {
        if (this.form !== null && this.form.get(this.name)) {
            const field = this.form.get(this.name);
            if (field.errors && field.errors instanceof ApiFormError) {
                return field.errors.messages;
            }
        }

        return [];
    }

    ngOnInit() {
    }

}
