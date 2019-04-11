import {Component, OnInit} from '@angular/core';
import { Breadcrumb } from 'src/app/shared/layout/components/breadcrumb/breadcrumb.model';
import { Route, RouteForm, RouteOperations } from '../../route.model';
import { BehaviorSubject } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { RouteManagementService } from '../../services/route-management.service';
import { handle404error, ApiResponse } from 'src/app/modules/core/core.model';
import { ToastrService } from 'ngx-toastr';
import { Store } from '@ngxs/store';
import { plainToClass } from 'class-transformer';
import { Navigate } from '@ngxs/router-plugin';


@Component({
    selector: 'app-manage-route',
    templateUrl: './manage-route.component.html',
})
export class ManageRouteComponent implements OnInit {

    public loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    public route$: BehaviorSubject<Route> = new BehaviorSubject<Route>(null);

    public operation: RouteOperations = RouteOperations.CREATE;

    routeForm: FormGroup;

    public breadcrumbs: Breadcrumb[] = [
        {label: 'Routes', url: ['/admin/routes']}
    ];

    constructor(private activatedRoute: ActivatedRoute,
                private service: RouteManagementService,
                private store: Store,
                private notify: ToastrService) {
    }

    ngOnInit(): void {
        this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
            const uuid = params.get('uuid');
            if (!uuid) {
                this.breadcrumbs.push({label: 'New route', url: [], active: true});
                this.operation = RouteOperations.CREATE;
                this.routeForm = new RouteForm(this.operation).getForm();
                this.loading$.next(false);
                this.route$.next(new Route());
            } else {
                this.breadcrumbs.push({label: 'Edit route', url: [], active: true});
                this.operation = RouteOperations.UPDATE;
                this.service.getRoute(uuid)
                   .subscribe((response: Route) => {
                       this.route$.next(response);
                       this.routeForm = new RouteForm(this.operation, response).getForm();
                       this.loading$.next(false);
                    },
                    (e) => {
                        handle404error(e, ['/admin/routes'], this.notify, this.store);
                    });
            }
        });
    }

    save() {
        if (this.routeForm.valid) {
            this.loading$.next(true);
            const route: Route = plainToClass(Route, this.routeForm.getRawValue()) as any;
            this.service.updateRoute(route, this.operation).subscribe((response: ApiResponse) => {
                if (response.isValid()) {
                    this.store.dispatch(new Navigate(['/admin/routes']));
                    this.notify.success('Route has been successfully saved!');
                }
                this.loading$.next(false);
  
            });
        }
    }

    getRouteOperations() {
        return RouteOperations;
    }
}