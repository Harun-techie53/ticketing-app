export abstract class CustomError extends Error {
  constructor(public message: string, public statusCode?: number) {
    super(message);

    this.statusCode = statusCode;

    Object.setPrototypeOf(this, CustomError.prototype);
  }
  abstract serializeErrors(): {
    message: string;
    field?: string;
  }[];
}
