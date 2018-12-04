import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {EnvironmentInfo} from '../environment-info.model';

@Injectable({
    providedIn: 'root'
})
export class EnvironmentInfoService {
    constructor(private client: HttpClient) {
    }

    getInfo(): Observable<any> {
        return this.client.get<EnvironmentInfo>('/api/configuration/environment/info');
    }
}
