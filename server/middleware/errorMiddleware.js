import { ApiResponse } from '../utils/ApiResponse.js';

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let code = err.code || 'INTERNAL_SERVER_ERROR';
  let details = err.details || null;

  // Handle Mongoose duplicate key error (e.g. unique email)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `An account with this ${field} already exists.`;
    code = 'DUPLICATE_RESOURCE';
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    code = 'VALIDATION_ERROR';
    details = Object.values(err.errors).map((e) => e.message);
  }

  // Handle CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Resource not found with specified identifier (${err.value})`;
    code = 'INVALID_IDENTIFIER';
  }

  // Log error stack in development, never in production
  if (process.env.NODE_ENV !== 'production' && statusCode === 500) {
    console.error(`[Server Error] ${req.method} ${req.url}:`, err);
  }

  return ApiResponse.error(res, message, statusCode, code, details);
};

export const notFoundHandler = (req, res, next) => {
  return ApiResponse.error(
    res,
    `Cannot ${req.method} ${req.originalUrl} - Route not found`,
    404,
    'ROUTE_NOT_FOUND'
  );
};
