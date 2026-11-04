import mongoose from 'mongoose';

const savedProjectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [500, 'Description cannot exceed 500 characters']
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
    tags: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

savedProjectSchema.index({ userId: 1, createdAt: -1 });

export const SavedProject = mongoose.model('SavedProject', savedProjectSchema);
