import {Injectable} from '@angular/core';
import {AbstractAuthorityGuard} from '../../core/guards/abstract-authority-guard';

@Injectable()
export class CreateUserGuard extends AbstractAuthorityGuard {
    allAuthoritiesCollection() {
        return ['CREATE_USER'];
    }
}
