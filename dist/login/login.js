"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.failedLoginCases = exports.loginCases = exports.LoginPageIds = void 0;
exports.LoginFlow = LoginFlow;
exports.LoginPageIds = {
    username: 'username',
    password: 'password',
    login: 'login-button',
    error: 'error',
};
exports.loginCases = [
    {
        username: 'standard_user',
        password: 'secret_sauce',
    },
    {
        username: 'performance_glitch_user',
        password: 'secret_sauce',
    },
    {
        username: 'problem_user',
        password: 'secret_sauce',
    },
];
exports.failedLoginCases = [
    {
        user: {
            username: 'locked_out_user',
            password: 'secret_sauce',
        },
        expectedErrorMsg: 'Epic sadface: Sorry, this user has been locked out.',
        caseName: 'cannot login due to locked account',
    },
    {
        user: {
            username: 'Sad',
            password: 'Pancake',
        },
        expectedErrorMsg: 'Epic sadface: Username and password do not match any user in this service',
        caseName: 'error for invalid credentials',
    },
];
async function LoginFlow(page, user) {
    await page.goto('https://www.saucedemo.com/');
    const username = page.getByTestId(exports.LoginPageIds.username);
    const password = page.getByTestId(exports.LoginPageIds.password);
    await username.fill(user.username);
    await password.fill(user.password);
    const loginButton = page.getByTestId(exports.LoginPageIds.login);
    await loginButton.click();
}
