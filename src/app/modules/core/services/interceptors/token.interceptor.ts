import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TokenInterceptor implements HttpInterceptor {

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const session: any = localStorage.getItem('session');
        let nextRequest = request;
        if (session !== null) {
            try {
                const token = JSON.parse(session).token;
                if (token) {
                    nextRequest = request.clone({
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

        return next.handle(nextRequest);
    }

}
