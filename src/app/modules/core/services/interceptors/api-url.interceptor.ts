import {Inject, Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {DOCUMENT} from '@angular/common';
import {Observable} from 'rxjs';

import {environment} from '../../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApiURLInterceptor implements HttpInterceptor {
    constructor(@Inject(DOCUMENT) private document) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (environment.strongboxUrl != null) {
            let url = environment.strongboxUrl + '/' + request.url.replace(/^\//, '');

            if (!environment.strongboxUrl.match(/^http(s)?/i)) {
                const protocol = document.location.protocol.startsWith('http') ? 'http' : 'https';
                url = protocol + '://' + environment.strongboxUrl + '/' + request.url.replace(/^\//, '');
            }

            request = request.clone({url: url, withCredentials: true});
        }

        return next.handle(request);
    }
}
