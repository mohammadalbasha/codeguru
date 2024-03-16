export interface ISigninInput {
  email: string;
  password: string;
}

export interface ISignupInput {
  name: string;
  email: string;
  password: string;
}

export interface IResetPsaswordInput {
  email: string;
  password: string;
  resetPasswordToken: string;
}

export interface IResetPsaswordLinkInput {
  email: string;
}
