import {Inject, Injectable} from '@angular/core';
import {Store} from '@ngxs/store';
import {DOCUMENT} from '@angular/common';
import * as dayjs from 'dayjs';
import {EventSourcePolyfill, NativeEventSource} from 'event-source-polyfill';

import {environment} from '../../../../environments/environment';
import {CheckCredentialsAction} from '../auth/state/auth.actions';

// cross-browser Event Source.
const EventSource = NativeEventSource || EventSourcePolyfill;

@Injectable({
    providedIn: 'root'
})
export class BootProgressService {

    readonly baseUrl = environment.strongboxUrl ? location.protocol + '//' + environment.strongboxUrl : '';
    readonly defaultReconnectFrequencySeconds = 2;

    private afterBootWaitSeconds = 2;
    private reconnectFrequencySeconds = this.defaultReconnectFrequencySeconds;
    private reconnectTimeoutId;

    private messages = 0;
    private startTime = dayjs();

    private splashScreenElement: HTMLElement;
    private bootStatusContainerElement: HTMLElement;
    private messageElement: HTMLElement;
    private spinnerContainerElement: HTMLElement;

    private source: EventSource;

    constructor(private store: Store, @Inject(DOCUMENT) private document: Document) {
    }

    private connect() {
        this.source = new EventSource(this.baseUrl + '/api/ping');
        this.source.onopen = (e: Event) => this.handleOnOpen(e);
        this.source.onerror = (e: Event) => this.handleOnError(e);
        this.source.addEventListener('booting', (e: MessageEvent) => this.handleBooting(e));
        this.source.addEventListener('booted', (e: MessageEvent) => this.handleBooted(e));
        this.source.addEventListener('ready', (e: MessageEvent) => this.handleReady(e));
    }

    private reconnect() {
        if (this.source) {
            this.source.close();

            // Double every attempt to avoid overwhelming server
            this.reconnectFrequencySeconds = Math.floor(this.reconnectFrequencySeconds * 1.6);

            // Max out at 15 seconds as a compromise between user experience and server load
            if (this.reconnectFrequencySeconds > 15) {
                this.reconnectFrequencySeconds = 15;
            }
        }

        this.clearTimeout();

        this.reconnectTimeoutId = setTimeout(() => this.connect(), (this.reconnectFrequencySeconds * 1000));
    }

    private handleOnOpen(event: Event) {
        // Reset reconnect frequency upon successful connection
        this.reconnectFrequencySeconds = this.defaultReconnectFrequencySeconds;
    }

    private handleOnError(event: Event) {
        console.log('Failed to connect to backend - retrying after ' + this.reconnectFrequencySeconds + ' seconds...');
        this.reconnect();
    }

    private handleBooting(event: MessageEvent) {
        ++this.messages;
        this.messageElement.innerHTML = event.data;
    }

    // The server is about to get live (this will disconnect any existing connections)
    private handleBooted(event: MessageEvent) {
        ++this.messages;

        // Close the existing connection
        this.source.close();

        // Clear any existing timeouts
        this.clearTimeout();

        // try to reconnect after a few seconds.
        setTimeout(() => this.reconnect(), this.afterBootWaitSeconds);
    }

    // The server is ready to accept requests.
    private handleReady(event: MessageEvent) {
        if (this.source) {
            this.source.close();
        }

        this.clearTimeout();

        // longer timeout for when booting (i.e. started/restarted) to have better animations.
        const timeout = this.messages > 0 ? 1650 : 350;
        if (this.isBooting()) {
            this.messageElement.innerHTML = 'Let\'s get started!';
            this.messageElement.setAttribute('style', 'color: white !important;');

            this.spinnerContainerElement.setAttribute('class', 'spinner-container loaded');
            console.log('Strongbox booted in ~' + dayjs().diff(this.startTime, 's') + ' seconds');
        }

        setTimeout(() => {
            if (this.splashScreenElement) {
                this.splashScreenElement.setAttribute('class', 'loaded');

                document.querySelector('app-strongbox').removeAttribute('style');

                setTimeout(() => {
                    this.splashScreenElement.remove();
                    this.splashScreenElement = null;
                }, 680);

                this.store.dispatch(new CheckCredentialsAction());
            }
        }, timeout);
    }

    private clearTimeout() {
        if (this.reconnectTimeoutId) {
            clearTimeout(this.reconnectTimeoutId);
        }

        if (this.source) {
            this.source.close();
        }
    }

    private isBooting() {
        return this.messages > 0;
    }

    start() {
        try {
            this.splashScreenElement = document.querySelector('#fullscreen-splash');
            if (this.splashScreenElement !== null) {
                this.bootStatusContainerElement = this.splashScreenElement.querySelector('.bootStatus');
                this.messageElement = this.splashScreenElement.querySelector('.message');
                this.spinnerContainerElement = this.splashScreenElement.querySelector('.spinner-container');
                this.connect();
            }
        } catch (e) {
            console.error(e);
        }
    }
}
