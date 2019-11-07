import {HttpErrorResponse} from '@angular/common/http';
import {AbstractControl, FormGroup, ValidationErrors} from '@angular/forms';
import {Navigate} from '@ngxs/router-plugin';
import {Store} from '@ngxs/store';
import {Exclude, Expose, Type} from 'class-transformer';
import {ToastrService} from 'ngx-toastr';
import {of, Subject, throwError} from 'rxjs';

@Exclude()
export class ApiResponse {
    @Expose({groups: ['error']})
    message?: string;

    @Expose({groups: ['error']})
    @Type(() => ApiFormError)
    errors?: ApiFormError[];

    @Expose({groups: ['error']})
    errorResponse?: HttpErrorResponse;

    isValid() {
        return typeof this.errorResponse === 'undefined' || this.errorResponse === null;
    }

    errorsToForm(form: AbstractControl) {
        if (this.errors && this.errors.length > 0) {
            this.errors.forEach((error: ApiFormError, index) => {
                let field: AbstractControl = form;
                let fieldPath = error.name.split('.').filter(s => s.trim() !== '');

                // This is necessary for processing embedded/children forms.
                if (fieldPath.length > 1) {
                    fieldPath.forEach((f) => {
                        field = field.get(f);
                    });
                } else {
                    field = form.get(error.name);
                }

                field.setErrors(error);
                field.markAsDirty();
            });

            form.updateValueAndValidity();
        }
    }
}

export class ApiFormDataValuesResponse extends ApiResponse {
    @Type(() => FormDataValue)
    formDataValues: FormDataValue[];
}

export class FormDataValue {
    name: string;
    values: any[];
}

export class ApiFormError implements ValidationErrors {
    name: string;
    messages: string[] = [];
}

export enum GenericMessages {
    SAVE_SUCCESSFUL = 'Changes have been successfully saved!',
    SAVE_FAILED     = 'Failed to save changes!'
}

export function handleFormError(error: ApiResponse, form: AbstractControl, loading: Subject<any> = null, notify: ToastrService = null) {
    if (!(error instanceof ApiResponse)) {
        return throwError(error);
    }

    if (notify) {
        notify.error(error.message);
    }

    if (loading) {
        loading.next(false);
    }

    error.errorsToForm(form);

    return of(error);
}

export function handle404error(error: ApiResponse, redirect, notify: ToastrService, store: Store) {
    if (error.errorResponse.status === 404) {
        notify.error(error.message);
        store.dispatch(new Navigate(redirect));
    }
}
