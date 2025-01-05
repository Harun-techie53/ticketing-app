import { CustomError } from "./custom-error";

export class NotFoundError extends CustomError {
  constructor() {
    super("Not found error");

    this.statusCode = 404;

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [{ message: "Route not found" }];
  }
}
