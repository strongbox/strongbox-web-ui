import {Component, OnInit} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

import {Breadcrumb} from '../../../../shared/layout/components/breadcrumb/breadcrumb.model';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

    breadcrumbs: Breadcrumb[] = [
        {label: 'Dashboard', url: ['/admin/dashboard']},
    ];

    constructor() {
    }

    ngOnInit() {
        this.loading$.next(false);
    }
}
