import {Injectable} from '@angular/core';
import {AbstractAuthorityGuard} from '../../core/guards/abstract-authority-guard';

@Injectable()
export class UpdateUserGuard extends AbstractAuthorityGuard {
    allAuthoritiesCollection() {
        return ['UPDATE_USER'];
    }
}
