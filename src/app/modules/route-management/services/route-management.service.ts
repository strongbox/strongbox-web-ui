import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Route, RouteListResponse} from '../route.model';
import {map} from 'rxjs/operators';
import {plainToClass} from 'class-transformer';
import { ApiResponse } from '../../core/core.model';

@Injectable({
    providedIn: 'root'
})
export class RouteManagementService {

    url: string = '/api/configuration/strongbox/routing/rules';

    constructor(private http: HttpClient) {
    }

    getRoutes(): Observable<Route[]> {
        return this.http
            .get<RouteListResponse>(this.url)
            .pipe(map((r: RouteListResponse) => plainToClass(Route, r.routingRule)));
    }

    deleteRoute(route: Route): Observable<ApiResponse> {
        let header = new HttpHeaders().set("Content-Type",'application/json')
        return this.http.delete(this.url+`/remove/${route.uuid}`,{headers:header})
        .pipe(map((r: any) => plainToClass(ApiResponse, r, {groups: ['error']}) as any))
    }

}