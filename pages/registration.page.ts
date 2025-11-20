/**
 * Registration Page Object
 * Handles all interactions with the registration page
 */

import { Page, Locator } from '@playwright/test';
import { testData } from '../config/test-data';
import { generateUniquePhoneNumber, generateUniqueSSN, generateUniqueUsername } from '../utils/data-generator';

export class RegistrationPage {
  readonly page: Page;
  readonly registerLink: Locator;
  readonly customerLoginHeading: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly streetInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly zipCodeInput: Locator;
  readonly phoneNumberInput: Locator;
  readonly ssnInput: Locator;
  readonly customerUsernameInput: Locator;
  readonly customerPasswordInput: Locator;
  readonly repeatedPasswordInput: Locator;
  readonly registerButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.registerLink = page.getByRole('link', { name: 'Register' });
    this.customerLoginHeading = page.getByRole('heading', { name: 'Customer Login' });
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.getByRole('button', { name: 'Log In' });
    this.firstNameInput = page.locator('[id="customer.firstName"]');
    this.lastNameInput = page.locator('[id="customer.lastName"]');
    this.streetInput = page.locator('[id="customer.address.street"]');
    this.cityInput = page.locator('[id="customer.address.city"]');
    this.stateInput = page.locator('[id="customer.address.state"]');
    this.zipCodeInput = page.locator('[id="customer.address.zipCode"]');
    this.phoneNumberInput = page.locator('[id="customer.phoneNumber"]');
    this.ssnInput = page.locator('[id="customer.ssn"]');
    this.customerUsernameInput = page.locator('[id="customer.username"]');
    this.customerPasswordInput = page.locator('[id="customer.password"]');
    this.repeatedPasswordInput = page.locator('#repeatedPassword');
    this.registerButton = page.getByRole('button', { name: 'Register' });
  }

  async navigateToRegistration(): Promise<void> {
    await this.page.goto('/parabank/register.htm');
  }

  async verifyRegistrationPageElements(): Promise<void> {
    await this.registerLink.waitFor({ state: 'visible' });
    await this.customerLoginHeading.waitFor({ state: 'visible' });
    await this.usernameInput.waitFor({ state: 'visible' });
    await this.passwordInput.waitFor({ state: 'visible' });
    await this.loginButton.waitFor({ state: 'visible' });
  }

  async fillRegistrationForm(): Promise<{ username: string; phoneNumber: string; ssn: string }> {
    const phoneNumber = generateUniquePhoneNumber();
    const ssn = generateUniqueSSN();
    const username = generateUniqueUsername();

    await this.firstNameInput.fill(testData.customer.firstName);
    await this.lastNameInput.fill(testData.customer.lastName);
    await this.streetInput.fill(testData.customer.address.street);
    await this.cityInput.fill(testData.customer.address.city);
    await this.stateInput.fill(testData.customer.address.state);
    await this.zipCodeInput.fill(testData.customer.address.zipCode);
    await this.phoneNumberInput.fill(phoneNumber);
    await this.ssnInput.fill(ssn);
    await this.customerUsernameInput.fill(username);
    await this.customerPasswordInput.fill(testData.customer.password);
    await this.repeatedPasswordInput.fill(testData.customer.password);

    return { username, phoneNumber, ssn };
  }

  async submitRegistration(): Promise<void> {
    await this.registerButton.click();
  }

  async completeRegistration(): Promise<{ username: string; phoneNumber: string; ssn: string }> {
    await this.verifyRegistrationPageElements();
    const formData = await this.fillRegistrationForm();
    await this.submitRegistration();
    return formData;
  }
}

