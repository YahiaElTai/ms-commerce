import { type NextFunction, type Request, type Response } from 'express';

const healthCheckMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  if (request.url === '/api/carts/health') {
    response.statusCode = 200;
    response.json({ message: 'Cart Service is healthy' });
  } else {
    next();
  }
};

export default healthCheckMiddleware;
