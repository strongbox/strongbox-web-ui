import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {LoggingService} from '../../services/logging.service';
import {LoggerConfiguration, Loggers} from '../../logging.model';
import {BehaviorSubject} from 'rxjs';
import {Breadcrumb} from '../../../../shared/layout/components/breadcrumb/breadcrumb.model';
import {Store} from '@ngxs/store';
import {UpdateLoggerDialogComponent} from '../../dialogs/update-logger/update-logger.dialog.component';

@Component({
  selector: 'app-logging',
  templateUrl: './logging.component.html',
  styleUrls: ['./logging.component.scss']
})
export class LoggingComponent implements OnInit, AfterViewInit {

  public displayedColumns: string[] = ['package', 'configuredLevel', 'effectiveLevel', 'actions'];

  loading$: BehaviorSubject<boolean> = new BehaviorSubject(true);

  breadcrumbs: Breadcrumb[] = [
    {label: 'Logging', url: ['/admin/logging']}
  ];

  loggerConfigurations: MatTableDataSource<LoggerConfiguration> = new MatTableDataSource<LoggerConfiguration>([]);

  @ViewChild(MatPaginator, {static: true})
  paginator: MatPaginator;

  @ViewChild(MatSort, {static: true})
  sort: MatSort;

  levels: string[] = [];

  constructor(private loggingService: LoggingService,
              private store: Store,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    this.loggingService.getLoggers().subscribe((result: Loggers) => {
      this.loading$.next(false);
      this.levels = result.levels;
      this.loggerConfigurations.data = Object.keys(result.loggers).map(key => ({
        package: key,
        configuredLevel: result.loggers[key].configuredLevel,
        effectiveLevel: result.loggers[key].effectiveLevel
      }));
    });
  }

  ngAfterViewInit() {
    this.loggerConfigurations.paginator = this.paginator;
    this.loggerConfigurations.sort = this.sort;
  }

  openLoggerUpdateDialog(row: LoggerConfiguration) {
    this.dialog.open(UpdateLoggerDialogComponent, {
      data: {
        package: row.package,
        levels: this.levels
      }
    });
  }

  applyFilter(filterValue: string) {
    this.loggerConfigurations.filter = filterValue.trim().toLowerCase();
  }

}
