import axios from 'axios';
import { aiConfig } from '../config/aiConfig.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * Strips markdown code fences if LLM accidentally wrapped JSON
 */
const extractJsonFromText = (rawText) => {
  if (!rawText) return null;
  let text = rawText.trim();

  // Strip ```json ... ``` or ``` ... ```
  if (text.startsWith('```')) {
    text = text.replace(/^```[a-zA-Z]*\n?/, '').replace(/\n?```$/, '').trim();
  }

  // Find first { and last }
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    text = text.substring(firstBrace, lastBrace + 1);
  }

  try {
    return JSON.parse(text);
  } catch (err) {
    throw new ApiError(
      502,
      `Failed to parse AI response into structured JSON: ${err.message}`,
      'AI_MALFORMED_JSON',
      { rawPreview: text.substring(0, 300) }
    );
  }
};

/**
 * Call Google Gemini API
 */
const callGemini = async ({ systemPrompt, userPrompt }) => {
  const model = aiConfig.model || 'gemini-3.1-flash-lite';
  const url = `${aiConfig.baseUrl || 'https://generativelanguage.googleapis.com/v1beta'}/models/${model}:generateContent?key=${aiConfig.apiKey}`;

  const payload = {
    contents: [
      {
        role: 'user',
        parts: [{ text: userPrompt }]
      }
    ],
    systemInstruction: {
      parts: [{ text: systemPrompt }]
    },
    generationConfig: {
      temperature: 0.1,
      responseMimeType: 'application/json'
    }
  };

  let lastError;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await axios.post(url, payload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: aiConfig.timeoutMs
      });

      const candidate = response.data?.candidates?.[0];
      if (!candidate || !candidate.content?.parts?.[0]?.text) {
        throw new ApiError(502, 'Gemini returned an empty candidate response.', 'AI_EMPTY_RESPONSE');
      }

      return extractJsonFromText(candidate.content.parts[0].text);
    } catch (err) {
      lastError = err;
      const status = err.response?.status;
      const msg = err.response?.data?.error?.message || err.message || '';
      // If temporary high demand, rate limit, or network blip, retry with backoff
      if ((status === 503 || status === 429 || msg.includes('high demand')) && attempt < 3) {
        console.warn(`[Gemini Retry] Attempt ${attempt} encountered: ${msg}. Retrying in ${attempt * 1.5}s...`);
        await new Promise((resolve) => setTimeout(resolve, attempt * 1500));
        continue;
      }
      throw err;
    }
  }
  throw lastError;
};

/**
 * Call OpenAI or OpenAI-Compatible API (OpenAI, Groq, Custom)
 */
const callOpenAICompatible = async ({ systemPrompt, userPrompt, endpoint, defaultModel, extraHeaders = {} }) => {
  const model = aiConfig.model || defaultModel;
  const url = aiConfig.baseUrl || endpoint;

  const payload = {
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.1
  };

  const headers = {
    'Content-Type': 'application/json',
    ...(aiConfig.apiKey ? { Authorization: `Bearer ${aiConfig.apiKey}` } : {}),
    ...extraHeaders
  };

  const response = await axios.post(url, payload, {
    headers,
    timeout: aiConfig.timeoutMs
  });

  const content = response.data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new ApiError(502, 'AI provider returned an empty completion.', 'AI_EMPTY_RESPONSE');
  }

  return extractJsonFromText(content);
};

/**
 * Call Anthropic Claude API
 */
const callAnthropic = async ({ systemPrompt, userPrompt }) => {
  const model = aiConfig.model || 'claude-3-5-sonnet-20241022';
  const url = `${aiConfig.baseUrl || 'https://api.anthropic.com/v1'}/messages`;

  const payload = {
    model,
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
    temperature: 0.1
  };

  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': aiConfig.apiKey,
    'anthropic-version': '2023-06-01'
  };

  const response = await axios.post(url, payload, {
    headers,
    timeout: aiConfig.timeoutMs
  });

  const textBlock = response.data?.content?.find((c) => c.type === 'text');
  if (!textBlock || !textBlock.text) {
    throw new ApiError(502, 'Anthropic returned an empty response message.', 'AI_EMPTY_RESPONSE');
  }

  return extractJsonFromText(textBlock.text);
};

/**
 * Main AI Dispatcher
 */
export const requestAiConversion = async ({ systemPrompt, userPrompt }) => {
  const provider = aiConfig.provider;

  // Check if AI provider key is configured (except for local ollama)
  if (provider !== 'ollama' && (!aiConfig.apiKey || aiConfig.apiKey.trim() === '')) {
    throw new ApiError(
      503,
      `AI Provider '${provider}' is not configured. Please set AI_API_KEY in your server environment variables (.env).`,
      'AI_PROVIDER_NOT_CONFIGURED',
      {
        provider,
        instructions: 'Add AI_API_KEY to server/.env and restart the PolyCode backend service.'
      }
    );
  }

  try {
    switch (provider) {
      case 'gemini':
        return await callGemini({ systemPrompt, userPrompt });

      case 'openai':
        return await callOpenAICompatible({
          systemPrompt,
          userPrompt,
          endpoint: 'https://api.openai.com/v1/chat/completions',
          defaultModel: 'gpt-4o-mini'
        });

      case 'groq':
        return await callOpenAICompatible({
          systemPrompt,
          userPrompt,
          endpoint: 'https://api.groq.com/openai/v1/chat/completions',
          defaultModel: 'llama-3.3-70b-versatile'
        });

      case 'anthropic':
        return await callAnthropic({ systemPrompt, userPrompt });

      case 'ollama':
        return await callOpenAICompatible({
          systemPrompt,
          userPrompt,
          endpoint: aiConfig.baseUrl || 'http://localhost:11434/v1/chat/completions',
          defaultModel: aiConfig.model || 'codellama'
        });

      case 'custom':
        if (!aiConfig.baseUrl) {
          throw new ApiError(500, 'Custom AI provider selected, but AI_BASE_URL is not configured.', 'AI_CONFIG_ERROR');
        }
        return await callOpenAICompatible({
          systemPrompt,
          userPrompt,
          endpoint: aiConfig.baseUrl,
          defaultModel: aiConfig.model || 'default'
        });

      default:
        throw new ApiError(400, `Unsupported AI provider specified: "${provider}"`, 'UNSUPPORTED_AI_PROVIDER');
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      throw new ApiError(
        504,
        `AI conversion request timed out after ${aiConfig.timeoutMs / 1000} seconds. Please try with a smaller code snippet.`,
        'AI_TIMEOUT'
      );
    }

    const axiosMsg = error.response?.data?.error?.message || error.response?.data?.message || error.message;
    const axiosStatus = error.response?.status || 502;

    throw new ApiError(
      axiosStatus >= 400 && axiosStatus < 500 ? 502 : axiosStatus,
      `AI Provider (${provider}) communication error: ${axiosMsg}`,
      'AI_COMMUNICATION_ERROR',
      { provider, originalError: axiosMsg }
    );
  }
};
