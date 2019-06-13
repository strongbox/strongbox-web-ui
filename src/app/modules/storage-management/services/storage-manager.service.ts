import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {plainToClass} from 'class-transformer';

import {StorageEntity} from '../storage.model';
import {Repository} from '../repository.model';
import {ApiResponse} from '../../core/core.model';

@Injectable({
    providedIn: 'root'
})
export class StorageManagerService {

    constructor(private http: HttpClient) {
    }

    getStorages(): Observable<StorageEntity[]> {
        return this.http
            .get<any>('/api/configuration/strongbox/storages')
            .pipe(
                map((r: any) => plainToClass(StorageEntity, r.storages as Object[])),
                switchMap((storages: StorageEntity[]) => of(storages.sort((a, b) => a.id.localeCompare(b.id))))
            );
    }

    getStorage(storageId: string): Observable<StorageEntity> {
        return this.http
            .get(`/api/configuration/strongbox/storages/${storageId}`)
            .pipe(map((r: any) => plainToClass(StorageEntity, r) as any));
    }

    saveStorage(storageId: string | null, data: StorageEntity): Observable<ApiResponse> {
        let url = `/api/configuration/strongbox/storages`;
        if (storageId) {
            url = `${url}/${storageId}`;
        }

        return this.http
            .put(url, data)
            .pipe(map((r: any) => plainToClass(ApiResponse, r, {groups: ['error']}) as any));
    }

    deleteStorage(storageId: string): Observable<ApiResponse> {
        return this.http
            .delete(`/api/configuration/strongbox/storages/${storageId}`)
            .pipe(map((r: any) => plainToClass(ApiResponse, r, {groups: ['error']}) as any));
    }

    getRepository(storageId: string, repositoryId: string): Observable<Repository> {
        return this.http
            .get(`/api/configuration/strongbox/storages/${storageId}/${repositoryId}`)
            .pipe(map((r: any) => plainToClass(Repository, r) as any));
    }

    deleteRepository(storageId: string, repositoryId: string): Observable<ApiResponse> {
        return this.http
            .delete(`/api/configuration/strongbox/storages/${storageId}/${repositoryId}`)
            .pipe(map((r: any) => plainToClass(ApiResponse, r, {groups: ['error']}) as any));
    }

    saveRepository(storageId: string, repository: Repository): Observable<ApiResponse> {
        // tslint:disable-next-line:max-line-length
        delete repository.storageId; // because org.carlspring.strongbox.forms.configuration.RepositoryForm does not ignore unrecognized fields.
        return this.http
            .put(`/api/configuration/strongbox/storages/${storageId}/${repository.id}`, repository)
            .pipe(map((r: any) => plainToClass(ApiResponse, r, {groups: ['error']}) as any));
    }

}
