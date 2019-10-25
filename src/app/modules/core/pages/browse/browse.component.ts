import {Component, OnDestroy} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {ActivatedRoute, NavigationEnd, Router, RouterEvent} from '@angular/router';
import {filter, takeUntil} from 'rxjs/operators';

import {Breadcrumb} from '../../../../shared/layout/components/breadcrumb/breadcrumb.model';

@Component({
    selector: 'app-browse',
    templateUrl: './browse.component.html',
    styleUrls: ['./browse.component.scss']
})
export class BrowseComponent implements OnDestroy {

    breadcrumbs: Breadcrumb[] = [];
    loading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    path$: BehaviorSubject<string> = new BehaviorSubject(null);
    allowBack$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    baseUrl = '/browse';
    apiUrl = '/api/browse';

    private destroy$: Subject<any> = new Subject();

    constructor(private route: ActivatedRoute, private router: Router) {
        this.router
            .events
            .pipe(takeUntil(this.destroy$), filter((e: RouterEvent) => e instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => {
                const fullPath = event.url ? event.url : '';
                const fullPathArray = fullPath
                    .replace(new RegExp('^' + this.baseUrl, 'gi'), '')
                    .split('/')
                    .filter(v => v != null && v !== '' && v.trim() !== '');
                const path = fullPathArray.join('/');

                if (path === null || path === '') {
                    this.allowBack$.next(false);
                } else {
                    this.allowBack$.next(true);
                }

                this.breadcrumbs = [];
                this.breadcrumbs.push({
                    url: this.baseUrl,
                    label: 'Browse',
                    active: fullPathArray.length === 0
                });

                fullPathArray.forEach((p, index) => {
                    const pathToSegment = fullPathArray.filter((v, fpaIndex) => fpaIndex <= index).join('/');
                    this.breadcrumbs.push({
                        url: this.baseUrl + '/' + pathToSegment,
                        label: p
                    });
                });

                this.path$.next(path);
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

}
