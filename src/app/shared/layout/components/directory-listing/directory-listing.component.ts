import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {MatDialog, MatDialogRef, MatTableDataSource} from '@angular/material';
import {takeUntil, takeWhile} from 'rxjs/operators';
import {Navigate} from '@ngxs/router-plugin';
import {Store} from '@ngxs/store';
import {HttpClient} from '@angular/common/http';

import {DirectoryListingService, PathContent, PathRecord} from '../../services/directory-listing.service';
import {ConfirmDialogComponent} from '../../../../modules/core/dialogs/confirm/confirm.dialog.component';

@Component({
    selector: 'app-directory-listing',
    templateUrl: './directory-listing.component.html',
    styleUrls: ['./directory-listing.component.scss']
})
export class DirectoryListingComponent implements OnInit, OnDestroy {

    fullPath$: BehaviorSubject<string> = new BehaviorSubject(null);

    @Input()
    allowBack = false;

    @Input('path')
    set setFullPath(path: string) {
        this.fullPath$.next(path);
        this.emitPathChange.emit(path);
    }

    @Input()
    baseUrl;

    @Input()
    showActions = false;

    @Output()
    emitPathChange: EventEmitter<string> = new EventEmitter();

    pathContent: PathContent = null;
    directoryListing: MatTableDataSource<PathRecord> = new MatTableDataSource([]);

    columns = ['name', 'lastModified', 'size', 'description'];
    columnsWithActions = [...this.columns, 'actions'];

    private path = '';

    private destroy$: Subject<any> = new Subject();

    private cached: Set<PathRecord> = new Set<PathRecord>();

    constructor(private cdr: ChangeDetectorRef,
                private dialog: MatDialog,
                private http: HttpClient,
                private service: DirectoryListingService,
                private store: Store) {
    }

    navigate(pathRecord: PathRecord) {
        let path = this.path !== '/' ? this.path.split('/') : [];

        if (pathRecord.type === 'file') {
            this.http
                .get(pathRecord.url, {responseType: 'arraybuffer'})
                .pipe(takeWhile(() => !this.cached.has(pathRecord)))
                .subscribe((buffer) => {
                    if (pathRecord.name.match(/md5|sha1$/i)) {
                        pathRecord.description = String.fromCharCode.apply(null, new Uint8Array(buffer));
                        this.cached.add(pathRecord);
                        this.cdr.detectChanges();
                    } else {
                        this.downloadFile(pathRecord, buffer);
                    }
                });
            return;
        }

        const route = [
            this.baseUrl,
            ...path,
            pathRecord.name
        ].filter(s => s !== '');

        // Remove ".." from the path.
        const base = window.location.protocol + '//' + window.location.host;
        const pathname = (new URL(route.join('/'), base)).pathname;

        this.store.dispatch(new Navigate(pathname.split('/')));
    }

    downloadFile(pathRecord: PathRecord, data): void {
        const blob: Blob = new Blob([data], {type: 'application/octet-stream'});
        const fileName = pathRecord.name;
        const objectUrl: string = URL.createObjectURL(blob);
        const a: HTMLAnchorElement = document.createElement('a') as HTMLAnchorElement;

        a.href = objectUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        URL.revokeObjectURL(objectUrl);
    }

    confirmDelete(pathRecord: PathRecord) {
        const message = 'You are about to delete <br><br><b>' + pathRecord.artifactPath + '</b>' +
            (pathRecord.type === 'directory' ? 'and all of it\'s contents' : '') +
            '<br><br> are you sure you want to continue?';

        this.dialog.open(
            ConfirmDialogComponent,
            {
                panelClass: 'deleteDialog',
                data: {
                    dangerConfirm: true,
                    message: message,
                    onConfirm: (ref: MatDialogRef<ConfirmDialogComponent>) => {
                        alert('One day this will be working.');
                    }
                }
            });
    }

    ngOnInit() {
        this.fullPath$
            .pipe(takeUntil(this.destroy$))
            .subscribe((fullPath) => {
                if (fullPath != null && fullPath.length > 0) {
                    const fullPathArray = fullPath.replace(new RegExp('^' + this.baseUrl, 'gi'), '').split('/');
                    this.path = fullPathArray.join('/');
                    this.service
                        .getStorageDirectoryListing(fullPath ? fullPath : '', this.allowBack)
                        .subscribe((pathContent: PathContent) => {
                            this.pathContent = pathContent;

                            this.directoryListing.data = [
                                ...pathContent.directories.sort(
                                    (a, b) => a.name.toLocaleLowerCase().localeCompare(b.name.toLocaleLowerCase())
                                ),
                                ...pathContent.files.sort(
                                    (a, b) => a.name.toLocaleLowerCase().localeCompare(b.name.toLocaleLowerCase())
                                )
                            ];
                        });
                }
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

}
