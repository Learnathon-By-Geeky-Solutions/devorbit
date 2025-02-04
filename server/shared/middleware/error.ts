import { NextFunction, Request, Response } from 'express';
import ErrorResponse from '../../utils/errorResponce';

interface CustomError extends Error {
  statusCode?: number;
  value?: any;
  code?: number;
  errors?: Record<string, { message: string }>;
}

const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let error: CustomError = { ...err };
  error.message = err.message;

  console.log(err.name);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found `;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(error.errors || {}).map(val => val.message);
    const message = messages.join(', ');
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
  });
};

export default errorHandler;
