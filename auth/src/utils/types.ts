import { Request } from "express";

export interface IUserCreatePayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface CustomRequest extends Request {
  session?: { jwt: string };
}
