/**
 * Account Services Page Object
 * Handles interactions with the account services dashboard
 */

import { Page, Locator } from '@playwright/test';
import { testData } from '../config/test-data';

export class AccountServicesPage {
  readonly page: Page;
  readonly accountCreatedMessage: Locator;
  readonly accountServicesHeading: Locator;
  readonly openNewAccountLink: Locator;
  readonly accountsOverviewLink: Locator;
  readonly transferFundsLink: Locator;
  readonly billPayLink: Locator;
  readonly findTransactionsLink: Locator;
  readonly updateContactInfoLink: Locator;
  readonly requestLoanLink: Locator;
  readonly logOutLink: Locator;
  readonly servicesLink: Locator;
  readonly productsLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.accountCreatedMessage = page.getByText(testData.expectedMessages.accountCreated);
    this.accountServicesHeading = page.getByRole('heading', { name: 'Account Services' });
    this.openNewAccountLink = page.getByRole('link', { name: testData.navigationLinks.openNewAccount });
    this.accountsOverviewLink = page.getByRole('link', { name: testData.navigationLinks.accountsOverview });
    this.transferFundsLink = page.getByRole('link', { name: testData.navigationLinks.transferFunds });
    this.billPayLink = page.getByRole('link', { name: testData.navigationLinks.billPay });
    this.findTransactionsLink = page.getByRole('link', { name: testData.navigationLinks.findTransactions });
    this.updateContactInfoLink = page.getByRole('link', { name: testData.navigationLinks.updateContactInfo });
    this.requestLoanLink = page.getByRole('link', { name: testData.navigationLinks.requestLoan });
    this.logOutLink = page.getByRole('link', { name: testData.navigationLinks.logOut });
    this.servicesLink = page.locator('#headerPanel').getByRole('link', { name: testData.navigationLinks.services });
    this.productsLink = page.locator('#headerPanel').getByRole('link', { name: testData.navigationLinks.products });
  }

  async verifyAccountServicesPage(): Promise<void> {
    await this.accountCreatedMessage.waitFor({ state: 'visible' });
    await this.accountServicesHeading.waitFor({ state: 'visible' });
    
    const navigationLinks = [
      this.openNewAccountLink,
      this.accountsOverviewLink,
      this.transferFundsLink,
      this.billPayLink,
      this.findTransactionsLink,
      this.updateContactInfoLink,
      this.requestLoanLink,
      this.logOutLink,
    ];

    for (const link of navigationLinks) {
      await link.waitFor({ state: 'visible' });
    }

    await this.servicesLink.waitFor({ state: 'visible' });
    await this.productsLink.waitFor({ state: 'visible' });
  }

  async navigateToOpenNewAccount(): Promise<void> {
    await this.openNewAccountLink.click();
  }

  async navigateToTransferFunds(): Promise<void> {
    await this.transferFundsLink.click();
  }

  async navigateToBillPay(): Promise<void> {
    await this.billPayLink.click();
  }

  async logOut(): Promise<void> {
    await this.logOutLink.click();
  }
}

