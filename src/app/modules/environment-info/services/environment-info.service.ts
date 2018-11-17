import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class EnvironmentInfoService {
    constructor(private client: HttpClient) {
    }

    getInfo(): Observable<any> {
        return this.client.get('/api/configuration/environment/info');
    }
}
