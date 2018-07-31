import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';
import {Store} from '@ngxs/store';

import {CredentialsExpiredAction, InvalidCredentialsAction} from '../../auth/state/auth.actions';

@Injectable({
    providedIn: 'root'
})
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private notify: ToastrService, private store: Store) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            catchError((response: any) => {
                if (this.isAuthError(response)) {
                    return this.handleAuthError(response);
                }

                return this.handleGenericError(request, response);
            })
        );
    }

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
