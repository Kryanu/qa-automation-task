import { expect, test } from '@playwright/test';
import { failedLoginCases, loginCases, LoginFlow, LoginPageIds } from './login';

for (const loginCase of loginCases) {
  test(`can login: ${loginCase.username}`, async ({ page }) => {
    await LoginFlow(page, loginCase);

    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  });
}

for (const loginCase of failedLoginCases) {
  test(loginCase.caseName, async ({ page }) => {
    await LoginFlow(page, loginCase.user);

    const errorMsg = page.getByTestId(LoginPageIds.error);

    await expect(page).not.toHaveURL(
      'https://www.saucedemo.com/inventory.html',
    );
    await expect(errorMsg).toHaveText(loginCase.expectedErrorMsg);
  });
}
