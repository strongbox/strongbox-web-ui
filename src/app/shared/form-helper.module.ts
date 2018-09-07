import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {MaterialModule} from './material.module';
import {FormFieldErrorsComponent} from './form/form-field-errors/form-field-errors.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule
    ],
    exports: [
        FormFieldErrorsComponent
    ],
    declarations: [
        FormFieldErrorsComponent
    ]
})
export class FormHelperModule {
}
