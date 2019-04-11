import { ApiResponse } from '../core/core.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Type } from 'class-transformer/decorators';

export class Route {
    pattern: string;
    type: string;
    storageId: string;
    repositoryId: string;
    uuid: string;
    @Type(()=>Repository)
    repositories: Repository[]
}

export class RouteListResponse extends ApiResponse {
    rules: Route[];
}

export class Repository {
    storageId: string;
    repositoryId: string;
}

export enum RouteOperations {
    CREATE,
    UPDATE,
    VIEW
}

export class RouteForm {
    private form: FormGroup;

    constructor(readonly operation: RouteOperations = RouteOperations.UPDATE, route: Route = new Route()) {
        this.generateBaseFormGroup(route);
        this.form.get('type').setValidators([Validators.required]);
        this.form.get('pattern').setValidators([Validators.required]);
        this.form.get('uuid').disable();
    }

    public getForm(): FormGroup {
        return this.form;
    }

    private generateBaseFormGroup(route: Route) {

        this.form = new FormGroup({
            pattern: new FormControl(),
            type: new FormControl(),
            uuid: new FormControl(),
            storageId: new FormControl(),
            repositoryId: new FormControl(),
            repositories: new FormControl([{storageId:'',repositoryId:''}])
        });

        this.form.patchValue(route);
    }
}

export class RouteFormFieldsData {
    pattern: string;
    type: string;
}