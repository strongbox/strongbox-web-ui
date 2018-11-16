import {Component, Input, ViewEncapsulation} from '@angular/core';

@Component({
    selector: 'app-breadcrumb',
    template: `
        <ul class="breadcrumbs page">
            <li *ngFor="let bc of breadcrumbs; let last = last">
                <a [routerLink]="bc.url" [class.active]="last">{{ bc.label }}</a>
            </li>
        </ul>`,
    styleUrls: ['./breadcrumb.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class BreadcrumbComponent {
    @Input()
    breadcrumbs = [];
}
