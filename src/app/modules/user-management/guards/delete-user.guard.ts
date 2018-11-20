import {Injectable} from '@angular/core';
import {AbstractAuthorityGuard} from '../../core/guards/abstract-authority-guard';

@Injectable()
export class DeleteUserGuard extends AbstractAuthorityGuard {
    allAuthoritiesCollection() {
        return ['DELETE_USER'];
    }
}
