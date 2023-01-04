export class DatabaseUrlUndefinedError extends Error {
  statusCode = 500;

  constructor() {
    // just for logging purposes
    super('DATABASE_URL must be defined');

    // only because we are extending a built-in class
    Object.setPrototypeOf(this, DatabaseUrlUndefinedError.prototype);
  }
}
