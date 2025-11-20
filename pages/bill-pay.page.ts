/**
 * Bill Pay Page Object
 * Handles interactions for bill payment functionality
 */

import { Page, Locator, expect } from '@playwright/test';
import { testData } from '../config/test-data';
import { generateUniquePhoneNumber } from '../utils/data-generator';

export class BillPayPage {
  readonly page: Page;
  readonly payeeNameInput: Locator;
  readonly payeeStreetInput: Locator;
  readonly payeeCityInput: Locator;
  readonly payeeStateInput: Locator;
  readonly payeeZipCodeInput: Locator;
  readonly payeePhoneNumberInput: Locator;
  readonly payeeAccountNumberInput: Locator;
  readonly verifyAccountInput: Locator;
  readonly amountInput: Locator;
  readonly fromAccountIdSelect: Locator;
  readonly sendPaymentButton: Locator;
  readonly billPaymentCompleteHeading: Locator;
  readonly billPayResult: Locator;

  constructor(page: Page) {
    this.page = page;
    this.payeeNameInput = page.locator('input[name="payee.name"]');
    this.payeeStreetInput = page.locator('input[name="payee.address.street"]');
    this.payeeCityInput = page.locator('input[name="payee.address.city"]');
    this.payeeStateInput = page.locator('input[name="payee.address.state"]');
    this.payeeZipCodeInput = page.locator('input[name="payee.address.zipCode"]');
    this.payeePhoneNumberInput = page.locator('input[name="payee.phoneNumber"]');
    this.payeeAccountNumberInput = page.locator('input[name="payee.accountNumber"]');
    this.verifyAccountInput = page.locator('input[name="verifyAccount"]');
    this.amountInput = page.locator('input[name="amount"]');
    this.fromAccountIdSelect = page.locator('select[name="fromAccountId"]');
    this.sendPaymentButton = page.getByRole('button', { name: 'Send Payment' });
    this.billPaymentCompleteHeading = page.getByRole('heading', { name: testData.expectedMessages.billPayComplete });
    this.billPayResult = page.locator('#billpayResult');
  }

  async fillPayeeInformation(useUniquePhone: boolean = false): Promise<void> {
    const phoneNumber = useUniquePhone ? generateUniquePhoneNumber() : '78389283744';
    
    await this.payeeNameInput.fill(testData.payee.name);
    await this.payeeStreetInput.fill(testData.payee.address.street);
    await this.payeeCityInput.fill(testData.payee.address.city);
    await this.payeeStateInput.fill(testData.payee.address.state);
    await this.payeeZipCodeInput.fill(testData.payee.address.zipCode);
    await this.payeePhoneNumberInput.fill(phoneNumber);
    await this.payeeAccountNumberInput.fill(testData.payee.accountNumber);
    await this.verifyAccountInput.fill(testData.payee.accountNumber);
  }

  async enterPaymentAmount(amount: string = testData.account.billPayAmount): Promise<void> {
    await this.amountInput.fill(amount);
  }

  async submitPayment(amount: string = testData.account.billPayAmount, useUniquePhone: boolean = false): Promise<string> {
    await this.fillPayeeInformation(useUniquePhone);
    await this.enterPaymentAmount(amount);
    
    const selectedAccountId = await this.fromAccountIdSelect.inputValue();
    console.log(`Selected Account ID: ${selectedAccountId}`);
    
    await this.page.waitForTimeout(1000);
    
    await this.sendPaymentButton.click({ clickCount: 1 });
    
    return selectedAccountId;
  }

  async verifyBillPaymentSuccess(expectedAmount: string = testData.account.billPayAmount): Promise<void> {
    await this.billPaymentCompleteHeading.waitFor({ state: 'visible' });
    
    const resultText = await this.billPayResult.textContent();
    expect(resultText).toContain(testData.expectedMessages.billPaySuccess);
    expect(resultText).toContain(`$${expectedAmount}.00`);
  }
}

