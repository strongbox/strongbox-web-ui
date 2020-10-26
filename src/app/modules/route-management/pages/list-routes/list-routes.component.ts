import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {BehaviorSubject} from 'rxjs';

import {ApiResponse} from 'src/app/modules/core/core.model';
import {Breadcrumb} from 'src/app/shared/layout/components/breadcrumb/breadcrumb.model';
import {ConfirmDialogComponent} from 'src/app/modules/core/dialogs/confirm/confirm.dialog.component';
import {RouteManagementService} from '../../services/route-management.service';
import {Route} from '../../route.model';

@Component({
    selector: 'app-list-routes',
    templateUrl: './list-routes.component.html',
    styleUrls: ['./list-routes.component.scss']
})
export class ListRoutesComponent implements OnInit, AfterViewInit {

    breadcrumbs: Breadcrumb[] = [
        {label: 'Routes', url: ['/admin/routes']}
    ];

    loading$: BehaviorSubject<boolean> = new BehaviorSubject(true);

    routes: MatTableDataSource<Route> = new MatTableDataSource<Route>([]);

    @ViewChild(MatSort, {static: true})
    sort: MatSort;

    public displayedColumns: string[] = ['pattern', 'repositories', 'actions'];

    constructor(private routingService: RouteManagementService,
                private cdr: ChangeDetectorRef,
                private dialog: MatDialog,
                private notify: ToastrService) {
    }

    confirmDeletion(route: Route) {
        this.dialog.open(
            ConfirmDialogComponent,
            {
                panelClass: 'deleteDialog',
                data: {
                    dangerConfirm: true,
                    message: 'You are about to delete the route ' + route.uuid + '!',
                    onConfirm: (ref: MatDialogRef<ConfirmDialogComponent>) => {
                        this.routingService
                            .deleteRoute(route)
                            .subscribe((result: ApiResponse) => {
                                ref.close(true);
                                if (result.isValid()) {
                                    this.routes.data = this.routes.data.filter((value: Route) => {
                                        return value.uuid !== route.uuid;
                                    });
                                    this.cdr.detectChanges();
                                    this.notify.success('Route has been successfully deleted!');
                                } else {
                                    this.notify.error(result.message);
                                }
                            });
                    }
                }
            });
    }

    ngOnInit() {
        this.routingService.getRoutes().subscribe((results: Route[]) => {
            this.loading$.next(false);
            this.routes.data = results;
        });
    }

    ngAfterViewInit() {
        this.routes.sort = this.sort;
    }

    getURLPatternDefinition(route: Route) {
        const storageId = route.storageId;
        const repositoryId = route.groupRepositoryId;
        const pattern = route.pattern;

        let definition = '/storages';

        if (storageId != null && storageId !== '') {
            definition += `/${storageId}`;
        } else {
            definition += '/*';
        }

        if (repositoryId != null && repositoryId !== '') {
            definition += `/${repositoryId}`;
        } else {
            definition += `/*`;
        }

        definition += `/${pattern}`;

        return definition;
    }

}
