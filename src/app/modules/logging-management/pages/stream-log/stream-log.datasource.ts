import {BehaviorSubject, Subject} from 'rxjs';
import {auditTime, bufferTime, filter, finalize, takeUntil, tap} from 'rxjs/operators';
import {EventEmitter, Output, Directive, Injectable} from '@angular/core';

import {environment} from '../../../../../environments/environment';
import fromEventSource, {ConnectionState, EventSourceMessage} from '../../../core/rxjs/fromEventSource';
import retryWithConsecutiveBreak, {RetryAttempt} from '../../../core/rxjs/retryWithConsecutiveBreak';

@Injectable()
export class StreamLogDataSource {
    readonly baseUrl = environment.strongboxUrl ? location.protocol + '//' + environment.strongboxUrl : '';

    @Output()
    private connectionEmitter: EventEmitter<ConnectionState | RetryAttempt> = new EventEmitter<ConnectionState | RetryAttempt>();

    private messages$: BehaviorSubject<EventSourceMessage[]> = new BehaviorSubject<EventSourceMessage[]>([]);
    private _hasMessages = false;
    private _hotMessages: EventSourceMessage[] = [];
    private _propagateMessages$: Subject<any> = new Subject<any>();

    private term$: BehaviorSubject<string> = new BehaviorSubject<string>(null);

    private destroy$: Subject<any> = new Subject<any>();

    private initialized = false;

    constructor(private historyLimit: number = 5000) {
    }

    connect(): EventEmitter<ConnectionState | RetryAttempt> {
        if (!this.initialized) {
            this.destroy$ = new Subject();
            this.connectionEmitter.next(ConnectionState.CONNECTING);
            // source observable which will be used in the buffer later.
            this.getEventSource()
                .subscribe((buffered: EventSourceMessage[]) => {
                    if (buffered.length > 0) {
                        const last = buffered[buffered.length - 1];
                        if (last.connectionState === ConnectionState.OPEN) {
                            this._hasMessages = true;

                            // clear everything after reaching history limit
                            if (this._hotMessages.length > this.historyLimit) {
                                this._hotMessages = [];
                            }

                            // process incoming messages
                            let messages = this._hotMessages;
                            messages.push(...buffered);

                            // save & propagate.
                            this._hotMessages = messages;
                            this._propagateMessages$.next();
                        }
                    }
                }, error => {
                    this.disconnect();
                });

            // propagate messages.
            this._propagateMessages$
                .pipe(takeUntil(this.destroy$), auditTime(500))
                .subscribe(() => this.messages$.next(this._hotMessages));

            this.initialized = true;
        }

        return this.connectionEmitter;
    }

    getEventSource() {
        return fromEventSource(
            `${this.baseUrl}/api/logging/stream`,
            ['stream'],
            {withCredentials: true}
        ).pipe(
            // kill switch.
            takeUntil(this.destroy$),
            // filter out non-related messages
            filter((message: EventSourceMessage) => {
                return this.filter(message);
            }),
            tap((e: EventSourceMessage) => {
                this.connectionEmitter.next(e.connectionState);
            }),
            retryWithConsecutiveBreak({
                maxRetries: 3,
                exponentialDelay: true,
                incrementFraction: 1.45,
                destroy$: this.destroy$,
                onRetry: attempt => this.connectionEmitter.next(attempt)
            }),
            bufferTime(800, null, 20000),
            finalize(() => this.connectionEmitter.next(ConnectionState.CLOSED)),
        );
    }

    disconnect(clearMessages = true): void {
        // Emit state
        if (this.connectionEmitter && !this.connectionEmitter.closed) {
            this.connectionEmitter.next(ConnectionState.CLOSED);
            this.connectionEmitter.complete();
        }

        // notify
        if (this.destroy$ && !this.destroy$.closed) {
            this.destroy$.next();
            this.destroy$.complete();
        }

        // clean up.
        if (this.messages$) {
            if (clearMessages) {
                this.clearMessages();
            }
            if (!this.messages$.closed) {
                this.messages$.complete();
            }
        }

        this.initialized = false;
    }

    filter(message: EventSourceMessage) {
        const hasTerm = (this.term$.getValue() === null);
        const hasMessage = (message === null);
        const hasMatchingMessage = message.data.match(new RegExp(this.term$.getValue()));

        return hasTerm || hasMessage || hasMatchingMessage;
    }

    applyFilter(term) {
        if (term == null || term === '' || term.match(/^\s$/gi) !== null) {
            this.term$.next(null);
            return;
        }
        this.term$.next(term);
    }

    clearMessages() {
        this._hotMessages = [];
        this._hasMessages = false;
        this.messages$.next([]);
    }

    getMessagesStream(): BehaviorSubject<EventSourceMessage[]> {
        return this.messages$;
    }

    hasMessages(): boolean {
        return this._hasMessages;
    }

    getConnectionState(): EventEmitter<ConnectionState | RetryAttempt> {
        return this.connectionEmitter;
    }

}
