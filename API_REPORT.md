# API Test Suite — Report

## Overview

This suite covers API-level tests for the [Swagger Petstore](https://petstore.swagger.io/v2/swagger.json) demo service, exercising the `pet` and `store` resources over HTTP directly (no browser/UI involved).

Covered endpoints:

- `POST /pet` — create a pet
- `GET /pet/{petId}` — fetch a pet by id
- `POST /store/order` — place an order
- `DELETE /store/order/{orderId}` — delete an order

## Tech Stack

- **Playwright Test**'s built-in `request` fixture (`APIRequestContext`) for HTTP calls — no extra HTTP client dependency needed since Playwright already ships one.
- **TypeScript** interfaces mirroring the Swagger schema (`Pet`, `Category`, `Tag`, `Order`) for compile-time safety on request/response shapes.

## Project Structure

```
src/API/
  pet.ts          # Pet types, buildPet() factory, createPet()/getPetById() helpers
  pet.spec.ts     # Tests for POST /pet and GET /pet/{petId}
  store.ts        # Order types, buildOrder() factory, placeOrder()/deleteOrder() helpers
  store.spec.ts   # Tests for POST /store/order and DELETE /store/order/{orderId}
```

This mirrors the pattern used in the FE suite (`src/FE/login`, `src/FE/checkout`): a plain `.ts` file holding types + reusable request helpers, next to a `.spec.ts` with the actual test cases.

## Architecture Choices

### 1. `request` fixture over a custom HTTP client

Playwright's `request` fixture gives an isolated `APIRequestContext` per test, with built-in JSON handling, response status/body helpers (`response.ok()`, `response.status()`, `response.json()`), and no need for `axios`/`node-fetch` as a dependency.

### 2. Typed request/response models generated from the Swagger schema

`Pet` and `Order` interfaces (in [pet.ts](src/API/pet.ts) and [store.ts](src/API/store.ts)) mirror the Swagger `definitions` for those schemas (required fields, enums for `status`, nested `Category`/`Tag`). This catches malformed test data at compile time and documents the contract the tests assume, without needing to open the Swagger doc while writing tests.

### 3. Data factories instead of hardcoded literals per test

`buildPet(overrides?)` and `buildOrder(overrides?)` return a valid default object (using `Date.now()` for the id to avoid collisions between test runs against the shared public demo server) and accept a `Partial<T>` to override just the fields relevant to a given test:

```ts
const pet = buildPet({ name: 'Rex' });
```

This keeps each test's arrange step to one line while still allowing full control when a test needs specific field values.

### 4. Thin request helpers, not a full API client class

`createPet`, `getPetById`, `placeOrder`, `deleteOrder` are plain functions taking `(request, ...args)` and returning the raw Playwright `APIResponse`, rather than a wrapping client class that parses/throws internally. Tests get direct access to `response.status()`/`response.json()`, keeping assertions explicit and avoiding an abstraction that would need to be extended for every new assertion style (headers, status-only checks, etc).

### 5. Base URL colocated with the helpers

`BASE_URL = 'https://petstore.swagger.io/v2'` lives in [pet.ts](src/API/pet.ts) and is imported by `store.ts`, rather than relying on `playwright.config.ts`'s `use.baseURL`.

## Running the API Tests

```bash
npx playwright test src/API                 # all API tests
npx playwright test src/API/pet.spec.ts     # pet endpoints only
npx playwright test src/API/store.spec.ts   # store/order endpoints only
```

## Cases Not Covered

- Validation/error-path tests for `POST /pet` and `POST /store/order` (e.g. missing required `name`/`photoUrls`, invalid `status` enum values)
- Response schema/shape assertions beyond the fields under test (e.g. asserting `tags`/`category` round-trip exactly).
- Authentication/authorization (`api_key`, `petstore_auth`) — the public demo instance doesn't enforce these, so there's nothing to meaningfully assert.
