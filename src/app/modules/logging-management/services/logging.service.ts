import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Logger, Loggers} from '../logging.model';
import {map} from 'rxjs/operators';
import {plainToClass} from 'class-transformer';
import {ApiResponse} from '../../core/core.model';
import {Repository} from '../../storage-management/repository.model';

@Injectable({
    providedIn: 'root'
})
export class LoggingService {

    constructor(private http: HttpClient) {
    }

    getLoggers(): Observable<Loggers> {
        return this.http
            .get(`/api/monitoring/loggers`)
            .pipe(map((r: any) => plainToClass(Loggers, r) as any));
    }

    // TODO implement me
    updateLogger(logger: Logger): Observable<ApiResponse> {
        return this.http
            .post(`/api/monitoring/loggers`, logger)
            .pipe(map((r: any) => plainToClass(ApiResponse, r, {groups: ['error']}) as any));
    }

    // TODO implement me
    downloadLog(path: string): Observable<Repository> {
        return this.http
            .get(`/api/monitoring/loggers`)
            .pipe(map((r: any) => plainToClass(Repository, r) as any));
    }

}
