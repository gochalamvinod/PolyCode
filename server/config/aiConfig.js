import './loadEnv.js';

export const aiConfig = {
  provider: (process.env.AI_PROVIDER || 'gemini').toLowerCase(),
  apiKey: process.env.AI_API_KEY || '',
  baseUrl: process.env.AI_BASE_URL || '',
  model: process.env.AI_MODEL || (
    (process.env.AI_PROVIDER || '').toLowerCase() === 'openai' ? 'gpt-4o-mini' :
    (process.env.AI_PROVIDER || '').toLowerCase() === 'groq' ? 'llama-3.3-70b-versatile' :
    (process.env.AI_PROVIDER || '').toLowerCase() === 'anthropic' ? 'claude-3-5-sonnet-20241022' :
    'gemini-3.1-flash-lite'
  ),
  maxCodeLength: parseInt(process.env.MAX_CODE_LENGTH, 10) || 50000,
  timeoutMs: parseInt(process.env.AI_TIMEOUT_MS, 10) || 45000
};

export const getAIConfigStatus = () => {
  const isConfigured = Boolean(aiConfig.apiKey && aiConfig.apiKey.trim().length > 0) || aiConfig.provider === 'ollama';
  return {
    isConfigured,
    provider: aiConfig.provider,
    model: aiConfig.model,
    hasBaseUrl: Boolean(aiConfig.baseUrl),
    maxCodeLength: aiConfig.maxCodeLength
  };
};
