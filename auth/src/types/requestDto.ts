import { UserRoles } from "../models/user";

export type UserRegisterDto = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRoles;
};

export type UserLoginDto = {
  email: string;
  password: string;
};
