import { UserRoles } from "@hrrtickets/common";
import { JwtPayload } from "jsonwebtoken";
import Request from "express";

export interface CustomJwtPayload extends JwtPayload {
  id: string;
  iat: number;
}

declare global {
  namespace Express {
    interface Response {
      cookie(name: string, value: string, options?: any): this;
    }
  }
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: {
        id: string;
        role: UserRoles;
      };
    }
  }
}
