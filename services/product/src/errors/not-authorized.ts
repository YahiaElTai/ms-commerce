import { CustomError } from './custom-error';

export class NotAuthorized extends CustomError {
  statusCode = 401;

  constructor(message?: string) {
    // just for logging purposes
    super(message || 'Request not authorized');

    // only because we are extending a built-in class
    Object.setPrototypeOf(this, NotAuthorized.prototype);
  }
}
