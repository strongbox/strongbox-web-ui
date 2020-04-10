import {Inject, Injectable, OnDestroy} from '@angular/core';
import {Store} from '@ngxs/store';
import {DOCUMENT} from '@angular/common';
import * as dayjs from 'dayjs';
import {BehaviorSubject, Observable, of, Subject, throwError, timer} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {catchError, delay, finalize, take, takeUntil, tap} from 'rxjs/operators';

import {environment} from '../../../../environments/environment';
import fromEventSource, {EventSourceMessage} from '../rxjs/fromEventSource';
import retryWithConsecutiveBreak, {RetryAttempt} from '../rxjs/retryWithConsecutiveBreak';
import {CheckCredentialsAction} from '../auth/state/auth.actions';

@Injectable({
    providedIn: 'root'
})
export class BootProgressService implements OnDestroy {

    readonly baseUrl = environment.strongboxUrl ? location.protocol + '//' + environment.strongboxUrl : '';

    private startTime = dayjs();

    private stream$: Observable<EventSourceMessage> = null;
    private state$: BehaviorSubject<BootState> = new BehaviorSubject<BootState>(BootState.NONE);
    private destroy$: Subject<any> = new Subject<any>();

    private message$: BehaviorSubject<string> = new BehaviorSubject<string>(null);

    constructor(private store: Store, @Inject(DOCUMENT) private document: Document, private http: HttpClient) {
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    // noinspection JSMethodCanBeStatic
    private getElements(): { [p: string]: HTMLElement } {
        const elements: { [key: string]: HTMLElement } = {
            appElement: HTMLElement = null,
            splashScreen: HTMLElement = null,
            bootStatusContainer: HTMLElement = null,
            message: HTMLElement = null,
            spinnerContainer: HTMLElement = null
        };

        try {
            elements.appElement = document.querySelector('app-strongbox');
            elements.splashScreenElement = document.querySelector('#fullscreen-splash');
            if (elements.splashScreenElement !== null) {
                elements.bootStatusContainerElement = elements.splashScreenElement.querySelector('.bootStatus');
                elements.messageElement = elements.splashScreenElement.querySelector('.message');
                elements.spinnerContainerElement = elements.splashScreenElement.querySelector('.spinner-container');
            }
        } catch (e) {
            console.error(e);
        }

        return elements;
    }

    private propagateMessage(message: string = null) {
        const elements = this.getElements();

        if (elements.messageElement != null) {
            // Make text stand out when we're ready.
            if (this.state$.getValue() === BootState.READY) {
                elements.messageElement.setAttribute('style', 'color: white !important;');
            }
            elements.messageElement.innerHTML = message;
        }
    }

    private propagateRetryMessage(attempt: RetryAttempt) {
        // set boot state to retry
        this.state$.next(BootState.RETRY);

        let retryInSeconds = Math.round(attempt.delay / 1000) - 1;

        timer(0, 1000)
            .pipe(
                take(retryInSeconds),
                finalize(() => {
                    of(null)
                        .pipe(delay(850), takeUntil(this.destroy$))
                        .subscribe(() => this.message$.next('Connecting...'));
                }),
                takeUntil(this.destroy$)
            )
            .subscribe((number) => {
                const remainingTime = retryInSeconds - number;
                this.message$.next(`Backend is down - retrying in ${remainingTime}s`);
            });
    }

    private connect() {
        if (this.stream$ === null) {
            this.state$.next(BootState.BOOTING);
            this.stream$ = fromEventSource(
                `${this.baseUrl}/api/ping`,
                ['booting', 'booted', 'ready'],
                {withCredentials: false}
            ).pipe(
                tap((e: EventSourceMessage) => {
                    if (e.type === 'ready') {
                        this.handleReady(e);
                    } else if (e.type === 'booting') {
                        this.handleBooting(e);
                    } else if (e.type === 'booted') {
                        this.handleBooted(e);
                    }
                }),

                retryWithConsecutiveBreak({
                    maxRetries: -1,
                    exponentialDelay: true,
                    incrementFraction: 1.45,
                    maxDelay: 16000,
                    destroy$: this.destroy$,
                    logAttempt: true,
                    onRetry: attempt => {
                        if (this.state$.getValue() !== BootState.BOOTED) {
                            this.propagateRetryMessage(attempt);
                        }
                    }
                }),

                // kill switch.
                takeUntil(this.destroy$),

                catchError((err) => {
                    this.state$.next(BootState.FATAL);
                    this.message$.next('Something unexpected happened - open dev console.');
                    console.log('ERROR: ', err);
                    return throwError(err);
                }),
            );
        }

        this.message$
            .pipe(takeUntil(this.destroy$))
            .subscribe((message) => this.propagateMessage(message));

        return this.stream$;
    }

    private handleBooting(event: EventSourceMessage) {
        this.state$.next(BootState.BOOTING);
        this.message$.next(event.data);
    }

    // The server is about to get live (this will disconnect any existing connections)
    private handleBooted(event: EventSourceMessage) {
        this.state$.next(BootState.BOOTED);
        console.log('Strongbox backend has booted in ~' + dayjs().diff(this.startTime, 's') + ' seconds');
    }

    // The server is ready to accept requests.
    private handleReady(event: EventSourceMessage) {
        this.state$.next(BootState.READY);
        this.destroy$.next();
        this.destroy$.complete();
        this.stream$ = null;

        // Trigger credential check.
        this.store.dispatch(new CheckCredentialsAction());

        const elements = this.getElements();

        // longer timeout for when booting (i.e. started/restarted) to have better animations.
        const timeout = this.message$.getValue() !== null ? 1650 : 350;
        if (this.message$.getValue() !== null) {
            this.message$.next('Let\'s get started!');
            elements.spinnerContainerElement.setAttribute('class', 'spinner-container loaded');
        }

        setTimeout(() => {
            if (elements.splashScreenElement) {
                elements.splashScreenElement.setAttribute('class', 'loaded');

                elements.appElement.removeAttribute('style');

                setTimeout(() => {
                    elements.splashScreenElement.remove();
                    elements.splashScreenElement = null;
                }, 680);
            }
        }, timeout);

    }

    start(): Promise<any> {
        if (this.state$.getValue() === BootState.READY) {
            return of(true).toPromise();
        }

        return this.connect().toPromise();
    }

    getState(): Observable<BootState> {
        return this.state$;
    }

    isBooting() {
        return this.state$.getValue() === BootState.BOOTING;
    }

    isBooted() {
        return this.state$.getValue() === BootState.BOOTED;
    }

    isReady() {
        return this.state$.getValue() === BootState.READY;
    }

}

export function BootProgressServiceFactory(service: BootProgressService) {
    return () => service.start();
}

export enum BootState {
    // Not started
    NONE,
    // Is booting
    BOOTING,
    // Backend has booted (will reload)
    BOOTED,
    // Backend is ready to handle traffic.
    READY,
    // Retrying to connect
    RETRY,
    // Fatal error?
    FATAL
}
