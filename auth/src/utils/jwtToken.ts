import jwt from "jsonwebtoken";
import { CustomJwtPayload } from "./types";

export const getJwtToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_KEY!);
};

export const verifyJwtToken = (jwtCookie: string): { userId: string } => {
  const verifyJwt = jwt.verify(
    jwtCookie,
    process.env.JWT_KEY!
  ) as CustomJwtPayload;

  return { userId: verifyJwt.id };
};
