import { z } from 'zod';
import { aiConfig } from '../config/aiConfig.js';
import { SUPPORTED_LANGUAGES } from '../config/languages.js';

const validLanguageIds = SUPPORTED_LANGUAGES.map((l) => l.id);

export const conversionSchema = z
  .object({
    sourceLanguage: z
      .string({ required_error: 'Source language is required' })
      .trim()
      .toLowerCase()
      .refine((val) => validLanguageIds.includes(val), {
        message: `Unsupported source language. Must be one of: ${validLanguageIds.join(', ')}`
      }),
    targetLanguage: z
      .string({ required_error: 'Target language is required' })
      .trim()
      .toLowerCase()
      .refine((val) => validLanguageIds.includes(val), {
        message: `Unsupported target language. Must be one of: ${validLanguageIds.join(', ')}`
      }),
    sourceCode: z
      .string({ required_error: 'Source code cannot be empty' })
      .trim()
      .min(1, 'Source code cannot be empty')
      .max(
        aiConfig.maxCodeLength,
        `Source code exceeds maximum allowed length of ${aiConfig.maxCodeLength} characters`
      ),
    settings: z
      .object({
        conversionStyle: z
          .enum(['idiomatic', 'preserve_structure', 'simple_readable'])
          .default('idiomatic'),
        conversionDetail: z
          .enum(['basic', 'detailed', 'with_explanations'])
          .default('detailed'),
        codePreferences: z
          .enum(['preserve_algorithm', 'optimize_safe', 'readable_verbose'])
          .default('preserve_algorithm'),
        addComments: z.boolean().default(true)
      })
      .optional()
      .default({}),
    additionalInstructions: z.string().max(1000).optional().default('')
  })
  .refine((data) => data.sourceLanguage !== data.targetLanguage, {
    message: 'Source and target programming languages must be different',
    path: ['targetLanguage']
  });
