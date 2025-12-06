import { test, expect } from '../utils/fixtures';
import { config } from '../config/env.config';

test('Complete banking flow: Registration, Account Creation, Transfer Funds, and Bill Pay and Transactions Validations via API', async ({
  page,
  registrationPage,
  accountServicesPage,
  openAccountPage,
  transferFundsPage,
  billPayPage,
  loginPage,
  transactionAPI,
  sessionManager
}) => {
  // User Registration and Account Creation Flow
  await page.goto(`${config.baseUrl}/parabank/register.htm`);

  await registrationPage.completeRegistration();

  await accountServicesPage.verifyAccountServicesPage();
  await accountServicesPage.navigateToOpenNewAccount();

  await openAccountPage.openAccount();
  await openAccountPage.verifyAccountOpened();
  await openAccountPage.verifyAccountBalance();

  await accountServicesPage.navigateToTransferFunds();

  await transferFundsPage.verifyTransferFundsPage();
  await transferFundsPage.submitTransfer();
  await transferFundsPage.verifyTransferSuccess();

  await accountServicesPage.navigateToBillPay();

  const accountId = await billPayPage.submitPayment();
  await billPayPage.verifyBillPaymentSuccess();


  // Verify Transactions using API
  let sessionId = sessionManager.getSessionId();
  if (!sessionId) {
    sessionId = await sessionManager.getSessionIdFromCookies(page);
  }

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

  await loginPage.verifyLoginPage();
});

test('Banking flow with Transaction Amount and Date Validations via API', async ({
  page,
  registrationPage,
  accountServicesPage,
  openAccountPage,
  transferFundsPage,
  billPayPage,
  loginPage,
  transactionAPI,
  sessionManager
}) => {
  // User Registration and Account Setup
  await page.goto(`${config.baseUrl}/parabank/register.htm`);

  await registrationPage.completeRegistration();

  await accountServicesPage.verifyAccountServicesPage();
  await accountServicesPage.navigateToOpenNewAccount();

  await openAccountPage.openAccount();
  await openAccountPage.verifyAccountOpened();
  const initialBalance = await openAccountPage.verifyAccountBalance();

  // Perform multiple fund transfers
  await accountServicesPage.navigateToTransferFunds();
  await transferFundsPage.verifyTransferFundsPage();
  await transferFundsPage.submitTransfer();
  await transferFundsPage.verifyTransferSuccess();

  // Perform bill payment
  await accountServicesPage.navigateToBillPay();
  const accountId = await billPayPage.submitPayment();
  await billPayPage.verifyBillPaymentSuccess();

  // Get session for API calls
  let sessionId = sessionManager.getSessionId();
  if (!sessionId) {
    sessionId = await sessionManager.getSessionIdFromCookies(page);
  }

  if (sessionId) {
    transactionAPI.setSessionId(sessionId);
  }

  // Fetch and validate transactions
  const transactionResponse = await transactionAPI.getAccountTransactions(parseInt(accountId));

  // Validate API response
  expect(transactionResponse.statusCode).toBe(200);
  expect(transactionResponse.transactions.length).toBeGreaterThan(0);

  // Validate all transactions have required fields
  transactionResponse.transactions.forEach(transaction => {
    expect(transaction.id).toBeDefined();
    expect(transaction.accountId).toBe(parseInt(accountId));
    expect(transaction.type).toMatch(/^(Credit|Debit)$/);
    expect(transaction.amount).toBeGreaterThan(0);
    expect(transaction.description).toBeTruthy();
    expect(transaction.date).toBeDefined();
  });

  // Validate transaction amounts are positive numbers
  const allAmountsPositive = transactionResponse.transactions.every(
    t => t.amount > 0
  );
  expect(allAmountsPositive).toBe(true);

  // Validate transaction dates are recent (within last 24 hours)
  const now = Date.now();
  const oneDayAgo = now - (24 * 60 * 60 * 1000);
  const allDatesRecent = transactionResponse.transactions.every(
    t => t.date >= oneDayAgo && t.date <= now
  );
  expect(allDatesRecent).toBe(true);

  // Validate both Credit and Debit transactions exist
  const hasCredit = transactionResponse.transactions.some(t => t.type === 'Credit');
  const hasDebit = transactionResponse.transactions.some(t => t.type === 'Debit');
  expect(hasCredit).toBe(true);
  expect(hasDebit).toBe(true);

  // Calculate total credits and debits
  const totalCredits = transactionResponse.transactions
    .filter(t => t.type === 'Credit')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDebits = transactionResponse.transactions
    .filter(t => t.type === 'Debit')
    .reduce((sum, t) => sum + t.amount, 0);

  // Validate that we have both credits and debits with amounts
  expect(totalCredits).toBeGreaterThan(0);
  expect(totalDebits).toBeGreaterThan(0);

  // Verify transaction types using API helper
  expect(transactionAPI.verifyTransactionTypes(
    transactionResponse.transactions,
    ['Credit', 'Debit']
  )).toBe(true);

  // Verify specific transaction descriptions exist
  expect(transactionAPI.verifyTransactionDescriptions(
    transactionResponse.transactions,
    ['Funds Transfer', 'Bill Payment']
  )).toBe(true);

  // Validate transaction count matches expected operations
  // At minimum: fund transfer + bill payment
  expect(transactionResponse.transactions.length).toBeGreaterThanOrEqual(2);

  await accountServicesPage.logOut();
  await loginPage.verifyLoginPage();
});
