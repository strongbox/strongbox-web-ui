import {Action, Selector, State, StateContext} from '@ngxs/store';
import {ToastrService} from 'ngx-toastr';
import {catchError, tap} from 'rxjs/operators';
import {of} from 'rxjs';
import {Navigate} from '@ngxs/router-plugin';

import {
    BrowseStoragesAddStorage,
    BrowseStoragesLoadStorages,
    BrowseStoragesSelectStorage,
    BrowseStoragesToggleStoragesSearchInput
} from './browse-storages.actions';
import {StorageManagerService} from '../../../services/storage-manager.service';
import {StorageEntity} from '../../../storage.model';
import {Repository} from '../../../repository.model';
import {ApiResponse} from '../../../../core/core.model';

export interface BrowseStoragesStateModel {
    selectedStorage: string;
    showStoragesSearch: boolean;
    loadingStorages: boolean;
    loadingRepositories: boolean;
    storages: StorageEntity[];
    repositories: Repository[];
}

@State<BrowseStoragesStateModel>({
    name: 'storageManagementBrowsing',
    defaults: {
        selectedStorage: null,
        showStoragesSearch: false,
        loadingStorages: true,
        loadingRepositories: true,
        storages: [],
        repositories: []
    }
})
export class BrowseStoragesState {
    @Selector()
    static selectedStorage(state: BrowseStoragesStateModel) {
        return state.selectedStorage;
    }

    @Selector()
    static showStorageSearchInput(state: BrowseStoragesStateModel) {
        return state.showStoragesSearch;
    }

    @Selector()
    static loadingStorages(state: BrowseStoragesStateModel) {
        return state.loadingStorages;
    }

    @Selector()
    static loadingRepositories(state: BrowseStoragesStateModel) {
        return state.loadingRepositories;
    }

    @Selector()
    static isInitialLoading(state: BrowseStoragesStateModel) {
        return state.loadingStorages === true && state.loadingRepositories === true;
    }

    @Selector()
    static storages(state: BrowseStoragesStateModel) {
        return state.storages;
    }

    @Selector()
    static repositories(state: BrowseStoragesStateModel) {
        return state.repositories;
    }

    constructor(private storageService: StorageManagerService, private notify: ToastrService) {
    }

    @Action(BrowseStoragesLoadStorages)
    loadStorages(ctx: StateContext<BrowseStoragesStateModel>) {
        return this.storageService
            .getStorages()
            .pipe(
                catchError((err) => {
                    this.notify.error('Could not retrieve storages!');
                    console.error('Could not retrieve storages!', err);
                    return of(null);
                }),
                tap((storages: StorageEntity[]) => {
                    const state = ctx.getState();
                    ctx.patchState({
                        ...state,
                        storages: storages,
                        loadingStorages: false,
                    });
                })
            );
    }

    @Action(BrowseStoragesAddStorage)
    addStorage(ctx: StateContext<BrowseStoragesStateModel>, {payload}: BrowseStoragesAddStorage) {
        ctx.patchState({
            ...ctx.getState(),
            storages: [
                ...ctx.getState().storages,
                payload
            ]
        });
    }

    @Action(BrowseStoragesSelectStorage)
    updateRepositoriesOnStorageChange(ctx: StateContext<BrowseStoragesStateModel>, {payload}: BrowseStoragesSelectStorage) {
        const loadRepositories = payload !== null;

        ctx.patchState({
            selectedStorage: payload,
            loadingRepositories: loadRepositories
        });

        if (loadRepositories) {
            return this.storageService
                .getStorage(payload)
                .pipe(
                    catchError((error: ApiResponse) => {
                        if (error.message.length > 0 && error.message.match(/storage/i)) {
                            this.notify.warning('Storage "' + payload + '" was not found.');
                            ctx.dispatch(new Navigate(['/admin/storages']));
                        } else {
                            this.notify.error('Could not retrieve repositories ' + payload + '!');
                            console.error('Could not retrieve repositories  for storage ' + payload + '!', error);
                        }
                        return of(error);
                    }),
                    tap((storageEntity: StorageEntity) => {
                        let repositories = [];
                        if (storageEntity instanceof StorageEntity) {
                            // Add storageId to Repository (makes life easier afterwards in the UI)
                            repositories = storageEntity.repositories.map((repo) => {
                                repo.storageId = payload;
                                return repo;
                            });
                        }

                        ctx.patchState({
                            ...ctx.getState(),
                            repositories: repositories,
                            loadingRepositories: false
                        });
                    })
                );
        }
    }

    @Action(BrowseStoragesToggleStoragesSearchInput)
    toggleStorageSearchInput(ctx: StateContext<BrowseStoragesStateModel>) {
        ctx.patchState({
            ...ctx.getState(),
            showStoragesSearch: !ctx.getState().showStoragesSearch
        });
    }

    @Action(BrowseStoragesSelectStorage)
    updateSelectedStorage(ctx: StateContext<BrowseStoragesStateModel>, {payload}: BrowseStoragesSelectStorage) {
        ctx.patchState({
            ...ctx.getState(),
            selectedStorage: payload
        });
    }
}
