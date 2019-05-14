import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';
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
})
export class ListRoutesComponent implements OnInit {

    breadcrumbs: Breadcrumb[] = [
        {label: 'Routes', url: ['/admin/routes']}
    ];

    loading$: BehaviorSubject<boolean> = new BehaviorSubject(true);

    routes$: BehaviorSubject<Route[]> = new BehaviorSubject<Route[]>([]);

    public displayedColumns: string[] = ['pattern', 'type', 'storageId', 'repositoryId', 'actions'];

    constructor(private routingService: RouteManagementService,
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
                                    this.routes$
                                        .next(
                                            this.routes$
                                                .getValue()
                                                .filter((value: Route) => {
                                                    return value.uuid !== route.uuid;
                                                })
                                        );
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
            this.routes$.next(results);
        });
    }
}
