import {ChangeDetectionStrategy, Component, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject, concat, of} from 'rxjs';
import {FormGroup} from '@angular/forms';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {Store} from '@ngxs/store';
import {plainToClass} from 'class-transformer';
import {Navigate} from '@ngxs/router-plugin';
import {catchError, debounceTime, distinctUntilChanged, switchMap, tap} from 'rxjs/operators';
import {NgSelectComponent} from '@ng-select/ng-select';

import {Breadcrumb} from 'src/app/shared/layout/components/breadcrumb/breadcrumb.model';
import {Route, RouteForm, RouteOperations} from '../../route.model';
import {RouteManagementService} from '../../services/route-management.service';
import {ApiResponse, handle404error, handleFormError} from 'src/app/modules/core/core.model';
import {FormDataService, mapGroupRepositoryStringToObject} from '../../../../shared/form/services/form-data.service';

@Component({
    selector: 'app-manage-route',
    styleUrls: ['./manage-route.component.scss'],
    templateUrl: './manage-route.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageRouteComponent implements OnInit {

    public loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    public route$: BehaviorSubject<Route> = new BehaviorSubject<Route>(null);

    public operation: RouteOperations = RouteOperations.CREATE;

    storageItems$: BehaviorSubject<any[]> = new BehaviorSubject([]);
    storagesLoading = false;
    storagesInput$ = new BehaviorSubject<string>(null);

    groupRepositoryItems$: BehaviorSubject<any[]> = new BehaviorSubject([]);
    groupRepositoriesLoading = false;
    groupRepositoriesInput$ = new BehaviorSubject<string>(null);


    searchGroupRepositoriesItems$: BehaviorSubject<any[]> = new BehaviorSubject([]);
    searchGroupRepositoriesLoading = false;
    searchGroupRepositoriesInput$ = new BehaviorSubject<string>(null);

    routeForm: FormGroup;

    @ViewChild('storageSelect', {static: false, read: NgSelectComponent})
    storageSelectElement: NgSelectComponent;

    @ViewChild('groupRepositorySelect', {static: false, read: NgSelectComponent})
    groupRepositoryElement: NgSelectComponent;

    @ViewChild('searchGroupRepositoriesSelect', {static: false, read: NgSelectComponent})
    searchGroupRepositoriesElement: NgSelectComponent;

    public breadcrumbs: Breadcrumb[] = [
        {label: 'Routes', url: ['/admin/routes']}
    ];

    constructor(private activatedRoute: ActivatedRoute,
                private formData: FormDataService,
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
                this.onStorageChangeEvents();
            } else {
                this.breadcrumbs.push({label: 'Edit route', url: [], active: true});
                this.operation = RouteOperations.UPDATE;
                this.service
                    .getRoute(uuid)
                    .subscribe((route: Route) => {
                            this.route$.next(route);
                            this.routeForm = new RouteForm(this.operation, route).getForm();
                            this.onStorageChangeEvents();
                            this.loading$.next(false);
                        },
                        (e) => {
                            handle404error(e, ['/admin/routes'], this.notify, this.store);
                        });
            }
        });

        concat(
            of([]), // default items
            this.storagesInput$.pipe(
                debounceTime(200),
                distinctUntilChanged(),
                tap(() => this.storagesLoading = true),
                switchMap(term =>
                    this.formData
                        .findStorages(term)
                        .pipe(
                            catchError(() => of([])), // empty list on error
                            tap(() => this.storagesLoading = false)
                        )
                )
            )
        ).subscribe(result => this.storageItems$.next(result));

        concat(
            of([]), // default items
            this.groupRepositoriesInput$.pipe(
                debounceTime(270),
                tap(() => this.groupRepositoriesLoading = true),
                switchMap(term => {
                    const storageId = this.routeForm.get('storageId').value;

                    return this.formData
                        .findRepositoryNames(term, storageId, false, 'group')
                        .pipe(
                            catchError(() => of([])), // empty list on error
                            tap(() => this.groupRepositoriesLoading = false)
                        );
                })
            )
        ).subscribe(result => this.groupRepositoryItems$.next(result));

        concat(
            of([]), // default items
            this.searchGroupRepositoriesInput$.pipe(
                debounceTime(280),
                tap(() => this.searchGroupRepositoriesLoading = true),
                switchMap(term => {
                    const storageId = this.routeForm.get('storageId').value;
                    const groupRepositoryId = this.routeForm.get('groupRepositoryId').value;

                    return this.formData
                        .findGroupRepositoryNames(term, storageId, groupRepositoryId)
                        .pipe(
                            mapGroupRepositoryStringToObject(),
                            catchError(() => of([])), // empty list on error
                            tap(() => this.searchGroupRepositoriesLoading = false)
                        );
                })
            )
        ).subscribe(result => {
            this.searchGroupRepositoriesItems$.next(result);
        });
    }

    onStorageChangeEvents() {
        this.routeForm
            .get('storageId')
            .valueChanges
            .subscribe(() => {
                this.updateDynamicSelectFields();
            });
    }

    save() {
        if (this.routeForm.valid) {
            this.loading$.next(true);
            const route: Route = plainToClass(Route, this.routeForm.getRawValue()) as any;
            this.service
                .saveRoute(route, this.operation)
                .pipe(catchError(err => handleFormError(err, this.routeForm, this.loading$)))
                .subscribe((response: ApiResponse) => {
                    if (response.isValid()) {
                        this.store.dispatch(new Navigate(['/admin/routes']));
                        this.notify.success('Route has been successfully saved!');
                    }
                    this.loading$.next(false);

                });
        }
    }

    updateDynamicSelectFields() {
        this.routeForm.get('groupRepositoryId').reset('');
        this.groupRepositoryElement.clearModel();
        this.groupRepositoriesInput$.next('');

        this.routeForm.get('repositories').setValue([]);
        this.searchGroupRepositoriesElement.clearModel();
        this.searchGroupRepositoriesInput$.next('');
    }

    getRouteOperations() {
        return RouteOperations;
    }

    getPatternDefinition() {
        const storageId = this.routeForm.get('storageId').value;
        const groupRepositoryId = this.routeForm.get('groupRepositoryId').value;
        const pattern = this.routeForm.get('pattern').value;

        let definition = '/storages';

        if (storageId != null) {
            definition += `/${storageId}`;
        } else {
            definition += '/*';
        }

        if (groupRepositoryId != null) {
            definition += `/${groupRepositoryId}`;
        } else {
            definition += `/*`;
        }

        if (pattern !== null) {
            definition += `/${pattern}`;
        } else {
            definition = 'pattern not defined yet';
        }

        return definition;
    }
}
