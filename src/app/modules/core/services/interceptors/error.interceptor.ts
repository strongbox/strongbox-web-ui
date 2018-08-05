import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';
import {Store} from '@ngxs/store';
import {plainToClass} from 'class-transformer';

import {CredentialsExpiredAction, InvalidCredentialsAction} from '../../auth/state/auth.actions';
import {FormErrorAction} from '../../../../state/app.actions';
import {ApiResponse} from '../../core.model';

@Injectable({
    providedIn: 'root'
})
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private notify: ToastrService, private store: Store) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            catchError((response: any) => {
                if (this.is404Error(response)) {
                    let apiResponse: ApiResponse = plainToClass(ApiResponse, response.error, {groups: ['error']}) as any;
                    apiResponse.errorResponse = response;
                    return throwError(apiResponse);
                }

                if (this.isLoginError(response)) {
                    return this.handleLoginError(response);
                }

                if (this.isAuthError(response)) {
                    return this.handleAuthError(response);
                }

                if (this.isFormError(response)) {
                    return this.handleFormError(response);
                }

                return this.handleGenericError(request, response);
            })
        );
    }

    private is404Error(response: any): boolean {
        return response instanceof HttpErrorResponse && response.status === 404;
    }

    /**
     * If the response contains login errors
     *
     * @param response
     * @returns {boolean}
     */
    private isLoginError(response: any): boolean {
        // url can be null in some cases (i.e. forbidden OPTIONS request or super fatal error 500 with no content at all)
        if (response instanceof HttpErrorResponse && response.url !== null) {
            if (response.url.match(/\/login$/)) {
                return response.status === 401 || response.status === 403;
            }
        }

        return false;
    }

    /**
     * If the response contains authentication errors (expired/invalid token)
     *
     * @param response
     * @returns {boolean}
     */
    private isAuthError(response: any): boolean {
        // url can be null in some cases (i.e. forbidden OPTIONS request or super fatal error 500 with no content at all)
        if (response instanceof HttpErrorResponse && response.url !== null) {
            const blacklisted = [/\/login$/];

            // Check for blacklisted urls.
            if (blacklisted.filter(regex => response.url.match(regex)).length === 0) {
                return response.status === 401 || response.status === 403;
            }
        }

        return false;
    }

    private isFormError(response: any): boolean {
        return response instanceof HttpErrorResponse && response.status === 400 && response.error.hasOwnProperty('errors');
    }

    /**
     * Handle login errors
     *
     * @param {HttpErrorResponse} response
     * @returns {Observable<any>}
     */
    private handleLoginError(response: HttpErrorResponse): Observable<any> {
        this.store.dispatch(new InvalidCredentialsAction());
        return of(null);
    }

    /**
     * Handle authentication errors (i.e. existing token has expired or is no longer valid)
     *
     * @param {HttpErrorResponse} response
     * @returns {Observable<any>}
     */
    private handleAuthError(response: HttpErrorResponse): Observable<any> {
        const data = {
            sessionHasExpired: false,
            sessionIsInvalid: false
        };

        // Catch 401 and 403 errors/exceptions
        if (response.status === 401 || response.error.error === 'expired') {
            data.sessionHasExpired = true;
            this.store.dispatch(new CredentialsExpiredAction(data));
        } else if (response.status === 403) {
            data.sessionIsInvalid = true;
            this.store.dispatch(new InvalidCredentialsAction(data));
        } else {
            console.error(response);
            throw new Error('handleAuthError cannot handle the received response!');
        }

        return of(null);
    }

    private handleFormError(response: HttpErrorResponse): Observable<any> {
        let apiResponse: ApiResponse = plainToClass(ApiResponse, response.error, {groups: ['error']}) as any;
        apiResponse.errorResponse = response;
        this.store.dispatch(new FormErrorAction(apiResponse));
        return of(null);
    }

    /**
     * Try to handle the error in some sane way, if possible.
     *
     * @param {HttpRequest<any>} request
     * @param response
     * @returns {Observable<any>}
     */
    private handleGenericError(request: HttpRequest<any>, response: any): Observable<any> {
        if (response instanceof HttpErrorResponse) {
            // response.url can be null in some cases (i.e. forbidden OPTIONS request or super fatal error 500 with no content at all)
            // this is why we use request.url instead as it will always have the proper url to the endpoint we're requesting.
            let url = this.getURI(request);

            // same goes for response.error which could be string | ProgressEvent.
            // response.error (angular) != response.error.error (backend)
            let error = '';
            if (response.hasOwnProperty('error')
                && response.error != null
                && response.error.hasOwnProperty('error')
            ) {
                error = response.error.error;
            } else if (!(response.error instanceof ProgressEvent)) {
                error = response.error;
            } else {
                error = response.message;
            }

            this.notify.error(error, 'Failed to complete request ' + url);
        }

        return of(response);
    }

    private getURI(request: HttpRequest<any>): string {
        return request.url.substr(request.url.indexOf('/api'));
    }
}
