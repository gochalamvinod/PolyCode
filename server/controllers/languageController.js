import { SUPPORTED_LANGUAGES, getLanguageById } from '../config/languages.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

export const getAllLanguages = (req, res) => {
  return ApiResponse.success(
    res,
    {
      languages: SUPPORTED_LANGUAGES,
      count: SUPPORTED_LANGUAGES.length
    },
    'Supported languages retrieved successfully'
  );
};

export const getLanguageDetails = (req, res, next) => {
  const { id } = req.params;
  const lang = getLanguageById(id);

  if (!lang) {
    return next(new ApiError(404, `Language '${id}' is not supported.`, 'LANGUAGE_NOT_FOUND'));
  }

  return ApiResponse.success(res, { language: lang }, 'Language details retrieved');
};
