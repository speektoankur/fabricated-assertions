/**
 * Open New Account Page Object
 * Handles interactions for opening a new account
 */

import { Page, Locator, expect } from '@playwright/test';
import { testData } from '../config/test-data';

export class OpenAccountPage {
  readonly page: Page;
  readonly accountTypeSelect: Locator;
  readonly openAccountButton: Locator;
  readonly accountOpenedHeading: Locator;
  readonly congratulationsMessage: Locator;
  readonly newAccountIdLink: Locator;
  readonly balance: Locator;
  readonly availableBalance: Locator;
  readonly transactionTable: Locator;

  constructor(page: Page) {
    this.page = page;
    this.accountTypeSelect = page.locator('#type');
    this.openAccountButton = page.getByRole('button', { name: 'Open New Account' });
    this.accountOpenedHeading = page.getByRole('heading', { name: testData.expectedMessages.accountOpened });
    this.congratulationsMessage = page.getByText(testData.expectedMessages.congratulations);
    this.newAccountIdLink = page.locator('#newAccountId');
    this.balance = page.getByRole('row', { name: /Balance:/ }).getByRole('cell').nth(1);
    this.availableBalance = page.getByRole('row', { name: /Available:/ }).getByRole('cell').nth(1);
    this.transactionTable = page.locator('#transactionTable');
  }

  async selectAccountType(accountType: string = testData.account.accountType): Promise<void> {
    await this.page.waitForTimeout(1000);
    await this.accountTypeSelect.selectOption(accountType);
  }

  async openAccount(accountType: string = testData.account.accountType): Promise<void> {
    await this.selectAccountType(accountType);
    await this.openAccountButton.click();
  }

  async verifyAccountOpened(): Promise<void> {
    await this.accountOpenedHeading.waitFor({ state: 'visible' });
    await this.congratulationsMessage.waitFor({ state: 'visible' });
  }

  async verifyAccountBalance(expectedBalance: string = `$${testData.account.initialBalance}`): Promise<void> {
    await this.newAccountIdLink.click();
    await this.page.waitForLoadState('networkidle');
    await this.balance.waitFor({ state: 'visible' });
    await this.availableBalance.waitFor({ state: 'visible' });
    
    const balanceText = await this.balance.textContent();
    const availableBalanceText = await this.availableBalance.textContent();
    
    expect(balanceText?.trim()).toContain(expectedBalance);
    expect(availableBalanceText?.trim()).toContain(expectedBalance);
  }

  async getAccountBalance(): Promise<string> {
    await this.balance.waitFor({ state: 'visible' });
    const balanceText = await this.balance.textContent();
    return balanceText?.trim() || '';
  }

  async getAvailableBalance(): Promise<string> {
    await this.availableBalance.waitFor({ state: 'visible' });
    const availableBalanceText = await this.availableBalance.textContent();
    return availableBalanceText?.trim() || '';
  }
}

