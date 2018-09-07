import {Injectable} from '@angular/core';
import {AbstractUserGuard} from './abstract-user-guard';

@Injectable()
export class DeleteUserGuard extends AbstractUserGuard {
    protected REQUIRED_AUTHORITY = 'DELETE_USER';
}
