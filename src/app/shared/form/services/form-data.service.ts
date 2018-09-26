import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {plainToClass} from 'class-transformer';

import {ApiFormDataValuesResponse, FormDataValue} from '../../../modules/core/core.model';

@Injectable({
    providedIn: 'root'
})
export class FormDataService {

    private collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});

    private cache = {
        storages: new Set([]),
        repositories: {
            storageId: null,
            results: new Set([])
        },
    };

    constructor(private http: HttpClient) {
    }

    findStorages(search = ''): Observable<string[]> {
        if (search === null) {
            search = '';
        } else {
            search = search.toLowerCase();
        }

        // check cache for a value
        if (this.cache.storages.size > 0) {
            const cached = [...this.cache.storages.values()].filter(v => v.toLowerCase().indexOf(search) > -1);
            if (cached.length > 0) {
                return of(cached);
            }
        }

        // Clear repositories cache.
        this.cache.repositories = {
            storageId: null,
            results: new Set([])
        };

        return this.http
            .get<ApiFormDataValuesResponse>(`/api/formData/storageNames?filter=${search}`)
            .pipe(
                map((r: ApiFormDataValuesResponse) => plainToClass(FormDataValue, r.formDataValues)),
                map((r: FormDataValue[]) => r[0].values),
                map(v => v.sort(this.collator.compare)),
                tap(array => array.forEach(v => this.cache.storages.add(v)))
            );
    }

    findRepositoriesByStorage(storageId, search = ''): Observable<string[]> {
        if (storageId === null || storageId === '') {
            return of([]);
        }

        if (search === null) {
            search = '';
        } else {
            search = search.toLowerCase();
        }

        // check cache for a value
        const cache = this.cache.repositories;
        if (cache.storageId === storageId && cache.results.size > 0) {
            const cached = [...cache.results.values()].filter(v => v.toLowerCase().indexOf(search) > -1);
            if (cached.length > 0) {
                return of(cached);
            }
        }

        return this.http
            .get<ApiFormDataValuesResponse>(`/api/formData/repositoryNames?storageId=${storageId}&filter=${search}`)
            .pipe(
                map((v: ApiFormDataValuesResponse) => plainToClass(FormDataValue, v.formDataValues)),
                map((v: FormDataValue[]) => v[0].values),
                map(v => v.sort(this.collator.compare)),
                tap(array => {
                    this.cache.repositories.storageId = storageId;
                    array.forEach(v => this.cache.repositories.results.add(v));
                })
            );
    }

}
