import { z } from 'zod';
import { SUPPORTED_LANGUAGES } from '../config/languages.js';

const validLanguageIds = SUPPORTED_LANGUAGES.map((l) => l.id);

export const createProjectSchema = z.object({
  title: z
    .string({ required_error: 'Project title is required' })
    .trim()
    .min(1, 'Project title cannot be empty')
    .max(100, 'Title cannot exceed 100 characters'),
  description: z.string().trim().max(500, 'Description cannot exceed 500 characters').optional().default(''),
  sourceLanguage: z
    .string()
    .trim()
    .toLowerCase()
    .refine((val) => validLanguageIds.includes(val), {
      message: `Invalid source language. Must be one of: ${validLanguageIds.join(', ')}`
    }),
  targetLanguage: z
    .string()
    .trim()
    .toLowerCase()
    .refine((val) => validLanguageIds.includes(val), {
      message: `Invalid target language. Must be one of: ${validLanguageIds.join(', ')}`
    }),
  sourceCode: z.string().min(1, 'Source code cannot be empty'),
  convertedCode: z.string().min(1, 'Converted code cannot be empty'),
  summary: z.string().optional().default(''),
  tags: z.array(z.string()).optional().default([])
});

export const updateProjectSchema = z.object({
  title: z.string().trim().min(1).max(100).optional(),
  description: z.string().trim().max(500).optional(),
  sourceCode: z.string().min(1).optional(),
  convertedCode: z.string().min(1).optional(),
  tags: z.array(z.string()).optional()
});
