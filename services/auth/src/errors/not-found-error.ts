import { CustomError } from './custom-error';

export class NotFoundError extends CustomError {
  statusCode = 404;
  constructor() {
    // just for logging purposes
    super('Not found');

    // only because we are extending a built-in class
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
