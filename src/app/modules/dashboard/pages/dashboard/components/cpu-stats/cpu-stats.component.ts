import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {Color, BaseChartDirective} from 'ng2-charts';
import {BehaviorSubject, Subject, throwError, timer} from 'rxjs';
import {catchError, mergeMap, map, takeUntil, tap} from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';

import * as chartJs from 'chart.js';

import {DashboardMetricsService} from '../../../../services/dashboard-metrics.service';

@Component({
    selector: 'app-cpu-stats-component',
    templateUrl: './cpu-stats.component.html',
    styleUrls: ['./cpu-stats.component.scss']
})
export class CpuStatsComponent implements OnInit, OnDestroy {
    @ViewChild(BaseChartDirective, {static: true})
    cpuChart: BaseChartDirective;

    loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

    public cpuLineChartData: Array<any> = [0];
    public cpuLineChartLabels: Array<any> = [''];

    public cpuLineChartOptions: any = {
        responsive: true,
        scales: {
            xAxes: [
                {
                    gridLines: {
                        display: false
                    }
                }
            ],
            yAxes: [
                {
                    id: 'y-0',
                    position: 'left',
                    ticks: {
                        beginAtZero: true,
                        max: 100,
                        min: 0
                    },
                    gridLines: {
                        display: false
                    }
                }
            ]
        }
    };

    public cpuLineChartColors: Color[] = [
        {
            backgroundColor: 'rgba(0,0,0,0)',
            borderColor: '#2196F3',
            pointBackgroundColor: 'rgba(148,159,177,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(148,159,177,0.8)'
        }
    ];

    public cpuLineChartLegend = false;
    public cpuLineChartType: chartJs.ChartType = 'line';

    public cpuLineChartDataSet: Array<any> = [
        {
            data: this.cpuLineChartData,
            label: 'CPU Usage (%)',
            radius: 0
        }
    ];

    private destroy$: Subject<any> = new Subject();

    constructor(private service: DashboardMetricsService,
                private notify: ToastrService) {
    }

    ngOnInit() {
        timer(0, 2000)
            .pipe(
                mergeMap(() => this.service.getCpuUsage().pipe(takeUntil(this.destroy$))),
                map((response: any) => {
                    let cpuUsage = response.measurements[0].value * 100;

                    const _lineChartData = this.cpuLineChartData;
                    const _lineChartLabels = this.cpuLineChartLabels;

                    if (_lineChartData.length >= 30) {
                        _lineChartData.shift();
                        _lineChartLabels.shift();
                    }

                    _lineChartData.push(cpuUsage);

                    // This is just to be able to render the new data added to the chart
                    _lineChartLabels.push('');

                    this.cpuLineChartData = _lineChartData;
                    this.cpuLineChartLabels = _lineChartLabels;
                    this.cpuChart.chart.update();
                }),
                catchError((err: any) => {
                    this.notify.error('Failed to complete request');
                    console.error(err);
                    return throwError(err);
                }),
                tap(() => this.loading$.next(false)),
                takeUntil(this.destroy$)
            )
            .subscribe();
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
