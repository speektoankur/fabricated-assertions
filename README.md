# Fabricated Assertions - Test Automation Framework

A comprehensive end-to-end test automation framework built with Playwright and TypeScript for testing banking application workflows. This framework implements the Page Object Model (POM) pattern and includes both UI and API testing capabilities.

## 📁 Repository Structure

```
fabricated-assertions/
├── api/                          # API testing modules
│   ├── models/                   # TypeScript models/interfaces
│   │   └── transaction.model.ts  # Transaction data models
│   └── transaction-api.ts        # API client for transaction operations
│
├── config/                       # Configuration files
│   ├── env.config.ts            # Environment configuration (dev/staging/prod)
│   └── test-data.ts             # Test data constants and fixtures
│
├── pages/                        # Page Object Model classes
│   ├── account-services.page.ts # Account services page interactions
│   ├── bill-pay.page.ts         # Bill payment page interactions
│   ├── login.page.ts            # Login page interactions
│   ├── open-account.page.ts     # Account opening page interactions
│   ├── registration.page.ts     # User registration page interactions
│   └── transfer-funds.page.ts   # Funds transfer page interactions
│
├── tests/                        # Test specifications
│   └── account-creation-transactions.spec.ts  # Main test suite
│
├── utils/                        # Utility functions
│   ├── data-generator.ts        # Data generation utilities (SSN, username, etc.)
│   └── session-manager.ts       # Session management utilities
│
├── playwright.config.ts         # Playwright test configuration
├── package.json                 # Node.js dependencies and scripts
└── README.md                    # This file
```

## 🏗️ Architecture Overview

### Page Object Model (POM)
The framework follows the Page Object Model pattern where each web page has a corresponding class that encapsulates all page-specific interactions and locators. This promotes code reusability and maintainability.

### API Testing
The framework includes API testing capabilities to validate backend transactions and data integrity, complementing the UI tests.

### Utilities
- **Data Generator**: Generates unique test data (SSNs, usernames, phone numbers)
- **Session Manager**: Handles session management and cookie extraction for API authentication

## 📋 Prerequisites

Before running the tests, ensure you have the following installed:

- **Node.js**: Version 16 or higher ([Download Node.js](https://nodejs.org/))
- **npm**: Comes bundled with Node.js
- **Git**: For cloning the repository (if applicable)

## 🚀 Installation

1. **Clone the repository** (if applicable):
   ```bash
   git clone <repository-url>
   cd fabricated-assertions
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Install Playwright browsers**:
   ```bash
   npx playwright install
   ```
   
   Or install only Chromium (used in current configuration):
   ```bash
   npx playwright install chromium
   ```

## 🧪 Running Tests Locally

### Run All Tests

To run all tests in the project:

```bash
npx playwright test
```

### Run Tests in UI Mode

To run tests with the Playwright UI mode (interactive test runner):

```bash
npx playwright test --ui
```

### Run Tests in Headed Mode

To run tests with the browser visible (useful for debugging):

```bash
npx playwright test --headed
```

### Run a Specific Test File

To run a specific test file:

```bash
npx playwright test tests/account-creation-transactions.spec.ts
```

### Run Tests with Debug Mode

To run tests in debug mode (step through tests):

```bash
npx playwright test --debug
```

### Run Tests in a Specific Browser

Currently configured to run on Chromium. To run on other browsers, uncomment the respective project in `playwright.config.ts` and run:

```bash
npx playwright test --project=chromium
# or
npx playwright test --project=firefox
# or
npx playwright test --project=webkit
```

## 📊 Viewing Test Reports

After running tests, you can view the HTML report:

```bash
npx playwright show-report
```

This will open an interactive HTML report showing:
- Test execution results
- Screenshots (on failure)
- Videos (recorded on retry)
- Traces (for debugging)

## ⚙️ Configuration

### Environment Configuration

The framework supports multiple environments. Configure the environment in `config/env.config.ts`:

- **Default**: `dev` environment
- **Set environment**: Use the `ENV` environment variable:
  ```bash
  ENV=staging npx playwright test
  ENV=prod npx playwright test
  ```

### Playwright Configuration

Key settings in `playwright.config.ts`:

- **Test Directory**: `./tests`
- **Parallel Execution**: Enabled by default
- **Retries**: 2 retries on CI, 0 locally
- **Reporter**: HTML reporter
- **Video**: Recorded on retry
- **Screenshots**: Captured only on failure
- **Trace**: Collected on first retry

## 📝 Test Structure

### Current Test Suite

The main test suite (`account-creation-transactions.spec.ts`) performs:

1. **User Registration**: Creates a new user account
2. **Account Creation**: Opens a new bank account
3. **Funds Transfer**: Transfers funds between accounts
4. **Bill Payment**: Processes a bill payment
5. **API Validation**: Verifies transactions via API calls

### Writing New Tests

To add new tests:

1. Create or update page objects in the `pages/` directory
2. Add test specifications in the `tests/` directory
3. Use the existing page objects and utilities for consistency

Example test structure:
```typescript
import { test, expect } from '@playwright/test';
import { YourPageObject } from '../pages/your-page.page';

test('Your test description', async ({ page }) => {
  const pageObject = new YourPageObject(page);
  // Your test steps
});
```

## 🔧 Available Scripts

Currently, the project uses Playwright CLI directly. You can add custom scripts to `package.json`:

```json
{
  "scripts": {
    "test": "playwright test",
    "test:ui": "playwright test --ui",
    "test:headed": "playwright test --headed",
    "test:debug": "playwright test --debug",
    "report": "playwright show-report"
  }
}
```

Then run:
```bash
npm test
npm run test:ui
npm run test:headed
```

## 🐛 Troubleshooting

### Browser Installation Issues

If browsers are not installed:
```bash
npx playwright install
```

### Test Failures

1. Check the HTML report for detailed error messages
2. Review screenshots in `test-results/` directory
3. Check videos in `test-results/` for visual debugging
4. Ensure the application under test is accessible

### Environment Issues

- Verify the base URL in `config/env.config.ts` is correct
- Check network connectivity to the test environment
- Ensure all required environment variables are set

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright TypeScript Guide](https://playwright.dev/docs/test-typescript)
- [Page Object Model Best Practices](https://playwright.dev/docs/pom)

## 📄 License

ISC

