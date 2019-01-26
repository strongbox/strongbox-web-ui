import {Component, Input, ViewEncapsulation} from '@angular/core';

@Component({
    selector: 'app-breadcrumb',
    template: `
        <ul class="breadcrumbs page">
            <li *ngFor="let bc of breadcrumbs; let last = last">
                <ng-container *ngIf="bc.url.length > 0">
                    <a [routerLink]="bc.url" [class.active]="bc.hasOwnProperty('active') ? bc.active : last">{{ bc.label }}</a>
                </ng-container>
                <ng-container *ngIf="bc.url.length === 0">
                    <a [class.active]="bc.hasOwnProperty('active') ? bc.active : last" (click)="$event.preventDefault()">{{ bc.label }}</a>
                </ng-container>
            </li>
        </ul>`,
    styleUrls: ['./breadcrumb.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class BreadcrumbComponent {
    @Input()
    breadcrumbs = [];
}
