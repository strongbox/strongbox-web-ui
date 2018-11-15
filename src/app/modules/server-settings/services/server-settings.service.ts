import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {plainToClass} from 'class-transformer';

import {ApiResponse} from '../../core/core.model';

@Injectable({
    providedIn: 'root'
})
export class ServerSettingsService {
    constructor(private client: HttpClient) {
    }

    getSettings(): Observable<any> {
        return this.client.get('/api/configuration/strongbox/serverSettings');
    }

    saveSettings(settings: any): Observable<any> {
        return this.client
            .post('/api/configuration/strongbox/serverSettings', settings)
            .pipe(
                map(r => plainToClass(ApiResponse, r, {groups: ['error']}))
            );
    }
}
