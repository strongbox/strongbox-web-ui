import {Component, Input} from '@angular/core';
import {BehaviorSubject, isObservable} from 'rxjs';
import {Breadcrumb} from '../breadcrumb/breadcrumb.model';

@Component({
    selector: 'app-page-container',
    templateUrl: './page-container.component.html',
    styleUrls: ['./page-container.component.scss']
})
export class PageContainerComponent {

    loading$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    @Input()
    showBreadcrumbs = true;

    @Input()
    breadcrumbs: Breadcrumb[] = [];

    @Input()
    set loading(value) {
        if (isObservable(value) && value instanceof BehaviorSubject) {
            this.loading$ = value;
        } else {
            this.loading$.next(value);
        }
    }

}
