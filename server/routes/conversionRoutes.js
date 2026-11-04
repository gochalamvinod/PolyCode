import { Router } from 'express';
import {
  convertCode,
  getConversions,
  getConversionById,
  deleteConversion
} from '../controllers/conversionController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validationMiddleware.js';
import { conversionLimiter } from '../middleware/rateLimitMiddleware.js';
import { conversionSchema } from '../validators/conversionValidator.js';

const router = Router();

// Guest or Authenticated users can convert code; if authenticated, history is saved
router.post('/', conversionLimiter, optionalAuth, validateRequest(conversionSchema), convertCode);

// Protected history operations
router.get('/', protect, getConversions);
router.get('/:id', protect, getConversionById);
router.delete('/:id', protect, deleteConversion);

export default router;
