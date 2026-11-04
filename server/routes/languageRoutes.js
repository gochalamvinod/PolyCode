import { Router } from 'express';
import { getAllLanguages, getLanguageDetails } from '../controllers/languageController.js';

const router = Router();

router.get('/', getAllLanguages);
router.get('/:id', getLanguageDetails);

export default router;
