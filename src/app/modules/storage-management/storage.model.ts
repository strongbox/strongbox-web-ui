import {Type} from 'class-transformer';
import {Repository} from './repository.model';

/**
 * Specifically called StorageEntity to avoid collision with the `Storage` interface of the Web Storage API
 * https://developer.mozilla.org/en-US/docs/Web/API/Storage
 */
export class StorageEntity {
    public id;
    public basedir;

    @Type(() => Repository)
    public repositories: Repository[] = [];

    constructor(id = null, basedir = null, repositories: Repository[] = null) {
        this.id = id;
        this.basedir = basedir;
        this.repositories = repositories;
    }
}
