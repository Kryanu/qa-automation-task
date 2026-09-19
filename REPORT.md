# QA Automation Task — Report

## Overview

This project is a Playwright + TypeScript end-to-end test suite for [saucedemo.com](https://www.saucedemo.com/), covering the login flow and the full checkout flow (add to cart → cart → checkout info form → checkout complete).

## Tech Stack

- **Playwright Test** (`@playwright/test`) as the test runner and assertion library.
- **TypeScript** for type safety across page helpers, fixtures, and test data.
- Projects configured for **Chromium, Firefox, and WebKit** so the suite runs cross-browser by default.

## Project Structure

```
src/
  login/
    login.ts        # Login page helpers, selectors, and test data
    login.d.ts       # Shared types (User, FailedCase)
    login.spec.ts    # Login test cases
  checkout/
    checkout.ts           # Cart/checkout helpers, selectors, and test data
    checkout.spec.ts       # Cart flow tests
    checkout-form.spec.ts  # Checkout info form validation tests
```

Tests are colocated with their feature area (`login/`, `checkout/`) rather than in a single flat `tests/` folder, so selectors, test data, and helper functions for a feature live next to the specs that use them.

## Architecture Choices

### 1. Selector constants over magic strings

Each feature exposes an `Ids` object (`LoginPageIds`, `CheckoutIds`) mapping semantic names to the app's `data-test` attributes:

```ts
export const CheckoutIds = {
  addBackpack: 'add-to-cart-sauce-labs-backpack',
  checkoutLink: 'shopping-cart-link',
  ...
};
```

This avoids duplicating raw string selectors across tests, keeps selectors refactor-safe (one place to update if the app's test IDs change), and makes test code read as intent (`CheckoutIds.checkout`) rather than implementation detail.

The `testIdAttribute` in [playwright.config.ts](playwright.config.ts) is set to `'data-test'` to match the app's actual attribute (saucedemo uses `data-test`, not Playwright's default `data-testid`), so `page.getByTestId(...)` works directly against these constants.

### 2. Flow helpers instead of repeating steps per test

Common multi-step flows are extracted into reusable async functions rather than repeated in every test:

- `LoginFlow(page, user)` — navigates to the site and logs in.
- `addItemsToShoppingCart(page, override?)` — clicks "add to cart" for a default or custom set of items, returning the count added.
- `SetupCheckout(page, items?)` — composes login + add-to-cart, since almost every checkout test needs a logged-in cart.
- `NavigateTIllLastStep(page, user)` — composes `SetupCheckout` + navigating to the checkout form + filling it + continuing, for tests that only care about the final step.

This keeps individual tests focused on the behavior under test (e.g. form validation) instead of re-implementing setup steps, and centralizes fixes (e.g. an await bug or a selector change) in one function instead of N test files.

### 3. Data-driven tests for validation/error cases

Instead of writing a separate test per validation rule, error cases are modeled as data (`ContinueCase[]`, `FailedCase[]`) with a case name, input, and expected error message, then looped over with `for (const case of cases) { test(...) }`:

```ts
export const continueCases: ContinueCase[] = [
  { user: { firstName: '', lastName: 'A', postalCode: 'A' },
    expectedErrorMsg: 'Error: First Name is required',
    caseName: 'Empty first name should block navigation' },
  ...
];
```

Adding a new negative case is a one-line data addition, not a new test function, and the `caseName` becomes the Playwright test title so failures are still individually reported.

### 4. Web-first (auto-retrying) assertions

All assertions use Playwright's async, auto-retrying matchers (`await expect(locator).toHaveText(...)`, `await expect(page).toHaveURL(...)`, `await expect(locator).toHaveCount(...)`) rather than reading values once and comparing them synchronously (e.g. `.innerText()` + `expect(x).toEqual(y)`). This avoids flakiness from timing/race conditions between the UI updating and the assertion running, since Playwright will retry the check until it passes or times out, instead of taking a single snapshot.

### 5. Types for test data shape

`UserDetails`, `ContinueCase` (checkout) and `User`, `FailedCase` (login) are small interfaces describing the shape of data-driven test cases. Keeping these as explicit types catches malformed test data at compile time (e.g. a missing field in a new case) and gives autocomplete when adding cases.

## Running the Tests

```bash
npm test                 # run all tests headless, all 3 browsers
npm run test:ui           # Playwright UI mode
npm run test:headed       # headed mode
npm run test:debug        # step-through debug mode
npx playwright test src/checkout/checkout.spec.ts   # single file
npx playwright test -g "test name"                  # filter by test name
```

## Possible Future Improvements

- Extract a small `BASE_URL` constant instead of repeating `https://www.saucedemo.com/...` across assertions.

## Cases not covered
- Removing of items from the cart
- Actually checking the checkout page and not just the URL
- Clicking checkout with no items 
    - N.B: User can go to an empty checkout page with no items, UI seems "broken". Raises some questions if it is the expcted behaviour
- Refreshing with items selected, should keep those items available
- Navigating after Session has timed out