import {Injectable} from '@angular/core';
import {AbstractUserGuard} from './abstract-user-guard';

@Injectable()
export class UpdateUserGuard extends AbstractUserGuard {
    protected REQUIRED_AUTHORITY = 'UPDATE_USER';
}
