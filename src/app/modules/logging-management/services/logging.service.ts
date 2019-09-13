import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {plainToClass} from 'class-transformer';
import {concatMap, delay, map} from 'rxjs/operators';

import {Logger, LoggersResponse} from '../logging.model';
import {Repository} from '../../storage-management/repository.model';

@Injectable({
    providedIn: 'root'
})
export class LoggingService {

    constructor(private http: HttpClient) {
    }

    getLoggers(): Observable<LoggersResponse> {
        return this.http
            .get(`/api/monitoring/loggers`)
            .pipe(map((r: any) => plainToClass(LoggersResponse, r)));
    }

    getLogger(name: string): Observable<Logger> {
        return this.http
            .get(`/api/monitoring/loggers/${name}`)
            .pipe(map((r: any) => {
                let logger = plainToClass(Logger, r, {groups: ['all']});
                logger.package = name;
                return logger;
            }));
    }

    save(logger: Logger): Observable<any> {
        let data = {};

        if (logger.configuredLevel !== null) {
            data = {configuredLevel: logger.configuredLevel};
        }

        return this.http
            .post<HttpResponse<any>>(`/api/monitoring/loggers/${logger.package}`, data, {observe: 'response'})
            .pipe(
                concatMap((response: HttpResponse<any>) => response.ok ? of(logger) : throwError(response)),
                delay(250),
                concatMap(() => logger.configuredLevel ? of(logger) : this.getLogger(logger.package))
            );
    }

    // TODO implement me
    downloadLog(path: string): Observable<Repository> {
        return this.http
            .get(`/api/monitoring/loggers`)
            .pipe(map((r: any) => plainToClass(Repository, r) as any));
    }

}
