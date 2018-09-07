import {Injectable} from '@angular/core';
import {AbstractUserGuard} from './abstract-user-guard';

@Injectable()
export class ViewUserGuard extends AbstractUserGuard {
    protected REQUIRED_AUTHORITY = 'VIEW_USER';
}
