"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
const login_1 = require("./login");
for (const loginCase of login_1.loginCases) {
    (0, test_1.test)(`can login: ${loginCase.username}`, async ({ page }) => {
        await (0, login_1.LoginFlow)(page, loginCase);
        await (0, test_1.expect)(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    });
}
for (const loginCase of login_1.failedLoginCases) {
    (0, test_1.test)(loginCase.caseName, async ({ page }) => {
        await (0, login_1.LoginFlow)(page, loginCase.user);
        const errorMsg = page.getByTestId(login_1.LoginPageIds.error);
        await (0, test_1.expect)(page).not.toHaveURL('https://www.saucedemo.com/inventory.html');
        await (0, test_1.expect)(errorMsg).toHaveText(loginCase.expectedErrorMsg);
    });
}
