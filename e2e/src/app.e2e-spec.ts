import {AppPage} from './app.po';
import {browser} from 'protractor';

describe('Strongbox', () => {
    let page: AppPage;

    beforeEach(() => {
        page = new AppPage();
    });

    it('should display boot splash screen', () => {
        browser.waitForAngularEnabled(false);
        page.navigateTo('/');
        browser.sleep(2000);
        expect(page.getBootsplashScreen().getText()).toBe('Strongbox');
    });
});
