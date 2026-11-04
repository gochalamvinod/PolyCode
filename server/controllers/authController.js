import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

export const register = async (req, res, next) => {
  try {
    const { username, email, password, preferredSourceLanguage, preferredTargetLanguage } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new ApiError(409, 'An account with this email address already exists', 'EMAIL_ALREADY_EXISTS');
    }

    const user = await User.create({
      username,
      email: email.toLowerCase(),
      password,
      preferredSourceLanguage: preferredSourceLanguage || 'python',
      preferredTargetLanguage: preferredTargetLanguage || 'javascript'
    });

    const token = user.generateAuthToken();
    res.cookie('token', token, COOKIE_OPTIONS);

    const userData = {
      _id: user._id,
      username: user.username,
      email: user.email,
      preferredSourceLanguage: user.preferredSourceLanguage,
      preferredTargetLanguage: user.preferredTargetLanguage,
      theme: user.theme,
      createdAt: user.createdAt
    };

    return ApiResponse.success(res, { user: userData, token }, 'Registration successful', 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      throw new ApiError(401, 'Invalid email or password', 'INVALID_CREDENTIALS');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid email or password', 'INVALID_CREDENTIALS');
    }

    const token = user.generateAuthToken();
    res.cookie('token', token, COOKIE_OPTIONS);

    const userData = {
      _id: user._id,
      username: user.username,
      email: user.email,
      preferredSourceLanguage: user.preferredSourceLanguage,
      preferredTargetLanguage: user.preferredTargetLanguage,
      theme: user.theme,
      createdAt: user.createdAt
    };

    return ApiResponse.success(res, { user: userData, token }, 'Login successful');
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  });
  return ApiResponse.success(res, null, 'Logged out successfully');
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      throw new ApiError(404, 'User profile not found', 'USER_NOT_FOUND');
    }
    return ApiResponse.success(res, { user }, 'User profile retrieved');
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const updates = {};
    const { username, preferredSourceLanguage, preferredTargetLanguage, theme } = req.body;

    if (username) updates.username = username;
    if (preferredSourceLanguage) updates.preferredSourceLanguage = preferredSourceLanguage;
    if (preferredTargetLanguage) updates.preferredTargetLanguage = preferredTargetLanguage;
    if (theme) updates.theme = theme;

    const user = await User.findByIdAndUpdate(req.user._id, { $set: updates }, { new: true, runValidators: true }).select('-password');
    return ApiResponse.success(res, { user }, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
};
