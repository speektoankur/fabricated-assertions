/**
 * Login Page Object
 * Handles interactions with the login page
 */

import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly customerLoginHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.customerLoginHeading = page.getByRole('heading', { name: 'Customer Login' });
  }

  async verifyLoginPage(): Promise<void> {
    await this.customerLoginHeading.waitFor({ state: 'visible' });
  }
}

