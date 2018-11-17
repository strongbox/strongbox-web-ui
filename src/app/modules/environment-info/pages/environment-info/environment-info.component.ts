import {Component, OnInit} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {ToastrService} from 'ngx-toastr';
import {MatTableDataSource} from '@angular/material';

import {Breadcrumb} from '../../../../shared/layout/breadcrumb/breadcrumb.model';
import {EnvironmentInfoService} from '../../services/environment-info.service';
import {EnvironmentInfo} from '../../environment-info.model';

@Component({
    selector: 'app-environment-info',
    templateUrl: './environment-info.component.html',
    styleUrls: ['./environment-info.component.scss']
})
export class EnvironmentInfoComponent implements OnInit {

    loading$: BehaviorSubject<boolean> = new BehaviorSubject(true);

    breadcrumbs: Breadcrumb[] = [
        {url: ['admin/environment-info'], label: 'System information'}
    ];

    data: BehaviorSubject<EnvironmentInfo> = new BehaviorSubject(<EnvironmentInfo>{environment: [], jvm: [], system: []});

    dataSourceStrongbox = new MatTableDataSource();
    dataSourceEnvironment = new MatTableDataSource();
    dataSourceSystem = new MatTableDataSource();

    constructor(private service: EnvironmentInfoService, private notify: ToastrService) {
    }

    applyFilter(type, filterValue: string) {
        const filter = filterValue.trim().toLowerCase();
        if (type === 'env') {
            this.dataSourceEnvironment.filter = filter;
        } else if (type === 'sys') {
            this.dataSourceSystem.filter = filter;
        }
    }

    ngOnInit() {
        this.service.getInfo().subscribe(
            (data: any) => {
                data.environment.sort((a, b) => a.name.toLowerCase().startsWith('strongbox_') ? -1 : 0);

                this.dataSourceEnvironment = new MatTableDataSource<any>(data.environment);
                this.dataSourceSystem = new MatTableDataSource<any>(data.system);
                this.dataSourceStrongbox = new MatTableDataSource<any>([
                    {name: 'Storages', value: '15 (not done yet)'},
                    {name: 'Repositories', value: '25 (not done yet)'},
                    {name: 'Users', value: '250 (not done yet)'},
                    {name: 'Version', value: 'not done yet.'}
                ]);

                this.data.next(data);
                this.loading$.next(false);
            },
            (error) => {
                this.notify.error('Could not retrieve environment information from backend.');
                console.error(error);
            }
        );
    }

}
