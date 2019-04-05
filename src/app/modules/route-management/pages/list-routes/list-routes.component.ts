import {Component, OnInit} from '@angular/core';
import {Breadcrumb} from 'src/app/shared/layout/components/breadcrumb/breadcrumb.model';
import {BehaviorSubject} from 'rxjs';
import {RouteManagementService} from '../../services/route-management.service';
import {Route} from '../../route.model';

@Component({
    selector: 'app-list-routes',
    templateUrl: './list-routes.component.html',
})
export class ListRoutesComponent implements OnInit {

    breadcrumbs: Breadcrumb[] = [
        {label: 'Routes', url: ['/admin/routes']}
    ];
    
    loading$: BehaviorSubject<boolean> = new BehaviorSubject(true);

    routes: BehaviorSubject<Route[]> = new BehaviorSubject<Route[]>(null);

    public displayedColumns: string[] = ['pattern', 'type', 'storageId', 'repositoryId', 'actions'];

    constructor(private routingService: RouteManagementService) {
    };

    ngOnInit() {
        this.routingService.getRoutes().subscribe((results: Route[]) => {
            this.loading$.next(false);
            this.routes.next(results);
        });
    }
}