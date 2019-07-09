import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {plainToClass} from 'class-transformer';

import {Route, RouteListResponse, RouteOperations} from '../route.model';
import {ApiResponse} from '../../core/core.model';

@Injectable({
    providedIn: 'root'
})
export class RouteManagementService {

    baseUrl = '/api/configuration/strongbox/routing/rules';

    constructor(private http: HttpClient) {
    }

    getRoute(uuid: string): Observable<Route> {
        return this.http
            .get<Route>(`${this.baseUrl}/${uuid}`)
            .pipe(map(r => plainToClass(Route, r)));
    }

    getRoutes(): Observable<Route[]> {
        return this.http
            .get<RouteListResponse>(this.baseUrl)
            .pipe(map((r: RouteListResponse) => plainToClass(Route, r.rules)));
    }

    saveRoute(route: Route, operation: RouteOperations = RouteOperations.CREATE): Observable<any> {
        let url = `${this.baseUrl}`;

        if (operation === RouteOperations.UPDATE) {
            url += `/${route.uuid}`;
        }

        return this.http
            .put(url, route)
            .pipe(map(r => plainToClass(ApiResponse, r)));
    }

    deleteRoute(route: Route): Observable<ApiResponse> {
        return this.http
            .delete(`${this.baseUrl}/${route.uuid}`)
            .pipe(map((r: any) => plainToClass(ApiResponse, r, {groups: ['error']}) as any));
    }

}
