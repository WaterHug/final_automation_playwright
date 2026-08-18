# Playwright E-commerce Test Automation Project

This project demonstrates robust end-to-end test automation for an e-commerce application using Playwright and TypeScript. It follows modern testing practices, including the Page Object Model, data-driven testing, API-based test data management, and CI/CD integration with GitHub Actions.

## Features

*   **End-to-End Testing:** Comprehensive test coverage for key e-commerce flows.
*   **Page Object Model (POM):** Maintainable and reusable page objects for UI interactions.
*   **Data-Driven Testing:** Tests are parameterized using external JSON data for flexibility and reusability.
*   **API-based Test Data Management:** Efficient setup and cleanup of test data (e.g., user carts, orders, profiles) via API calls, ensuring test independence and a clean state.
*   **Hooks:** `beforeEach` and `afterEach` hooks for consistent test setup and teardown.
*   **Allure Reports:** Detailed and interactive test reports for better test analysis and visualization.
*   **GitHub Actions:** Automated test execution on every push and pull request for continuous integration.
*   **Screenshot on Failure:** Automatically captures screenshots for failed tests to aid debugging.
*   **Browser Support:** Configured to run tests specifically on Chromium (Chrome).

## Tech Stack

*   **Test Framework:** Playwright
*   **Language:** TypeScript
*   **Reporting:** Allure Report, Playwright HTML Reporter
*   **CI/CD:** GitHub Actions
*   **Package Manager:** npm

## Prerequisites

Before you begin, ensure you have the following installed:

*   [Node.js](https://nodejs.org/en/download/) (LTS version recommended, e.g., v20.x)
*   [npm](https://www.npmjs.com/get-npm) (comes with Node.js)
*   [Git](https://git-scm.com/downloads)

## Installation

1.  **Clone the repository:**
    ```bash
    git clone YOUR_GITHUB_REPO_URL
    cd final_test
    ```
    (Replace `YOUR_GITHUB_REPO_URL` with the actual URL of your GitHub repository.)

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Install Playwright browsers:**
    ```bash
    npx playwright install --with-deps
    ```

## Project Structure

```
final_test/
├── .github/                     # GitHub Actions workflows
│   └── workflows/
│       └── playwright.yml       # CI/CD workflow for Playwright tests
├── core/                        # Core utilities and helpers
│   ├── api/                     # API helper for data setup/cleanup
│   ├── fixtures/                # Playwright fixtures
│   └── utils/                   # General utilities (e.g., Logger)
├── env/                         # Environment-related files
│   ├── test-data/               # External JSON test data files
│   │   ├── checkoutData.json
│   │   └── testData.json
│   └── env.ts                   # Environment variables
├── page-objects/                # Page Object Model classes
│   ├── BasePage.ts
│   ├── CartPage.ts
│   ├── CheckoutPage.ts
│   ├── LoginPage.ts
│   ├── ProductPage.ts
│   └── ProfilePage.ts
├── tests/                       # Playwright test
│   ├── scenario1.spec.ts
│   ├── scenario2.spec.ts
│   ├── scenario3.spec.ts
│   ├── scenario4.spec.ts
│   ├── scenario5.spec.ts
│   ├── scenario6.spec.ts
├── playwright.config.ts         # Playwright test configuration
├── tsconfig.json                # TypeScript configuration
├── package.json
├── package-lock.json
└── README.md                    # This file
```

## Running Tests

### Run all tests (on Chromium only)

```bash
npx playwright test
```

### Run a specific test file

```bash
npx playwright test tests/scenario2.spec.ts
```

### Run tests with UI mode (interactive debugging)

```bash
npx playwright test --ui
```

## Viewing Reports

### Playwright HTML Report

After running tests, you can open the Playwright HTML report:

```bash
npx playwright show-report
```

### Allure Report

1.  **Generate Allure results:**
    ```bash
    npx playwright test
    ```
    (This will create an `allure-results` directory.)

2.  **Generate the HTML report from results:**
    ```bash
    npx allure generate allure-results --clean -o allure-report
    ```

3.  **Open the Allure report in your browser:**
    ```bash
    npx allure open allure-report
    ```

## GitHub Actions

The project is configured with GitHub Actions. Tests will automatically run on `push` to `main`/`master` branches and on `pull_request` events.

*   **Workflow file:** `.github/workflows/playwright.yml`
*   **Artifacts:** The workflow uploads Playwright HTML reports, Allure reports, and raw test results as artifacts, which can be downloaded from the GitHub Actions run summary.

---
