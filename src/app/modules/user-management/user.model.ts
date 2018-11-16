import {Transform, Type} from 'class-transformer';

import {ApiResponse} from '../core/core.model';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {FormValidators} from '../../shared/form/form.validators';

export class User {
    username = '';
    enabled = true;
    securityTokenKey = null;
    password = null;

    authorities: string[] = [];

    roles: string[] = [];

    @Type(() => UserAccessModel)
    accessModel: UserAccessModel = new UserAccessModel();

    isAuthoritiesEmpty() {
        return !this.authorities || this.authorities.length === 0;
    }

    isRolesEmpty() {
        return !this.roles || this.roles.length === 0;
    }
}

export class UserRole {
    constructor(public name = null, public description = null) {
    }
}

export class UserPrivilege {
    constructor(public name = null, public description = null) {
    }
}

export class UserAccessModel {
    @Type(() => PathPrivilege)
    repositoriesAccess: PathPrivilege[] = [];

    isRepositoriesAccessEmpty() {
        return !this.repositoriesAccess || this.repositoriesAccess.length === 0;
    }
}

export class PathPrivilege {
    storageId: string = null;
    repositoryId: string = null;
    path: string = null;
    privileges: string[] = [];
    wildcard = false;

    constructor() {
    }
}

export class UserListResponse extends ApiResponse {
    users: User[];
}

export class UserResponse extends ApiResponse {
    @Type(() => User)
    user: User;

    @Type(() => UserRole)
    assignableRoles?: UserRole[];

    @Type(() => UserPrivilege)
    @Transform(array => array.map(v => new UserPrivilege(v)), {toClassOnly: true})
    assignablePrivileges?: UserPrivilege[];
}

export enum UserOperations {
    CREATE,
    UPDATE,
    VIEW
}

export class UserForm {
    private form: FormGroup;

    constructor(readonly operation: UserOperations = UserOperations.UPDATE, user: User = new User()) {
        this.generateBaseFormGroup(user);

        if (operation === UserOperations.CREATE) {
            this.applyCreateUserValidations();
        } else if (operation === UserOperations.VIEW) {
            this.applyViewOnlyValidations();
        } else {
            this.applyUpdateUserValidations();
        }
    }

    static generateAccessModelPathForm(pathPrivilege: PathPrivilege) {
        let group = new FormGroup({
            storageId: new FormControl('', [Validators.required]),
            repositoryId: new FormControl('', [Validators.required]),
            path: new FormControl('', [Validators.pattern(/^([a-z0-9\s+-_\/]*)$/i)]),
            wildcard: new FormControl(false),
            privileges: new FormControl([], [FormValidators.minOption(1)])
        });

        if (pathPrivilege) {
            group.patchValue(pathPrivilege);
        }

        return group;
    }

    public getForm() {
        return this.form;
    }

    private generateBaseFormGroup(user: User) {
        this.form = new FormGroup({
            username: new FormControl(),
            password: new FormControl(),
            roles: new FormControl([]),
            accessModel: new FormGroup({
                repositoriesAccess: new FormArray([])
            }),
            enabled: new FormControl(true),
        });

        this.form.patchValue(user);

        let repositoryPrivileges = (this.form.get('accessModel').get('repositoriesAccess') as FormArray);

        user.accessModel.repositoriesAccess.forEach((pathPrivilege) => {
            repositoryPrivileges.push(UserForm.generateAccessModelPathForm(pathPrivilege));
        });
    }

    private applyCreateUserValidations() {
        const userValidators = [
            Validators.required,
            Validators.minLength(3),
            Validators.pattern(/[a-zA-Z0-9\.-_]/)
        ];

        const passwordValidators = [
            Validators.required,
            Validators.minLength(8)
        ];

        this.form.get('username').setValidators(userValidators);
        this.form.get('password').setValidators(passwordValidators);
    }

    private applyUpdateUserValidations() {
        const passwordValidators = [
            Validators.minLength(2)
        ];

        this.form.get('username').disable();
        this.form.get('password').setValidators(passwordValidators);
    }

    private applyViewOnlyValidations() {
        this.form.disable();
    }
}

export class UserFormFieldsData {
    @Type(() => UserRole)
    assignableRoles: UserRole[];

    @Type(() => UserPrivilege)
    @Transform(array => array.map(v => new UserPrivilege(v)), {toClassOnly: true})
    assignablePrivileges: UserPrivilege[];
}
