export type UserRegisterDto = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type UserLoginDto = {
  email: string;
  password: string;
};
