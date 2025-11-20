/**
 * Transfer Funds Page Object
 * Handles interactions for transferring funds between accounts
 */

import { Page, Locator, expect } from '@playwright/test';
import { testData } from '../config/test-data';

export class TransferFundsPage {
  readonly page: Page;
  readonly transferFundsHeading: Locator;
  readonly amountInput: Locator;
  readonly transferButton: Locator;
  readonly transferSuccessMessage: Locator;
  readonly accountActivityMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.transferFundsHeading = page.getByRole('heading', { name: 'Transfer Funds' });
    this.amountInput = page.locator('#amount');
    this.transferButton = page.getByRole('button', { name: 'Transfer' });
    this.transferSuccessMessage = page.getByText(testData.expectedMessages.transferSuccess);
    this.accountActivityMessage = page.getByText('See Account Activity for more');
  }

  async verifyTransferFundsPage(): Promise<void> {
    await this.transferFundsHeading.waitFor({ state: 'visible' });
  }

  async enterTransferAmount(amount: string = testData.account.transferAmount): Promise<void> {
    await this.amountInput.fill(amount);
  }

  async submitTransfer(amount: string = testData.account.transferAmount): Promise<void> {
    await this.enterTransferAmount(amount);
    await this.page.waitForTimeout(1000);
    await this.transferButton.click();
  }

  async verifyTransferSuccess(expectedAmount: string = testData.account.transferAmount): Promise<void> {
    const expectedMessage = `$${expectedAmount}.00 ${testData.expectedMessages.transferSuccess}`;
    await this.transferSuccessMessage.waitFor({ state: 'visible' });
    await this.accountActivityMessage.waitFor({ state: 'visible' });
    
    const messageText = await this.transferSuccessMessage.textContent();
    if (messageText) {
      expect(messageText).toContain(`$${expectedAmount}.00`);
    }
  }
}

