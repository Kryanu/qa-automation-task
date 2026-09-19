export interface User {
  username: string;
  password: string;
}

export interface FailedCase {
  user: User;
  expectedErrorMsg: string;
  caseName: string;
}
