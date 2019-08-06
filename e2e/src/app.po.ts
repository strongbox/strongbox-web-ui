import {browser, by, element} from 'protractor';

export class AppPage {
    navigateTo(path = '/') {
        return browser.get(path);
    }

    getBootsplashScreen() {
        return element(by.id('fullscreen-splash')).element(by.className('logo-text'));
    }
}
