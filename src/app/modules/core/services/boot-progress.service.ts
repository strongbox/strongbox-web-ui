import {Inject, Injectable} from '@angular/core';
import {Store} from '@ngxs/store';
import {DOCUMENT} from '@angular/common';

import {environment} from '../../../../environments/environment';
import * as dayjs from 'dayjs';
import {CheckCredentialsAction} from '../auth/state/auth.actions';

@Injectable({
    providedIn: 'root'
})
export class BootProgressService {

    constructor(private store: Store, @Inject(DOCUMENT) private document: Document) {
    }

    start() {
        const baseUrl = environment.strongboxUrl ? location.protocol + '//' + environment.strongboxUrl : '';

        try {
            const splashScreen = document.querySelector('#fullscreen-splash');

            if (splashScreen !== null) {
                const messageElement = splashScreen.querySelector('.message');
                const spinnerContainer = splashScreen.querySelector('.spinner-container');

                // is the server online or still booting?
                let source = new EventSource(baseUrl + '/api/ping');
                let messages = 0;
                let startTime = dayjs();


                source.addEventListener('message', (e) => {
                    ++messages;
                    messageElement.innerHTML = 'Loading ' + e.data + '...';
                    splashScreen.querySelector('.bootStatus').removeAttribute('style');
                });

                source.addEventListener('booted', (e) => {
                    // longer timeout for when booting (i.e. started/restarted)
                    const timeout = messages > 0 ? 1600 : 350;

                    // Better loading.
                    if (messages > 0) {
                        messageElement.innerHTML = 'Let\'s get started!';
                        messageElement.setAttribute('style', 'color: white !important;');

                        spinnerContainer.setAttribute('class', 'spinner-container loaded');
                        console.log('Booted in ' + dayjs().diff(startTime, 's') + ' seconds');
                    }

                    // The server is up
                    setTimeout(() => {
                        if (splashScreen) {
                            splashScreen.setAttribute('class', 'loaded');

                            document.querySelector('app-strongbox').removeAttribute('style');

                            setTimeout(function () {
                                splashScreen.remove();
                            }, 680);

                            this.store.dispatch(new CheckCredentialsAction());
                        }
                    }, timeout);

                    source.close();
                });
            }
        } catch (e) {
            console.error(e);
        }
    }
}
