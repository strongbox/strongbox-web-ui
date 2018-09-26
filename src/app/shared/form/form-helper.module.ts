import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {MaterialModule} from '../material.module';
import {FormFieldErrorsComponent} from './form-field-errors/form-field-errors.component';
import {SearchAutocompleteComponent} from './search-autocomplete/search-autocomplete.component';
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
        SearchAutocompleteComponent
    ],
    declarations: [
        FormFieldErrorsComponent,
        SearchAutocompleteComponent
    ],
    providers: [
        FormDataService
    ]
})
export class FormHelperModule {
}
