import { UserRoles } from "@hrrtickets/common";
import { JwtPayload } from "jsonwebtoken";

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
