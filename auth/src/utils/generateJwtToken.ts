import jwt from "jsonwebtoken";

export const getJwtToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_KEY!);
};
