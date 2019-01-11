import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {Location} from '@angular/common';
import {Observable, Subject} from 'rxjs';
import {Select, Store} from '@ngxs/store';
import {takeUntil} from 'rxjs/operators';

import {Breadcrumb} from '../../../../shared/layout/breadcrumb/breadcrumb.model';
import {BrowseStoragesState} from './state/browse-storages.state.model';
import {BrowseStoragesLoadStorages, BrowseStoragesSelectStorage} from './state/browse-storages.actions';
import {RepositoryTypeEnum} from '../../repository.model';

@Component({
    selector: 'app-browse-storages',
    templateUrl: './browse-storages.component.html',
    styleUrls: ['./browse-storages.component.scss'],
})
export class BrowseStoragesComponent implements OnInit, OnDestroy {

    breadcrumbs: Breadcrumb[] = [
        {label: 'Storages', url: []}
    ];

    @Select(BrowseStoragesState.isInitialLoading)
    initialLoading$: Observable<boolean>;

    @Select(BrowseStoragesState.isInitialLoading)
    loadingStates$: Observable<any>;

    @Select(BrowseStoragesState.selectedStorage)
    selectedStorage$: Observable<string>;

    repositoryTypes = Object.values(RepositoryTypeEnum);

    private destroy$: Subject<any> = new Subject();

    constructor(private location: Location,
                private route: ActivatedRoute,
                private store: Store) {
    }

    createRepositoryLink(type: string) {
        return ['/admin/storages', this.store.selectSnapshot(BrowseStoragesState.selectedStorage), 'create', type];
    }

    ngOnInit() {
        this.route
            .paramMap
            .pipe(takeUntil(this.destroy$))
            .subscribe((params: ParamMap) => {
                const storageId = params.get('storageId');
                const isInitialLoading = this.store.selectSnapshot(BrowseStoragesState.isInitialLoading);
                if (isInitialLoading) {
                    this.store.dispatch([
                        new BrowseStoragesLoadStorages(),
                        new BrowseStoragesSelectStorage(storageId),
                    ]);
                } else {
                    this.store.dispatch([new BrowseStoragesSelectStorage(storageId)]);
                }
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
