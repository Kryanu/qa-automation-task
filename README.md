# QA Automation Task

Playwright + TypeScript test suite covering:

- **FE** — end-to-end UI tests for [saucedemo.com](https://www.saucedemo.com/) (login, checkout).
- **API** — API-level tests for the [Swagger Petstore](https://petstore.swagger.io/v2/swagger.json) demo service (pet, store/order endpoints).

For architecture decisions and design rationale, see:

- [REPORT.md](REPORT.md) — FE suite report
- [API_REPORT.md](API_REPORT.md) — API suite report

## Prerequisites

- Node.js
- Run `npx playwright install` once to download browser binaries.

## Setup

```bash
npm install
npx playwright install
```

## Project Structure

```
src/
  FE/
    login/     # Login page helpers, selectors, test data, specs
    checkout/  # Cart/checkout helpers, selectors, test data, specs
  API/
    pet.ts / pet.spec.ts       # Pet endpoint helpers and tests
    store.ts / store.spec.ts   # Store/order endpoint helpers and tests
playwright.config.ts
```

## Running Tests

```bash
npm test                  # run all tests headless, all browsers
npm run test:ui           # Playwright UI mode
npm run test:headed       # headed mode
npm run test:debug        # step-through debug mode

npx playwright test src/FE/checkout/checkout.spec.ts   # single file
npx playwright test src/API                            # API tests only
npx playwright test -g "test name"                     # filter by test name
```

## Reports

After a run, view the HTML report with:

```bash
npx playwright show-report
```
