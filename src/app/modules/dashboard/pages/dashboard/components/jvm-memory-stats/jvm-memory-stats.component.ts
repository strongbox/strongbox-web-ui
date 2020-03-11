import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {Color, BaseChartDirective} from 'ng2-charts';
import {BehaviorSubject, Subject, throwError, timer} from 'rxjs';
import {catchError, mergeMap, map, takeUntil, tap} from 'rxjs/operators';

import * as chartJs from 'chart.js';

import {DashboardMetricsService} from '../../../../services/dashboard-metrics.service';

@Component({
    selector: 'app-jvm-memory-stats-component',
    templateUrl: './jvm-memory-stats.component.html',
    styleUrls: ['./jvm-memory-stats.component.scss']
})
export class JvmMemoryStatsComponent implements OnInit, OnDestroy {
    @ViewChild(BaseChartDirective, {static: true})
    jvmMemoryChart: BaseChartDirective;

    loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

    public jvmMemoryLineChartData: Array<any> = [];
    public jvmMemoryLineChartLabels: Array<any> = [];

    public jvmLineChartOptions: any = {
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
                    id: 'y-1',
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

    public jvmMemoryLineChartDataSet: Array<any> = [
        {
            data: this.jvmMemoryLineChartData,
            label: 'JVM Memory Used (GB)',
            radius: 0
        }
    ];

    private destroy$: Subject<any> = new Subject();

    constructor(private service: DashboardMetricsService) {
    }

    ngOnInit() {
        timer(0, 2000)
            .pipe(
                mergeMap(() => this.service.getJvmUsedMemory().pipe(takeUntil(this.destroy$))),
                map((response: any) => {
                    // conversion from bytes to gigabytes
                    let jvmUsedMemory = response.measurements[0].value / 1024 / 1024 / 1024;

                    const _jvmMemoryLineChartData = this.jvmMemoryLineChartData;
                    const _jvmMemoryLineChartLabels = this.jvmMemoryLineChartLabels;

                    if (_jvmMemoryLineChartData.length >= 30) {
                        _jvmMemoryLineChartData.shift();
                        _jvmMemoryLineChartLabels.shift();
                    }

                    _jvmMemoryLineChartData.push(jvmUsedMemory);

                    // This is just to be able to render the new data added to the chart
                    _jvmMemoryLineChartLabels.push('');

                    this.jvmMemoryLineChartData = _jvmMemoryLineChartData;
                    this.jvmMemoryLineChartLabels = _jvmMemoryLineChartLabels;
                    this.jvmMemoryChart.chart.update();
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
