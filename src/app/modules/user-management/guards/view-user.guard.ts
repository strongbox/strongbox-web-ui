import {Injectable} from '@angular/core';
import {AbstractAuthorityGuard} from '../../core/guards/abstract-authority-guard';

@Injectable()
export class ViewUserGuard extends AbstractAuthorityGuard {
    allAuthoritiesCollection() {
        return ['VIEW_USER'];
    }
}
