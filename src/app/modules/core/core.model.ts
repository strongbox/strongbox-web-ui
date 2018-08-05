import {of} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';
import {Exclude, Expose, plainToClass, Type} from 'class-transformer';
import {FormGroup, ValidationErrors} from '@angular/forms';

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

    errorsToForm(path: string, form: FormGroup) {
        if (this.errors && this.errors.length > 0) {
            this.errors.forEach((error: ApiFormError, index) => {
                let field = form.get(error.name);
                field.setErrors(error);
            });
        }
    }
}

export class ApiFormError implements ValidationErrors {
    name: string;
    messages: string[] = [];
}

/* Possibly obsolete */
export function catchApiError(error: any) {
    const isHttpErrorResponse = (error instanceof HttpErrorResponse);
    const response = error;

    if (isHttpErrorResponse && response.status === 400 && response.error.hasOwnProperty('errors')) {
        let apiResponse: ApiResponse = plainToClass(ApiResponse, response.error, {groups: ['error']}) as any;
        apiResponse.errorResponse = response;

        return of(apiResponse);
    }

    return of(error);
}
