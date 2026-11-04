import mongoose from 'mongoose';

const conversionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true
    },
    sourceLanguage: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    targetLanguage: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    sourceCode: {
      type: String,
      required: true
    },
    convertedCode: {
      type: String,
      required: true
    },
    summary: {
      type: String,
      default: ''
    },
    explanation: {
      type: [String],
      default: []
    },
    warnings: {
      type: [String],
      default: []
    },
    assumptions: {
      type: [String],
      default: []
    },
    confidence: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'high'
    },
    conversionStatus: {
      type: String,
      enum: ['completed', 'failed', 'partial'],
      default: 'completed'
    },
    settings: {
      conversionStyle: { type: String, default: 'idiomatic' },
      conversionDetail: { type: String, default: 'detailed' },
      codePreferences: { type: String, default: 'preserve_algorithm' }
    }
  },
  {
    timestamps: true
  }
);

// Compound index for user query performance with pagination
conversionSchema.index({ userId: 1, createdAt: -1 });

export const Conversion = mongoose.model('Conversion', conversionSchema);
