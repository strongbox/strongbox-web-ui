import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Route, RouteListResponse, RouteOperations} from '../route.model';
import {map} from 'rxjs/operators';
import {plainToClass} from 'class-transformer';
import {ApiResponse} from '../../core/core.model';

@Injectable({
    providedIn: 'root'
})
export class RouteManagementService {

    baseUrl: string = '/api/configuration/strongbox/routing/rules';

    constructor(private http: HttpClient) {
    }

    getRoute(uuid: string): Observable<Route> {
        return this.http
            .get<Route>(this.baseUrl + `/${uuid}`)
            .pipe(map(r => plainToClass(Route, r)));
    }

    getRoutes(): Observable<Route[]> {
        return this.http
            .get<RouteListResponse>(this.baseUrl)
            .pipe(map((r: RouteListResponse) => plainToClass(Route, r.rules)));
    }

    updateRoute(route: Route, operation: RouteOperations = RouteOperations.CREATE): Observable<any> {
        let url: string = this.baseUrl;
        if (operation === RouteOperations.UPDATE) {
            url += `/update/${route.uuid}`;
        } else if (operation === RouteOperations.CREATE) {
            url += '/add';
        }

        return this.http
            .put(url, route)
            .pipe(map(r => plainToClass(ApiResponse, r)));
    }

    deleteRoute(route: Route): Observable<ApiResponse> {
        let header = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

        return this.http
            .delete(this.baseUrl + `/remove/${route.uuid}`, {headers: header})
            .pipe(map((r: any) => plainToClass(ApiResponse, r, {groups: ['error']}) as any));
    }

}
