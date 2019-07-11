import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Type} from 'class-transformer/decorators';

import {ApiResponse} from '../core/core.model';

export class Route {
    uuid: string;
    // We need to be extra careful with enums, because of
    // https://github.com/strongbox/strongbox/issues/1358
    type: string = RouteType[RouteType.ACCEPT].toLocaleLowerCase();
    pattern: string;
    storageId: string;
    groupRepositoryId: string;
    @Type(() => RouteRepository)
    repositories: RouteRepository[];
}

export class RouteListResponse extends ApiResponse {
    rules: Route[];
}

export class RouteRepository {
    constructor(public storageId: string, public repositoryId: string) {
    }

    get storageIdAndRepositoryId(): string {
        if (this.isNotBlank(this.storageId) && this.isNotBlank(this.repositoryId)) {
            return this.storageId + ':' + this.repositoryId;
        } else if (this.isNotBlank(this.storageId)) {
            return this.storageId;
        } else if (this.isNotBlank(this.repositoryId)) {
            return this.repositoryId;
        }
    }

    private isNotBlank(str) {
        return str !== undefined && str !== null && str.length > 0;
    }
}

export enum RouteType {
    ACCEPT,
    DENY
}

export enum RouteOperations {
    CREATE,
    UPDATE,
    VIEW
}

export class RouteForm {
    private form: FormGroup;

    constructor(readonly operation: RouteOperations = RouteOperations.UPDATE, route: Route = new Route()) {
        this.generateForm(route);
    }

    public getForm(): FormGroup {
        return this.form;
    }

    private generateForm(route: Route) {
        this.form = new FormGroup({
            uuid: new FormControl('', []),
            storageId: new FormControl(null),
            groupRepositoryId: new FormControl(null),
            pattern: new FormControl(null, [Validators.required]),
            type: new FormControl(null, [Validators.required]),
            repositories: new FormControl([])
        });

        // Make sure these are null for ng-select.
        if (route.storageId === '') {
            route.storageId = null;
        }

        if (route.groupRepositoryId === '') {
            route.groupRepositoryId = null;
        }

        this.form.patchValue(route);
        this.form.get('uuid').disable();
    }
}
