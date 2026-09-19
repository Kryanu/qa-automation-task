import { expect, test } from '@playwright/test';
import { CheckoutIds, continueCases, NavigateTIllLastStep } from './checkout';

test('fill form and continue', async ({ page }) => {
  NavigateTIllLastStep(page, {
    firstName: 'Sad',
    lastName: 'Pancake',
    postalCode: 'PNCK1000',
  });

  await expect(page).toHaveURL(
    'https://www.saucedemo.com/checkout-step-two.html',
  );
});

for (const continueCase of continueCases) {
  test(continueCase.caseName, async ({ page }) => {
    await NavigateTIllLastStep(page, continueCase.user);

    const errorMsg = page.getByTestId(CheckoutIds.error);

    await expect(page).not.toHaveURL(
      'https://www.saucedemo.com/checkout-step-two.html',
    );

    await expect(errorMsg).toHaveText(continueCase.expectedErrorMsg);
  });
}
