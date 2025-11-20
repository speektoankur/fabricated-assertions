import { test, expect } from '@playwright/test';
import { config } from '../config/env.config';
import { testData } from '../config/test-data';
import { RegistrationPage } from '../pages/registration.page';
import { AccountServicesPage } from '../pages/account-services.page';
import { OpenAccountPage } from '../pages/open-account.page';
import { TransferFundsPage } from '../pages/transfer-funds.page';
import { BillPayPage } from '../pages/bill-pay.page';
import { LoginPage } from '../pages/login.page';
import { TransactionAPI } from '../api/transaction-api';
import { SessionManager } from '../utils/session-manager';

test('Complete banking flow: Registration, Account Creation, Transfer Funds, and Bill Pay and Transactions Validations via API', async ({ page, request }) => {
  // User Registration and Account Creation Flow
  const sessionManager = new SessionManager();
  await sessionManager.interceptSessionId(page);

  await page.goto(`${config.baseUrl}/parabank/register.htm`);

  const registrationPage = new RegistrationPage(page);
  await registrationPage.completeRegistration();

  const accountServicesPage = new AccountServicesPage(page);
  await accountServicesPage.verifyAccountServicesPage();
  await accountServicesPage.navigateToOpenNewAccount();

  const openAccountPage = new OpenAccountPage(page);
  await openAccountPage.openAccount();
  await openAccountPage.verifyAccountOpened();
  await openAccountPage.verifyAccountBalance();

  await accountServicesPage.navigateToTransferFunds();

  const transferFundsPage = new TransferFundsPage(page);
  await transferFundsPage.verifyTransferFundsPage();
  await transferFundsPage.submitTransfer();
  await transferFundsPage.verifyTransferSuccess();

  await accountServicesPage.navigateToBillPay();

  const billPayPage = new BillPayPage(page);
  const accountId = await billPayPage.submitPayment();
  await billPayPage.verifyBillPaymentSuccess();
  

  // Verify Transactions using API
  let sessionId = sessionManager.getSessionId();
  if (!sessionId) {
    sessionId = await sessionManager.getSessionIdFromCookies(page);
  }

  const transactionAPI = new TransactionAPI(request);
  if (sessionId) {
    transactionAPI.setSessionId(sessionId);
  }

  const transactionResponse = await transactionAPI.getAccountTransactions(parseInt(accountId));
  
  expect(transactionResponse.statusCode).toBe(200);
  expect(transactionResponse.transactions.length).toBeGreaterThan(0);
  
  const hasTransferTransaction = transactionResponse.transactions.some(
    t => t.description.includes('Funds Transfer')
  );
  const hasBillPaymentTransaction = transactionResponse.transactions.some(
    t => t.description.includes('Bill Payment')
  );

  expect(hasTransferTransaction).toBe(true);
  expect(hasBillPaymentTransaction).toBe(true);

  expect(transactionAPI.verifyTransactionTypes(
    transactionResponse.transactions,
    ['Credit', 'Debit']
  )).toBe(true);

  expect(transactionAPI.verifyTransactionDescriptions(
    transactionResponse.transactions,
    ['Funds Transfer', 'Bill Payment']
  )).toBe(true);

  await accountServicesPage.logOut();
  
  const loginPage = new LoginPage(page);
  await loginPage.verifyLoginPage();
});
