import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { UserDoc } from "../models/user";

export interface IUserCreatePayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserDoc;
    }
  }
}

export interface CustomJwtPayload extends JwtPayload {
  id: string;
  iat: number;
}
