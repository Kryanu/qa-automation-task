import { expect, test } from '@playwright/test';
import { LoginFlow } from '../login/login';
import {
  addItemsToShoppingCart,
  CheckoutIds,
  NavigateTIllLastStep,
  SetupCheckout,
} from './checkout';

test('can add item to shopping list', async ({ page }) => {
  const items = [CheckoutIds.addBackpack];
  const count = await SetupCheckout(page, items);

  const shoppingCartNumber = page.getByTestId(CheckoutIds.shoppingCartNumber);

  await expect(shoppingCartNumber).toHaveText(`${count}`);
});

test('can add multiple items to shopping list', async ({ page }) => {
  const count = await SetupCheckout(page);

  const shoppingCartNumber = page.getByTestId(CheckoutIds.shoppingCartNumber);

  await expect(shoppingCartNumber).toHaveText(`${count}`);
});

test('can navigate to checkout after adding items', async ({ page }) => {
  await SetupCheckout(page);

  await page.getByTestId(CheckoutIds.checkoutLink).click();
  await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
});

test('can navigate to checkout info page from cart', async ({ page }) => {
  await SetupCheckout(page);

  await page.getByTestId(CheckoutIds.checkoutLink).click();
  await page.waitForURL('https://www.saucedemo.com/cart.html');

  await page.getByTestId(CheckoutIds.checkout).click();
  await expect(page).toHaveURL(
    'https://www.saucedemo.com/checkout-step-one.html',
  );
});

test('cart items to have same number as added items', async ({ page }) => {
  const count = await SetupCheckout(page);

  await page.getByTestId(CheckoutIds.checkoutLink).click();

  await page.waitForURL('https://www.saucedemo.com/cart.html');

  await expect(page.getByTestId(CheckoutIds.inventoryItem)).toHaveCount(count);
});

test('navigate to user details form', async ({ page }) => {
  const count = await SetupCheckout(page);

  await page.getByTestId(CheckoutIds.checkoutLink).click();

  await page.waitForURL('https://www.saucedemo.com/cart.html');

  await page.getByTestId(CheckoutIds.checkout).click();

  await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');
});

test('pressing finish completes checkout', async ({ page }) => {
  await NavigateTIllLastStep(page, {
    firstName: 'Sad',
    lastName: 'Pancake',
    postalCode: 'PNCK1000',
  });

  await page.getByTestId(CheckoutIds.finish).click();

  await expect(page).toHaveURL(
    'https://www.saucedemo.com/checkout-complete.html',
  );
});
