import {AbstractControl, ValidatorFn} from '@angular/forms';

export class FormValidators {
    static minOption(minimum): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            return control.value.length < minimum ? {'minCollection': 'Please select at least one option'} : null;
        };
    }
}
