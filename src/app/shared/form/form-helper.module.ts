import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {MaterialModule} from '../material.module';
import {FormFieldErrorsComponent} from './form-field-errors/form-field-errors.component';
import {AqlAutocompleteComponent} from './autocomplete/aql-autocomplete/aql-autocomplete.component';
import {SelectAutocompleteComponent} from './autocomplete/select-autocomplete/select-autocomplete.component';
import {FormDataService} from './services/form-data.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule
    ],
    exports: [
        FormFieldErrorsComponent,
        AqlAutocompleteComponent,
        SelectAutocompleteComponent
    ],
    declarations: [
        FormFieldErrorsComponent,
        SelectAutocompleteComponent,
        AqlAutocompleteComponent
    ],
    providers: [
        FormDataService
    ]
})
export class FormHelperModule {
}
