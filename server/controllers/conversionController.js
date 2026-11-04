import { processCodeConversion } from '../services/conversionService.js';
import { Conversion } from '../models/Conversion.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const convertCode = async (req, res, next) => {
  try {
    const { sourceLanguage, targetLanguage, sourceCode, settings, additionalInstructions } = req.body;
    const userId = req.user ? req.user._id : null;

    const result = await processCodeConversion({
      sourceLanguage,
      targetLanguage,
      sourceCode,
      settings,
      additionalInstructions,
      userId
    });

    return ApiResponse.success(res, result, 'Code converted successfully', 200);
  } catch (error) {
    next(error);
  }
};

export const getConversions = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10, sourceLanguage, targetLanguage, search, sort = 'desc' } = req.query;

    const query = { userId };

    if (sourceLanguage) {
      query.sourceLanguage = sourceLanguage.toLowerCase();
    }
    if (targetLanguage) {
      query.targetLanguage = targetLanguage.toLowerCase();
    }
    if (search) {
      query.$or = [
        { summary: { $regex: search, $options: 'i' } },
        { sourceCode: { $regex: search, $options: 'i' } },
        { convertedCode: { $regex: search, $options: 'i' } }
      ];
    }

    const pageNumber = Math.max(1, parseInt(page, 10));
    const limitNumber = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNumber - 1) * limitNumber;
    const sortOrder = sort === 'asc' ? 1 : -1;

    const [conversions, totalCount] = await Promise.all([
      Conversion.find(query)
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(limitNumber)
        .lean(),
      Conversion.countDocuments(query)
    ]);

    const totalPages = Math.ceil(totalCount / limitNumber) || 1;

    return ApiResponse.success(
      res,
      {
        conversions,
        pagination: {
          currentPage: pageNumber,
          totalPages,
          totalCount,
          hasPrev: pageNumber > 1,
          hasNext: pageNumber < totalPages
        }
      },
      'Conversion history retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

export const getConversionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const conversion = await Conversion.findById(id);

    if (!conversion) {
      throw new ApiError(404, 'Conversion record not found', 'CONVERSION_NOT_FOUND');
    }

    // Authorization check: User can only access their own conversion
    if (conversion.userId.toString() !== req.user._id.toString()) {
      throw new ApiError(403, 'Unauthorized access to this conversion record', 'FORBIDDEN');
    }

    return ApiResponse.success(res, { conversion }, 'Conversion details retrieved');
  } catch (error) {
    next(error);
  }
};

export const deleteConversion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const conversion = await Conversion.findById(id);

    if (!conversion) {
      throw new ApiError(404, 'Conversion record not found', 'CONVERSION_NOT_FOUND');
    }

    if (conversion.userId.toString() !== req.user._id.toString()) {
      throw new ApiError(403, 'Unauthorized: Cannot delete another user\'s conversion', 'FORBIDDEN');
    }

    await Conversion.findByIdAndDelete(id);

    return ApiResponse.success(res, { id }, 'Conversion record deleted successfully');
  } catch (error) {
    next(error);
  }
};
