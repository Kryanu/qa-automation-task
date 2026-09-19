import { Page } from '@playwright/test';
import { LoginFlow } from '../login/login';

export const CheckoutIds = {
  addBackpack: 'add-to-cart-sauce-labs-backpack',
  addBikeLight: 'add-to-cart-sauce-labs-bike-light',
  addTShirt: 'add-to-cart-sauce-labs-bolt-t-shirt',
  checkoutLink: 'shopping-cart-link',
  checkout: 'checkout',
  firstName: 'firstName',
  lastName: 'lastName',
  postalCode: 'postalCode',
  continueToLastStep: 'continue',
  finish: 'finish',
  shoppingCartNumber: 'shopping-cart-badge',
  inventoryItem: 'inventory-item',
  error: 'error',
};

export async function addItemsToShoppingCart(page: Page, override?: string[]) {
  const items = [
    CheckoutIds.addBackpack,
    CheckoutIds.addBikeLight,
    CheckoutIds.addTShirt,
  ];

  const shoppingList = override ?? items;

  for (const item of shoppingList) {
    await page.getByTestId(item).click();
  }

  return shoppingList.length;
}

/**
 * Logs in as the standard user and adds items to the shopping cart.
 *
 * @param page - The Playwright page to operate on.
 * @param items - Test IDs of items to add; defaults to the backpack, bike light, and t-shirt.
 * @returns The number of items added to the cart.
 */
export async function SetupCheckout(page: Page, items?: string[]) {
  await LoginFlow(page, {
    username: 'standard_user',
    password: 'secret_sauce',
  });

  return await addItemsToShoppingCart(page, items);
}

interface UserDetails {
  firstName: string;
  lastName: string;
  postalCode: string;
}

interface ContinueCase {
  user: UserDetails;
  expectedErrorMsg: string;
  caseName: string;
}

export const continueCases: ContinueCase[] = [
  {
    user: {
      firstName: '',
      lastName: 'A',
      postalCode: 'A',
    },
    expectedErrorMsg: 'Error: First Name is required',
    caseName: 'Empty first name should block navigation',
  },
  {
    user: {
      firstName: 'A',
      lastName: '',
      postalCode: 'A',
    },
    expectedErrorMsg: 'Error: Last Name is required',
    caseName: 'Empty last name should block navigation',
  },
  {
    user: {
      firstName: 'A',
      lastName: 'B',
      postalCode: '',
    },
    expectedErrorMsg: 'Error: Postal Code is required',
    caseName: 'Empty postal code should block navigation',
  },
];

async function fillCheckoutForm(page: Page, user: UserDetails) {
  await page.getByTestId(CheckoutIds.firstName).fill(user.firstName);
  await page.getByTestId(CheckoutIds.lastName).fill(user.lastName);
  await page.getByTestId(CheckoutIds.postalCode).fill(user.postalCode);
}

export async function NavigateTIllLastStep(page: Page, user: UserDetails) {
  await SetupCheckout(page);

  await page.getByTestId(CheckoutIds.checkoutLink).click();
  await page.getByTestId(CheckoutIds.checkout).click();

  await fillCheckoutForm(page, user);

  await page.getByTestId(CheckoutIds.continueToLastStep).click();
}
