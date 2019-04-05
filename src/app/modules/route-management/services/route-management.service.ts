import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Route, RouteListResponse} from '../route.model';
import {map} from 'rxjs/operators';
import {plainToClass} from 'class-transformer';

@Injectable({
    providedIn: 'root'
})
export class RouteManagementService {

    constructor(private http: HttpClient) {
    }

    getRoutes(): Observable<Route[]> {
        return this.http
            .get<RouteListResponse>('/api/configuration/strongbox/routing/rules')
            .pipe(map((r: RouteListResponse) => plainToClass(Route, r.routingRule)));
    }
}