import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {map, switchMap, tap} from 'rxjs/operators';
import {plainToClass} from 'class-transformer';

import {ApiFormDataValuesResponse, FormDataValue} from '../../../modules/core/core.model';
import {RouteRepository} from '../../../modules/route-management/route.model';

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

    findStorages(term = ''): Observable<any> {
        if (term === null) {
            term = '';
        } else {
            term = term.toLowerCase();
        }

        // check cache for a value
        if (this.cache.storages.size > 0) {
            const cached = [...this.cache.storages.values()].filter(v => v.toLowerCase().indexOf(term) > -1);
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
            .get(`/api/formData/storageNames?term=${term}`)
            .pipe(
                mapFormValueData(),
                mapFormFieldValues('storageNames'),
            );
    }

    findRepositoriesByStorage(storageId, search = ''): Observable<any> {
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
            .get<ApiFormDataValuesResponse>(`/api/formData/repositoryNames?storageId=${storageId}&term=${search}`)
            .pipe(
                mapFormValueData(),
                mapFormFieldValues('storageNames'),
                map(v => v.sort(this.collator.compare)),
                tap(array => {
                    this.cache.repositories.storageId = storageId;
                    array.forEach(v => this.cache.repositories.results.add(v));
                })
            );
    }

    findRepositoryNames(term = '', storageId = '', withStorageId = false, type = null): Observable<string[]> {
        term = this.sanitize(term);
        storageId = this.sanitize(storageId);
        type = this.sanitize(type);

        const url = `/api/formData/repositoryNames?term=${term}&storageId=${storageId}&withStorageId=${withStorageId}&type=${type}`;

        return this.http.get(url).pipe(
            mapFormValueData(),
            mapFormFieldValues('repositoryNames')
        );
    }

    findGroupRepositoryNames(term = '', storageId = '', groupRepositoryId = ''): Observable<any> {

        term = this.sanitize(term);
        storageId = this.sanitize(storageId);
        groupRepositoryId = this.sanitize(groupRepositoryId);

        const url = `/api/formData/repositoryNamesInGroupRepositories?term=${term}&storageId=${storageId}&groupRepositoryId=${groupRepositoryId}`;

        return this.http
            .get(url)
            .pipe(
                mapFormValueData(),
                mapFormFieldValues('repositoryNames')
            );
    }

    private sanitize(str) {
        return str === null || str === '' ? '' : str;
    }

    getAvailableDigestAlgorithmSet(): string[] {
        return ['MD5', 'SHA-1', 'SHA-256', 'SHA-512'];
    }
}

export function mapFormValueData() {
    return function (source$: Observable<any>): Observable<FormDataValue[]> {
        return source$.pipe(
            switchMap((response: any) => of(plainToClass(ApiFormDataValuesResponse, response).formDataValues)),
        );
    };
}

export function mapFormFieldValues(fieldName: string) {
    return function (source$: Observable<FormDataValue[]>): Observable<any[] | null> {
        return source$.pipe(
            map((fields: FormDataValue[]) => {
                const searchResult = fields.filter((record: FormDataValue) => {
                    return record.name.toLocaleLowerCase() === fieldName.toLocaleLowerCase();
                });

                if (searchResult.length === 1) {
                    return searchResult[0].values;
                } else if (searchResult.length > 1) {
                    console.error(`Found more form fields with the name ${fieldName} than expected!`);
                    return searchResult[0].values;
                } else {
                    return null;
                }
            }),
            switchMap(v => of(v))
        );
    };
}

export function mapGroupRepositoryStringToObject() {
    return function (source$: Observable<string[]>): Observable<any[] | null> {
        return source$.pipe(
            map((fields: string[]) => {
                    return fields.map(v => {
                        const segments = v.split(':');

                        if (segments.length === 2) {
                            return new RouteRepository(segments[0], segments[1]);
                        } else {
                            return new RouteRepository(null, segments[0]);
                        }
                    });
                }
            ),
            switchMap(v => of(v))
        );
    };
}
