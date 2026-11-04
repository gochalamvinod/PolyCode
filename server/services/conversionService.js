import { validateConversionRequest, validateAiResponseStructure, validateTargetSyntax } from './validatorService.js';
import { buildConversionPrompt } from './promptService.js';
import { requestAiConversion } from './aiService.js';
import { Conversion } from '../models/Conversion.js';

export const processCodeConversion = async ({
  sourceLanguage,
  targetLanguage,
  sourceCode,
  settings = {},
  additionalInstructions = '',
  userId = null
}) => {
  // Step 1: Validate request input
  validateConversionRequest({ sourceLanguage, targetLanguage, sourceCode });

  // Step 2: Build AI prompts
  const { systemPrompt, userPrompt, sourceName, targetName } = buildConversionPrompt({
    sourceLanguage,
    targetLanguage,
    sourceCode,
    settings,
    additionalInstructions
  });

  // Step 3: Request conversion from AI provider
  const rawAiResult = await requestAiConversion({ systemPrompt, userPrompt });

  // Step 4: Validate structured response
  const validatedAiOutput = validateAiResponseStructure(rawAiResult);

  // Step 5: Heuristic target syntax verification
  const syntaxCheck = validateTargetSyntax(validatedAiOutput.convertedCode, targetLanguage);
  const combinedWarnings = [
    ...validatedAiOutput.warnings,
    ...syntaxCheck.warnings
  ];

  const resultData = {
    sourceLanguage,
    targetLanguage,
    sourceName,
    targetName,
    sourceCode,
    convertedCode: validatedAiOutput.convertedCode,
    summary: validatedAiOutput.summary,
    explanation: validatedAiOutput.explanation,
    warnings: combinedWarnings,
    assumptions: validatedAiOutput.assumptions,
    confidence: validatedAiOutput.confidence,
    conversionStatus: 'completed',
    settings,
    syntaxValid: syntaxCheck.isValid
  };

  // Step 6: If user is authenticated, persist into MongoDB
  let savedRecord = null;
  if (userId) {
    try {
      savedRecord = await Conversion.create({
        userId,
        sourceLanguage,
        targetLanguage,
        sourceCode,
        convertedCode: validatedAiOutput.convertedCode,
        summary: validatedAiOutput.summary,
        explanation: validatedAiOutput.explanation,
        warnings: combinedWarnings,
        assumptions: validatedAiOutput.assumptions,
        confidence: validatedAiOutput.confidence,
        conversionStatus: 'completed',
        settings
      });
      resultData._id = savedRecord._id;
      resultData.createdAt = savedRecord.createdAt;
    } catch (dbError) {
      console.error('[Database Warning] Failed to save conversion to user history:', dbError.message);
      // Non-fatal: Still return converted code to the user even if DB save fails
    }
  }

  return resultData;
};
