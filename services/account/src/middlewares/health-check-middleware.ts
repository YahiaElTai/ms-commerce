import { type NextFunction, type Request, type Response } from 'express';

const healthCheckMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  if (request.url === '/api/account/health') {
    response.statusCode = 200;
    response.json({ message: 'Account Service is healthy' });
  } else {
    next();
  }
};

export default healthCheckMiddleware;
