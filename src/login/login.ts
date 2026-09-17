import type { Page } from '@playwright/test';
import type { FailedCase, User } from './login.d';

export const LoginPageIds = {
  username: 'username',
  password: 'password',
  login: 'login-button',
  error: 'error',
};

export const loginCases: User[] = [
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

export const failedLoginCases: FailedCase[] = [
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
    expectedErrorMsg:
      'Epic sadface: Username and password do not match any user in this service',
    caseName: 'error for invalid credentials',
  },
  {
    user: {
      username: '',
      password: '',
    },
    expectedErrorMsg: 'Epic sadface: Username is required',
    caseName: 'error for empty credentials',
  },
  {
    user: {
      username: 'Sad',
      password: '',
    },
    expectedErrorMsg: 'Epic sadface: Password is required',
    caseName: 'error for empty password',
  },
];

export async function LoginFlow(page: Page, user: User) {
  await page.goto('https://www.saucedemo.com/');

  const username = page.getByTestId(LoginPageIds.username);
  const password = page.getByTestId(LoginPageIds.password);

  await username.fill(user.username);
  await password.fill(user.password);

  const loginButton = page.getByTestId(LoginPageIds.login);
  await loginButton.click();
}
