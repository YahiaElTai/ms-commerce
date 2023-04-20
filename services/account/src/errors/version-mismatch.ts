import { CustomError } from './custom-error';

export class VersionMistachError extends CustomError {
  statusCode = 409;

  constructor() {
    // just for logging purposes
    super('User version mismatch');

    // only because we are extending a built-in class
    Object.setPrototypeOf(this, VersionMistachError.prototype);
  }
}
