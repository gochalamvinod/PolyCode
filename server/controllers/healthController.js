import mongoose from 'mongoose';
import { getAIConfigStatus } from '../config/aiConfig.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const getHealth = (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  const aiStatus = getAIConfigStatus();

  return ApiResponse.success(
    res,
    {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: {
        status: dbStatus,
        host: mongoose.connection.host || 'local'
      },
      aiProvider: aiStatus
    },
    'PolyCode API is healthy'
  );
};
