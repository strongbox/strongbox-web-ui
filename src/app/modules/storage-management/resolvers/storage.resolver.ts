import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';

import {StorageEntity} from '../storage.model';
import {StorageManagerService} from '../services/storage-manager.service';

@Injectable({
    providedIn: 'root'
})
export class StorageResolver implements Resolve<any> {

    constructor(private service: StorageManagerService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        const storageId = route.paramMap.get('storageId');

        let result = of(null);
        if (storageId) {
            result = this.service.getStorage(storageId)
                .pipe(
                    map((s: StorageEntity) => {
                        s.repositories = s.repositories
                            .map(r => {
                                r.storageId = storageId;
                                return r;
                            })
                            .sort((a, b) => a.id.localeCompare(b.id));
                        return s;
                    }),
                    switchMap((s: StorageEntity) => {
                        return of({storage: s, storageId: storageId});
                    })
                );
        }

        return result;
    }
}
