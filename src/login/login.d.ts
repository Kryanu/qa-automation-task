import { LoginPageIds } from './login';
export type LoginPage = typeof LoginPageIds;

export interface User {
  username: string;
  password: string;
}

export interface FailedCase {
  user: User;
  expectedErrorMsg: string;
  caseName: string;
}
