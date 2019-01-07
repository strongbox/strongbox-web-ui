import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';

import {StorageManagerService} from '../services/storage-manager.service';
import {StorageEntity} from '../storage.model';

@Injectable({
    providedIn: 'root'
})
export class StoragesResolver implements Resolve<StorageEntity[]> {

    constructor(private service: StorageManagerService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<StorageEntity[]> {
        return this.service.getStorages();
    }
}
