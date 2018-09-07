import {Type} from 'class-transformer';

import {ApiFormDataValuesResponse, ApiResponse, FormDataValue} from '../core/core.model';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';

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

export class AssignableRole {
    constructor(public name = null, public description = null) {
    }
}

export class AssignablePrivilege {
    constructor(public name = null, public description = null) {
    }
}

export class UserAccessModel {
    @Type(() => PathPrivilege)
    repositoryPrivileges: PathPrivilege[] = [];

    @Type(() => PathPrivilege)
    urlToPrivileges: PathPrivilege[] = [];

    @Type(() => PathPrivilege)
    wildCardPrivileges: PathPrivilege[] = [];

    isRepositoryPrivilegesEmpty() {
        return !this.repositoryPrivileges || this.repositoryPrivileges.length === 0;
    }

    isUrlToPrivilegesEmpty() {
        return !this.urlToPrivileges || this.urlToPrivileges.length === 0;
    }

    isWildCardPrivilegesEmpty() {
        return !this.wildCardPrivileges || this.wildCardPrivileges.length === 0;
    }

    updateRepositoryPrivilege(privilege: PathPrivilege) {
        const searchIndex = this.repositoryPrivileges.findIndex(p => p.path === privilege.path);
        if (searchIndex > -1) {
            this.repositoryPrivileges[searchIndex] = privilege;
        } else {
            this.repositoryPrivileges.push(privilege);
        }
    }

    updateUrlPrivilege(privilege: PathPrivilege) {
        const searchIndex = this.urlToPrivileges.findIndex(p => p.path === privilege.path);
        if (searchIndex > -1) {
            this.urlToPrivileges[searchIndex] = privilege;
        } else {
            this.urlToPrivileges.push(privilege);
        }
    }

    updateWildcardPrivilege(privilege: PathPrivilege) {
        const searchIndex = this.wildCardPrivileges.findIndex(p => p.path === privilege.path);
        if (searchIndex > -1) {
            this.wildCardPrivileges[searchIndex] = privilege;
        } else {
            this.wildCardPrivileges.push(privilege);
        }
    }
}

export class PathPrivilege {
    constructor(public path: string = null, public privileges: string[] = []) {
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
}

export class AssignableRolesResponse extends ApiFormDataValuesResponse {
    @Type(() => AssignableRoleFormDataValue)
    formDataValues: AssignableRoleFormDataValue[] = [];
}

export class AssignableRoleFormDataValue extends FormDataValue {
    @Type(() => AssignableRole)
    values: AssignableRole[] = [];
}

export enum UserOperations {
    CREATE,
    UPDATE,
    VIEW
}

export enum UserAccessModelComponentEnums {
    repositoryPrivileges = 'repositoryPrivileges',
    urlToPrivileges = 'urlToPrivileges',
    wildCardPrivileges = 'wildCardPrivileges'
}

export class UserForm {
    private form: FormGroup;

    constructor(readonly operation: UserOperations = UserOperations.UPDATE, user: User = new User()) {
        this.generateBaseFormGroup(user);

        if (operation === UserOperations.CREATE) {
            this.applyCreateUserValidations(user);
        } else if (operation === UserOperations.VIEW) {
            this.applyViewOnlyValidations(user);
        } else {
            this.applyUpdateUserValidations(user);
        }
    }

    static generateAccessModelPathForm(pathPrivilege: PathPrivilege,
                                       type: UserAccessModelComponentEnums = UserAccessModelComponentEnums.repositoryPrivileges,
                                       parentForm: FormGroup = null) {
        const pathValidators = [
            Validators.required,
            // unique paths validator
            (pathField: FormControl) => {
                if (parentForm) {
                    const collection = (parentForm.get('accessModel').get(type) as FormArray).getRawValue();
                    if (collection.filter((v: PathPrivilege) => v.path.trim() === pathField.value.trim()).length > 0) {
                        return {
                            'unique': true
                        };
                    }
                }

                return null;
            }
        ];

        if (type === UserAccessModelComponentEnums.urlToPrivileges) {
            pathValidators.push(Validators.pattern(/^\/storages\/([a-zA-Z0-9\.-_]+)\/([a-zA-Z0-9\.-_]+)\/([^/]+)([/])?$/));
        } else if (type === UserAccessModelComponentEnums.wildCardPrivileges) {
            pathValidators.push(Validators.pattern(/^\/storages\/([a-zA-Z0-9\.-_]+)\/([a-zA-Z0-9\.-_]+)\/(([^/]+)([/])?)?$/));
        } else {
            pathValidators.push(Validators.pattern(/^\/storages\/([a-zA-Z0-9\.-_]+)\/([a-zA-Z0-9\.-_]+)\/$/));
        }

        let group = new FormGroup({
            path: new FormControl('', pathValidators),
            privileges: new FormControl([])
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
                repositoryPrivileges: new FormArray([]),
                urlToPrivileges: new FormArray([]),
                wildCardPrivileges: new FormArray([])
            }),
            enabled: new FormControl(true),
        });

        this.form.patchValue(user);

        let repositoryPrivileges = (this.form.get('accessModel').get(UserAccessModelComponentEnums.repositoryPrivileges) as FormArray);
        let urlToPrivileges = (this.form.get('accessModel').get('urlToPrivileges') as FormArray);
        let wildCardPrivileges = (this.form.get('accessModel').get('wildCardPrivileges') as FormArray);

        user.accessModel.repositoryPrivileges.forEach((pathPrivilege) => {
            repositoryPrivileges.push(UserForm.generateAccessModelPathForm(pathPrivilege));
        });

        user.accessModel.urlToPrivileges.forEach((pathPrivilege) => {
            urlToPrivileges.push(UserForm.generateAccessModelPathForm(pathPrivilege));
        });

        user.accessModel.wildCardPrivileges.forEach((pathPrivilege) => {
            wildCardPrivileges.push(UserForm.generateAccessModelPathForm(pathPrivilege));
        });
    }

    private applyCreateUserValidations(user: User) {
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

    private applyUpdateUserValidations(user: User) {
        const passwordValidators = [
            Validators.minLength(6)
        ];

        this.form.get('username').disable();
        this.form.get('password').setValidators(passwordValidators);
    }

    private applyViewOnlyValidations(user: User) {
        this.form.disable();
    }
}
