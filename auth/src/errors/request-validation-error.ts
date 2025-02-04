import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";

export class RequestValidationError extends CustomError {
  constructor(public errors: ValidationError[]) {
    super("Request validation error");

    this.statusCode = 400;

    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }
  serializeErrors() {
    return this.errors.map((error) => ({
      message: error.msg,
      field: (error as any).path,
    }));
  }
}
