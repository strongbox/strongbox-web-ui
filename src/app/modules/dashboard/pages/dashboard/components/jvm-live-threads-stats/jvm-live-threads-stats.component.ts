import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {Color, BaseChartDirective} from 'ng2-charts';
import {BehaviorSubject, Subject, throwError, timer} from 'rxjs';
import {catchError, mergeMap, map, takeUntil, tap} from 'rxjs/operators';

import * as chartJs from 'chart.js';

import {DashboardMetricsService} from '../../../../services/dashboard-metrics.service';

@Component({
    selector: 'app-jvm-live-threads-stats-component',
    templateUrl: './jvm-live-threads-stats.component.html',
    styleUrls: ['./jvm-live-threads-stats.component.scss']
})
export class JvmLiveThreadsStatsComponent implements OnInit, OnDestroy {
    @ViewChild(BaseChartDirective, {static: true})
    jvmLiveThreadChart: BaseChartDirective;

    loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

    public jvmLiveThreadsLineChartData: Array<any> = [];
    public jvmLiveThreadsLineChartLabels: Array<any> = [];

    public jvmLiveThreadLineChartOptions: any = {
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
                    id: 'y-2',
                    position: 'left',
                    ticks: {
                        beginAtZero: true,
                        min: 0
                    },
                    gridLines: {
                        display: false
                    }
                }
            ]
        }
    };

    public jvmLineChartColors: Color[] = [
        {
            backgroundColor: 'rgba(0,0,0,0)',
            borderColor: '#2196F3',
            pointBackgroundColor: 'rgba(148,159,177,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(148,159,177,0.8)'
        }
    ];

    public jvmLineChartLegend = false;
    public jvmLineChartType: chartJs.ChartType = 'line';

    public jvmLiveThreadsLineChartDataSet: Array<any> = [
        {
            data: this.jvmLiveThreadsLineChartData,
            label: 'JVM Live Threads',
            radius: 0
        }
    ];

    private destroy$: Subject<any> = new Subject();

    constructor(private service: DashboardMetricsService) {
    }

    ngOnInit() {
        timer(0, 2000)
            .pipe(
                mergeMap(() => this.service.getJvmLiveThreads().pipe(takeUntil(this.destroy$))),
                map((response: any) => {
                    let jvmLiveThreads = response.measurements[0].value;

                    const _jvmLiveThreadsLineChartData = this.jvmLiveThreadsLineChartData;
                    const _jvmLiveThreadsLineChartLabels = this.jvmLiveThreadsLineChartLabels;

                    if (_jvmLiveThreadsLineChartData.length >= 30) {
                        _jvmLiveThreadsLineChartData.shift();
                        _jvmLiveThreadsLineChartLabels.shift();
                    }

                    _jvmLiveThreadsLineChartData.push(jvmLiveThreads);

                    // This is just to be able to render the new data added to the chart
                    _jvmLiveThreadsLineChartLabels.push('');

                    this.jvmLiveThreadsLineChartData = _jvmLiveThreadsLineChartData;
                    this.jvmLiveThreadsLineChartLabels = _jvmLiveThreadsLineChartLabels;
                    this.jvmLiveThreadChart.chart.update();
                }),
                catchError((err: any) => {
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
