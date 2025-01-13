import { JwtPayload } from "jsonwebtoken";
import { UserDoc } from "../models/user";

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
      currentUser?: UserDoc;
    }
  }
}
