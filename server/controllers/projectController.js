import { SavedProject } from '../models/SavedProject.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const createProject = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { title, description, sourceLanguage, targetLanguage, sourceCode, convertedCode, summary, tags } = req.body;

    const project = await SavedProject.create({
      userId,
      title,
      description,
      sourceLanguage,
      targetLanguage,
      sourceCode,
      convertedCode,
      summary,
      tags
    });

    return ApiResponse.success(res, { project }, 'Project saved successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const getProjects = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10, search } = req.query;

    const query = { userId };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const pageNumber = Math.max(1, parseInt(page, 10));
    const limitNumber = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNumber - 1) * limitNumber;

    const [projects, totalCount] = await Promise.all([
      SavedProject.find(query)
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limitNumber)
        .lean(),
      SavedProject.countDocuments(query)
    ]);

    const totalPages = Math.ceil(totalCount / limitNumber) || 1;

    return ApiResponse.success(
      res,
      {
        projects,
        pagination: {
          currentPage: pageNumber,
          totalPages,
          totalCount,
          hasPrev: pageNumber > 1,
          hasNext: pageNumber < totalPages
        }
      },
      'Saved projects retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const project = await SavedProject.findById(id);

    if (!project) {
      throw new ApiError(404, 'Saved project not found', 'PROJECT_NOT_FOUND');
    }

    if (project.userId.toString() !== req.user._id.toString()) {
      throw new ApiError(403, 'Unauthorized access to this project', 'FORBIDDEN');
    }

    return ApiResponse.success(res, { project }, 'Project retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const project = await SavedProject.findById(id);

    if (!project) {
      throw new ApiError(404, 'Saved project not found', 'PROJECT_NOT_FOUND');
    }

    if (project.userId.toString() !== req.user._id.toString()) {
      throw new ApiError(403, 'Unauthorized access to modify this project', 'FORBIDDEN');
    }

    const { title, description, sourceCode, convertedCode, tags } = req.body;
    if (title !== undefined) project.title = title;
    if (description !== undefined) project.description = description;
    if (sourceCode !== undefined) project.sourceCode = sourceCode;
    if (convertedCode !== undefined) project.convertedCode = convertedCode;
    if (tags !== undefined) project.tags = tags;

    await project.save();

    return ApiResponse.success(res, { project }, 'Project updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const project = await SavedProject.findById(id);

    if (!project) {
      throw new ApiError(404, 'Saved project not found', 'PROJECT_NOT_FOUND');
    }

    if (project.userId.toString() !== req.user._id.toString()) {
      throw new ApiError(403, 'Unauthorized: Cannot delete another user\'s project', 'FORBIDDEN');
    }

    await SavedProject.findByIdAndDelete(id);

    return ApiResponse.success(res, { id }, 'Project deleted successfully');
  } catch (error) {
    next(error);
  }
};
