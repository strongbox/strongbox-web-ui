import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';

if (environment.production) {
    enableProdMode();
}

platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .then(() => {
        setTimeout(function(){
            const splashScreen = document.getElementById('fullscreen-splash');
            if (splashScreen) {
                splashScreen.setAttribute('class', 'loaded');
                document.getElementsByTagName('app-strongbox').item(0).removeAttribute('style');
                setTimeout(function () {
                    splashScreen.remove();
                }, 680);
            }
        }, 400);
    })
    .catch(err => console.log(err));
