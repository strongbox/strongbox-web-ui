import {AppPage} from './app.po';
import {browser} from 'protractor';

describe('Strongbox', () => {
    let page: AppPage;

    beforeEach(() => {
        page = new AppPage();
    });

    it('should display logo', () => {
        page.navigateTo('/');
        browser.sleep(2000);
        expect(page.getLogo().getText()).toBe('Strongbox');
    });
});
