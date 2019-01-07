import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {BehaviorSubject} from 'rxjs';
import {Store} from '@ngxs/store';

import {Breadcrumb} from '../../../../shared/layout/breadcrumb/breadcrumb.model';

@Component({
    selector: 'app-browse-storages',
    templateUrl: './browse-storages.component.html',
    styleUrls: ['./browse-storages.component.scss']
})
export class BrowseStoragesComponent implements OnInit {

    loading$: BehaviorSubject<boolean> = new BehaviorSubject(true);

    breadcrumbs: Breadcrumb[] = [
        {label: 'Storages', url: []}
    ];

    constructor(private location: Location, private route: ActivatedRoute, private router: Router, private store: Store) {
    }

    ngOnInit() {
        this.route.data.subscribe((data: any) => {
            this.loading$.next(false);
        });
    }

}
