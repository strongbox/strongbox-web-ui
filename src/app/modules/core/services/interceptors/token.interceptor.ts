import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Store} from '@ngxs/store';
import {catchError} from 'rxjs/operators';
import {Observable, of, throwError} from 'rxjs';

import {CredentialsExpiredAction, InvalidCredentialsAction} from '../../auth/auth.actions';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    constructor(private store: Store) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const session: any = localStorage.getItem('session');
        if (session && session !== null) {
            try {
                const token = JSON.parse(session).token;
                if (token) {
                    request = request.clone({
                        setHeaders: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                }
            } catch (e) {
                // just remove the invalid session from LocalStorage and do nothing else.
                localStorage.removeItem('session');
            }
        }

        return next.handle(request).pipe(catchError((errorResponse) => this.handleError(errorResponse)));
    }


    private handleError(errorResponse: HttpErrorResponse): Observable<any> {
        let errorMessage;

        if (errorResponse.error instanceof Error) {
            // A client-side or network error occurred.
            errorMessage = `An error occurred: ${errorResponse.error.message}`;
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            errorMessage = `Backend returned code ${errorResponse.status}, body was: ${errorResponse.error}`;
        }

        // url can be null in some cases (i.e. forbidden OPTIONS request)
        if (errorResponse.url !== null && !errorResponse.url.match(/\/login$/)) {

            if (errorResponse.url.match(/\/login$/)) {
                return of(null);
            } else {
                // Catch 401 and 403 errors/exceptions
                if (errorResponse.status === 401 || errorResponse.status === 403) {

                    const data = {
                        sessionHasExpired: false,
                        sessionIsInvalid: false
                    };

                    if (errorResponse.error.hasOwnProperty('error') && errorResponse.error.error === 'expired') {
                        data.sessionHasExpired = true;
                        this.store.dispatch(new CredentialsExpiredAction(data));
                    } else {
                        data.sessionIsInvalid = true;
                        this.store.dispatch(new InvalidCredentialsAction(data));
                    }

                    return of(null);
                } else {
                    return throwError(errorResponse);
                }
            }

        } else {
            console.log(errorMessage);
            return throwError(errorResponse);
        }
    }

}
