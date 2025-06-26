export interface ForgotPwdRequest {
  usernameOrEmailId: string;
  newPwd?: string;
  key?: string;
}

export interface PwdChangeRequest {
  username: string;
  currentPwd: string;
  newPwd: string;
}
