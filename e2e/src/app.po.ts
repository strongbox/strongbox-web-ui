import {browser, by, element} from 'protractor';

export class AppPage {
    navigateTo(path = '/') {
        return browser.get(path);
    }

    getLogo() {
        return element(by.id('logo'));
    }
}
