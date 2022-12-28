export class JWTUndefinedError extends Error {
  statusCode = 500;

  constructor() {
    // just for logging purposes
    super('JWT_KEY must be defined');

    // only because we are extending a built-in class
    Object.setPrototypeOf(this, JWTUndefinedError.prototype);
  }
}
