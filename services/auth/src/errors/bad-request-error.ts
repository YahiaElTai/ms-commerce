import { CustomError } from './custom-error';

export class BadRequestError extends CustomError {
  statusCode = 400;

  constructor(public override message: string) {
    // just for logging purposes
    super(message);

    // only because we are extending a built-in class
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}
