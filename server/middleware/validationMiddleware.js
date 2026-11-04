import { ApiError } from '../utils/ApiError.js';

export const validateRequest = (schema) => (req, res, next) => {
  try {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      const details = parsed.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message
      }));
      return next(new ApiError(400, details[0]?.message || 'Invalid request body', 'VALIDATION_ERROR', details));
    }
    req.body = parsed.data;
    next();
  } catch (error) {
    next(error);
  }
};
