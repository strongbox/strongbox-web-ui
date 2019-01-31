import {StorageEntity} from '../../../storage.model';

const name = '[StorageManagement][BrowseStorages]';

export class BrowseStoragesToggleStoragesSearchInput {
    static readonly type = name + ' Toggle storages search';
}

export class BrowseStoragesInitialLoadCompleted {
    static readonly type = name + ' Initial loading completed';
}

export class BrowseStoragesSelectStorage {
    static readonly type = name + ' Selected storage';

    constructor(public payload: string = null) {
    }
}

export class BrowseStoragesLoadStorages {
    static readonly type = name + ' Loading storages';
}

export class BrowseStoragesAddStorage {
    static readonly type = name + ' Adding storages';

    constructor(public storage: StorageEntity) {

    }
}

export class BrowseStoragesDeleteStorage {
    static readonly type = name + ' Deleting storage';

    constructor(public id: string) {

    }
}

