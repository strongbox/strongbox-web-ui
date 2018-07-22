import {Injectable} from '@angular/core';
import {AbstractUserGuard} from './abstract-user-guard';

@Injectable()
export class CreateUserGuard extends AbstractUserGuard {
    protected REQUIRED_AUTHORITY = 'CREATE_USER';
}
