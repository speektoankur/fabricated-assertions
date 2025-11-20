/**
 * Test Data Configuration
 * Centralized test data for all test scenarios
 */

export interface CustomerData {
  firstName: string;
  lastName: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  phoneNumber: string;
  ssn: string;
  username: string;
  password: string;
}

export interface PayeeData {
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  phoneNumber: string;
  accountNumber: string;
}

export interface AccountData {
  initialBalance: string;
  transferAmount: string;
  billPayAmount: string;
  accountType: string;
}

export const testData = {
  customer: {
    firstName: 'Shane',
    lastName: 'Warne',
    address: {
      street: 'Front Foot Road',
      city: 'Brisbane',
      state: 'Melbourne',
      zipCode: '160020',
    },
    password: 'Infy@123',
  },
  payee: {
    name: 'BillDesk',
    address: {
      street: 'Brisbane',
      city: 'Perth',
      state: 'Melbourne',
      zipCode: '160020',
    },
    accountNumber: '20115',
  },
  account: {
    initialBalance: '100.00',
    transferAmount: '50',
    billPayAmount: '50',
    accountType: '1',
  },
  expectedMessages: {
    accountCreated: 'Your account was created',
    accountOpened: 'Account Opened!',
    congratulations: 'Congratulations, your account',
    transferSuccess: 'has been transferred',
    billPayComplete: 'Bill Payment Complete',
    billPaySuccess: 'Bill Payment to BillDesk in the amount of',
  },
  navigationLinks: {
    openNewAccount: 'Open New Account',
    accountsOverview: 'Accounts Overview',
    transferFunds: 'Transfer Funds',
    billPay: 'Bill Pay',
    findTransactions: 'Find Transactions',
    updateContactInfo: 'Update Contact Info',
    requestLoan: 'Request Loan',
    logOut: 'Log Out',
    services: 'Services',
    products: 'Products',
  },
};

