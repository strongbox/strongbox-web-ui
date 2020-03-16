import { DashboardModule } from './dashboard.module';

describe('Module: DashboardModule', () => {
    let dashboardModule: DashboardModule;

    beforeEach(() => {
        dashboardModule = new DashboardModule();
    });

    it('should create an instance', () => {
        expect(dashboardModule).toBeTruthy();
    });
});
