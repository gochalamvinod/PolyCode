import { isValidLanguage } from '../config/languages.js';
import { aiConfig } from '../config/aiConfig.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * Validates conversion request payload
 */
export const validateConversionRequest = ({ sourceLanguage, targetLanguage, sourceCode }) => {
  if (!sourceLanguage || !targetLanguage) {
    throw new ApiError(400, 'Both source and target languages must be specified.', 'INVALID_LANGUAGE_PAIR');
  }

  if (!isValidLanguage(sourceLanguage)) {
    throw new ApiError(400, `Unsupported source language: "${sourceLanguage}".`, 'UNSUPPORTED_LANGUAGE');
  }

  if (!isValidLanguage(targetLanguage)) {
    throw new ApiError(400, `Unsupported target language: "${targetLanguage}".`, 'UNSUPPORTED_LANGUAGE');
  }

  if (sourceLanguage.toLowerCase() === targetLanguage.toLowerCase()) {
    throw new ApiError(400, 'Source and target languages cannot be identical.', 'IDENTICAL_LANGUAGES');
  }

  if (!sourceCode || typeof sourceCode !== 'string' || sourceCode.trim().length === 0) {
    throw new ApiError(400, 'Source code cannot be empty.', 'EMPTY_SOURCE_CODE');
  }

  if (sourceCode.length > aiConfig.maxCodeLength) {
    throw new ApiError(
      400,
      `Source code length (${sourceCode.length}) exceeds maximum allowed limit (${aiConfig.maxCodeLength}).`,
      'CODE_SIZE_EXCEEDED'
    );
  }

  return true;
};

/**
 * Validates the structured output returned by the AI provider
 */
export const validateAiResponseStructure = (rawResponse) => {
  if (!rawResponse || typeof rawResponse !== 'object') {
    throw new ApiError(502, 'AI provider returned an invalid non-object response.', 'MALFORMED_AI_RESPONSE');
  }

  const { convertedCode, summary, explanation, warnings, assumptions, confidence } = rawResponse;

  if (typeof convertedCode !== 'string' || convertedCode.trim().length === 0) {
    throw new ApiError(
      502,
      'AI response did not contain valid converted code.',
      'INVALID_CONVERTED_CODE'
    );
  }

  return {
    convertedCode: convertedCode.trim(),
    summary: typeof summary === 'string' ? summary.trim() : 'Code converted successfully.',
    explanation: Array.isArray(explanation) ? explanation : [],
    warnings: Array.isArray(warnings) ? warnings : [],
    assumptions: Array.isArray(assumptions) ? assumptions : [],
    confidence: ['high', 'medium', 'low'].includes(confidence) ? confidence : 'high'
  };
};

/**
 * Heuristic syntax check for balanced brackets and common language structural requirements
 */
export const validateTargetSyntax = (code, targetLanguage) => {
  const warnings = [];
  const lang = targetLanguage.toLowerCase();

  // 1. Bracket and parenthesis balancing check
  const stack = [];
  const pairs = { ')': '(', '}': '{', ']': '[' };
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let inTemplateString = false;
  let inLineComment = false;
  let inBlockComment = false;

  for (let i = 0; i < code.length; i++) {
    const char = code[i];
    const prevChar = i > 0 ? code[i - 1] : '';
    const nextChar = i < code.length - 1 ? code[i + 1] : '';

    // Handle comments
    if (!inSingleQuote && !inDoubleQuote && !inTemplateString) {
      if (char === '/' && nextChar === '/' && !inBlockComment) {
        inLineComment = true;
        i++;
        continue;
      }
      if (char === '#' && (lang === 'python') && !inBlockComment) {
        inLineComment = true;
        continue;
      }
      if (char === '/' && nextChar === '*' && !inLineComment) {
        inBlockComment = true;
        i++;
        continue;
      }
      if (char === '*' && nextChar === '/' && inBlockComment) {
        inBlockComment = false;
        i++;
        continue;
      }
      if (char === '\n') {
        inLineComment = false;
        continue;
      }
    }

    if (inLineComment || inBlockComment) continue;

    // Handle strings
    if (char === "'" && prevChar !== '\\' && !inDoubleQuote && !inTemplateString) {
      inSingleQuote = !inSingleQuote;
      continue;
    }
    if (char === '"' && prevChar !== '\\' && !inSingleQuote && !inTemplateString) {
      inDoubleQuote = !inDoubleQuote;
      continue;
    }
    if (char === '`' && prevChar !== '\\' && !inSingleQuote && !inDoubleQuote && lang === 'javascript') {
      inTemplateString = !inTemplateString;
      continue;
    }

    if (inSingleQuote || inDoubleQuote || inTemplateString) continue;

    // Bracket check
    if (char === '(' || char === '{' || char === '[') {
      stack.push(char);
    } else if (char === ')' || char === '}' || char === ']') {
      const expected = pairs[char];
      const actual = stack.pop();
      if (actual !== expected) {
        warnings.push(`Potential syntax discrepancy: Unmatched bracket '${char}' detected.`);
        break;
      }
    }
  }

  if (stack.length > 0) {
    warnings.push(`Potential syntax discrepancy: Unclosed delimiter '${stack[stack.length - 1]}' detected.`);
  }

  // 2. Language-specific heuristic checks
  if (lang === 'java' && !code.includes('class')) {
    warnings.push('Java target code might be missing an outer class declaration.');
  }

  if (lang === 'c' && !code.includes('#include')) {
    warnings.push('C code may require standard headers such as <stdio.h> or <stdlib.h>.');
  }

  if (lang === 'cpp' && !code.includes('#include')) {
    warnings.push('C++ code may require headers like <iostream> or standard library headers.');
  }

  return {
    isValid: warnings.length === 0,
    warnings
  };
};
