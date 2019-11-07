import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Subject} from 'rxjs';
import {Breadcrumb} from '../../../../shared/layout/components/breadcrumb/breadcrumb.model';
import {ActivatedRoute, NavigationEnd, Router, RouterEvent} from '@angular/router';
import {filter, takeUntil} from 'rxjs/operators';

@Component({
    selector: 'app-browse-logs',
    templateUrl: './browse-logs.component.html',
    styleUrls: ['./browse-logs.component.scss']
})
export class BrowseLogsComponent implements OnInit, OnDestroy {

    breadcrumbs: Breadcrumb[] = [];
    loading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    path$: BehaviorSubject<string> = new BehaviorSubject(null);
    allowBack$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    baseUrl = '/admin/logging/browse';
    apiUrl = '/api/logging/browse';

    private destroy$ = new Subject();

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
                    url: '/admin/logging',
                    label: 'Logging',
                    active: false
                });
                this.breadcrumbs.push({
                    url: '/admin/logging/browse',
                    label: 'Browse logs',
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

    ngOnInit() {
        // this.http.get('/api/monitoring/logs/browse').subscribe((result) => console.log(result));
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

}
