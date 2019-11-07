import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild
} from '@angular/core';
import {asyncScheduler, BehaviorSubject, fromEvent, Subject} from 'rxjs';
import {distinctUntilChanged, finalize, map, startWith, takeUntil, throttleTime} from 'rxjs/operators';
import {VirtualScrollerComponent} from 'ngx-virtual-scroller';

import {Breadcrumb} from '../../../../shared/layout/components/breadcrumb/breadcrumb.model';
import {environment} from '../../../../../environments/environment';
import {ConnectionState, EventSourceMessage} from '../../../core/rxjs/fromEventSource';
import {StreamLogDataSource} from './stream-log.datasource';
import {RetryAttempt} from '../../../core/rxjs/retryWithConsecutiveBreak';

@Component({
    selector: 'app-stream-log',
    templateUrl: './stream-log.component.html',
    styleUrls: ['./stream-log.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StreamLogComponent implements OnInit, OnDestroy, AfterViewInit {

    readonly baseUrl = environment.strongboxUrl ? location.protocol + '//' + environment.strongboxUrl : '';

    readonly breadcrumbs: Breadcrumb[] = [
        {label: 'Logging', url: ['/admin/logging']},
        {label: 'Streaming', url: []}
    ];

    readonly historyLimit = 100000;

    disabled$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    tailing$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    state$: BehaviorSubject<string> = new BehaviorSubject<string>('connecting');
    retryAttempt$: BehaviorSubject<RetryAttempt> = new BehaviorSubject<RetryAttempt>(null);

    source: StreamLogDataSource = null;

    throttledMessages$: BehaviorSubject<EventSourceMessage[]> = new BehaviorSubject<EventSourceMessage[]>([]);

    @ViewChild('scroll', {static: true})
    private virtualScroller: VirtualScrollerComponent;

    @ViewChild('streamContainer', {static: true})
    private streamContainer: ElementRef;

    private destroy$ = new Subject();

    constructor(private cdr: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.connect();
    }

    ngAfterViewInit(): void {
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
        this.disconnect();
    }

    connect() {
        this.source = this.getDataSourceInstance();
        this.source.connect();
        this.monitorConnectionState();
        this.monitorWheel();
        this.monitorIncomingMessages();
        this.startTailing();
    }

    disconnect(clearMessages = false) {
        this.stopTailing();
        this.source.disconnect(clearMessages);
    }

    getDataSourceInstance() {
        return new StreamLogDataSource(this.historyLimit);
    }

    monitorIncomingMessages() {
        // this is necessary to smoothen the rendering.
        this.source
            .getMessagesStream()
            .pipe(
                takeUntil(this.destroy$),
                // update the logs at a rate of at most once per second
                throttleTime(2000, asyncScheduler, {leading: true, trailing: true})
            )
            .subscribe((messages) => {
                this.throttledMessages$.next(messages);
            });
    }

    monitorConnectionState() {
        this.source
            .getConnectionState()
            .pipe(
                startWith(null, ConnectionState.CONNECTING),
                takeUntil(this.destroy$),
                distinctUntilChanged(),
                finalize(() => {
                    this.setState('disconnected');
                    this.cdr.markForCheck();
                })
            )
            .subscribe((state: number | object) => {
                // ConnectionState
                if (typeof state === 'number') {
                    if (state === ConnectionState.OPEN) {
                        this.setState('open');
                    } else if (state === ConnectionState.CONNECTING) {
                        this.setState('connecting');
                    } else if (state === ConnectionState.CLOSED) {
                        this.setState('disconnected');
                    }
                } else {
                    this.setState('retrying');
                    this.retryAttempt$.next(state as RetryAttempt);
                }

                this.cdr.markForCheck();
            });
    }

    monitorWheel() {
        const nativeElement = this.streamContainer.nativeElement;

        // auto stop/start tailing based on mouse wheel scrolling direction
        fromEvent(nativeElement, 'wheel')
            .pipe(
                takeUntil(this.destroy$),
                throttleTime(50),
                map((event: WheelEvent) => event.deltaY < 0 ? 'up' : 'down'),
            )
            .subscribe((direction: 'up' | 'down') => {
                if (direction === 'up' && this.tailing$.getValue() === true) {
                    this.tailing$.next(false);
                } else if (direction === 'down' && this.tailing$.getValue() === false) {
                    const offset = 200; // makes it easier to "snap" when you're near the end.
                    const currentPosition = nativeElement.scrollHeight - nativeElement.scrollTop - offset;
                    const bottomPosition = nativeElement.clientHeight;
                    if (currentPosition <= bottomPosition) {
                        this.tailing$.next(true);
                        this.startTailing();
                        this.cdr.markForCheck();
                    }
                }
            });

    }

    startTailing() {
        this.virtualScroller
            .vsUpdate
            .pipe(
                takeUntil(this.destroy$),
                throttleTime(240, asyncScheduler, {leading: true, trailing: true})
            )
            .subscribe(() => {
                if (this.tailing$.getValue() === true && this.isConnected()) {
                    this.scrollToBottom();
                }
            });
    }

    scrollToBottom() {
        const parentScrollElement: HTMLElement = this.streamContainer.nativeElement;
        const paddingElement: HTMLElement = parentScrollElement.querySelector('.total-padding');
        this.virtualScroller.scrollToPosition(paddingElement.scrollHeight);
    }

    stopTailing() {
        if (this.tailing$.getValue() === true) {
            this.tailing$.next(false);
        }
    }

    setState(state): void {
        if (this.state$.getValue() !== state) {
            this.state$.next(state);
        }
    }

    downloadServerLog(): void {
        window.location.href = `${this.baseUrl}/api/logging/download/strongbox.log`;
    }

    downloadBrowserLog(): void {
        const now = Math.floor(Date.now() / 1000);

        let messages = Array.from(this.virtualScroller.items).map((eventMessage) => eventMessage.data + '\n');

        const blob = new Blob(messages, {type: 'application/octet-stream'});

        // URL pointing to the Blob with the file contents
        let objUrl = window.URL.createObjectURL(blob);

        // create a href element
        let downloadLink: any = document.createElement('a');
        downloadLink.setAttribute('style', 'display: none');
        downloadLink.download = `strongbox-browser-log-${now}.log`;
        downloadLink.href = objUrl;
        downloadLink.click();

        // revoke the object URL to avoid memory leaks.
        setTimeout(() => {
            window.URL.revokeObjectURL(objUrl);
            downloadLink.remove();
        }, 2000);

    }

    clearMessages(): void {
        this.virtualScroller.items = [];
        this.source.clearMessages();
        this.cdr.markForCheck();
    }

    hasMessages(): boolean {
        return this.source.hasMessages();
    }

    isState(state): boolean {
        return this.state$.getValue().toLowerCase() === state.toLowerCase();
    }

    isConnected(): boolean {
        return this.state$.getValue().toLowerCase() === 'open';
    }

    isDisconnected(): boolean {
        return this.state$.getValue().toLowerCase() === 'disconnected';
    }

    isConnecting(): boolean {
        return this.state$.getValue().toLowerCase() === 'connecting' ||
            this.state$.getValue().toLowerCase() === 'retrying';
    }

    isWaitingForMessages(): boolean {
        return this.isConnected() && !this.hasMessages();
    }

    getRetrySeconds(seconds) {
        return Math.floor(seconds / 1000);
    }
}
