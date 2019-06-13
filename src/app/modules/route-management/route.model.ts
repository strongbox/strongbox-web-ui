import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Type} from 'class-transformer/decorators';

import {ApiResponse} from '../core/core.model';

export class Route {
    uuid: string;
    type: string = RouteType[RouteType.ACCEPT];
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
            // We need to be extra careful with enums, because of
            // https://github.com/strongbox/strongbox/issues/1358
            type: new FormControl(RouteType[RouteType.ACCEPT].toLocaleLowerCase(), [Validators.required]),
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
