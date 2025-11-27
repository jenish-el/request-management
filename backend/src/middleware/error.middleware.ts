import { Response, NextFunction } from 'express';
import logger from '../config/logger';
import { AuthRequest } from './auth.middleware';

export const errorHandler = (
  err: Error,
  req: AuthRequest,
  res: Response,
  _next: NextFunction
): void => {
  logger.error('Error handler', {
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
  });

  // Don't leak error details in production
  const message = process.env.NODE_ENV === 'production'
    ? 'Internal server error'
    : err.message;

  res.status(500).json({
    error: message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

