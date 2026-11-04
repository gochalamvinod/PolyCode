import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';

export const protect = async (req, res, next) => {
  try {
    let token = null;

    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new ApiError(401, 'Authentication required to access this resource', 'UNAUTHORIZED'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'polycode_secret_development_jwt_key_2026_super_secure');
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return next(new ApiError(401, 'User associated with this token no longer exists', 'USER_NOT_FOUND'));
      }
      req.user = user;
      next();
    } catch (jwtErr) {
      return next(new ApiError(401, 'Invalid or expired authentication token', 'INVALID_TOKEN'));
    }
  } catch (error) {
    next(error);
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    let token = null;

    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'polycode_secret_development_jwt_key_2026_super_secure');
        const user = await User.findById(decoded.id).select('-password');
        if (user) {
          req.user = user;
        }
      } catch (err) {
        // Silently continue as guest if optional auth token is invalid or expired
        req.user = null;
      }
    } else {
      req.user = null;
    }
    next();
  } catch (error) {
    next();
  }
};
