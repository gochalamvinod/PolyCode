import { z } from 'zod';

export const registerSchema = z.object({
  username: z
    .string({ required_error: 'Username is required' })
    .trim()
    .min(3, 'Username must be at least 3 characters long')
    .max(30, 'Username cannot exceed 30 characters'),
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email('Invalid email address format'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, 'Password must be at least 6 characters long')
    .max(100, 'Password cannot exceed 100 characters'),
  preferredSourceLanguage: z.string().optional(),
  preferredTargetLanguage: z.string().optional()
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email('Invalid email address format'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password cannot be empty')
});

export const updateProfileSchema = z.object({
  username: z.string().trim().min(3).max(30).optional(),
  preferredSourceLanguage: z.string().optional(),
  preferredTargetLanguage: z.string().optional(),
  theme: z.enum(['dark', 'light']).optional()
});
