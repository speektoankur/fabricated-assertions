import { test as base } from '@playwright/test';
import { RegistrationPage } from '../pages/registration.page';
import { AccountServicesPage } from '../pages/account-services.page';
import { OpenAccountPage } from '../pages/open-account.page';
import { TransferFundsPage } from '../pages/transfer-funds.page';
import { BillPayPage } from '../pages/bill-pay.page';
import { LoginPage } from '../pages/login.page';
import { TransactionAPI } from '../api/transaction-api';
import { SessionManager } from '../utils/session-manager';

// Declare the types of your fixtures.
type MyFixtures = {
                registrationPage: RegistrationPage;
                accountServicesPage: AccountServicesPage;
                openAccountPage: OpenAccountPage;
                transferFundsPage: TransferFundsPage;
                billPayPage: BillPayPage;
                loginPage: LoginPage;
                transactionAPI: TransactionAPI;
                sessionManager: SessionManager;
};

// Extend the base test type with your fixtures.
export const test = base.extend<MyFixtures>({
                registrationPage: async ({ page }, use) => {
                                await use(new RegistrationPage(page));
                },
                accountServicesPage: async ({ page }, use) => {
                                await use(new AccountServicesPage(page));
                },
                openAccountPage: async ({ page }, use) => {
                                await use(new OpenAccountPage(page));
                },
                transferFundsPage: async ({ page }, use) => {
                                await use(new TransferFundsPage(page));
                },
                billPayPage: async ({ page }, use) => {
                                await use(new BillPayPage(page));
                },
                loginPage: async ({ page }, use) => {
                                await use(new LoginPage(page));
                },
                transactionAPI: async ({ request }, use) => {
                                await use(new TransactionAPI(request));
                },
                sessionManager: async ({ page }, use) => {
                                const sm = new SessionManager();
                                // Automatically start interception when this fixture is used
                                await sm.interceptSessionId(page);
                                await use(sm);
                },
});

export { expect } from '@playwright/test';
