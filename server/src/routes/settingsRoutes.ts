import { Router } from 'express';
import { body } from 'express-validator';
import {
  getAllSettings,
  getPublicSettings,
  getSettingByKey,
  upsertSetting,
  updateMultipleSettings,
  deleteSetting,
  getSettingsByCategory,
  getCategories
} from '../controllers/settingsController';
import { authenticate, requireAdmin } from '../middlewares/auth';
import { handleValidationErrors } from '../middlewares/errors';

const router = Router();

// Validation rules
const upsertSettingValidation = [
  body('key').trim().notEmpty().withMessage('Clé requise'),
  body('value').notEmpty().withMessage('Valeur requise'),
  body('description').optional().trim(),
  body('category').optional().trim()
];

const updateMultipleValidation = [
  body('settings').isArray({ min: 1 }).withMessage('Settings doit être un tableau non vide'),
  body('settings.*.key').trim().notEmpty().withMessage('Chaque paramètre doit avoir une clé'),
  body('settings.*.value').notEmpty().withMessage('Chaque paramètre doit avoir une valeur')
];

// Public routes
router.get('/public', getPublicSettings);

// Admin routes
router.get('/', authenticate, requireAdmin, getAllSettings);
router.get('/categories', authenticate, requireAdmin, getCategories);
router.get('/category/:category', authenticate, requireAdmin, getSettingsByCategory);
router.get('/:key', authenticate, requireAdmin, getSettingByKey);
router.post('/', authenticate, requireAdmin, upsertSettingValidation, handleValidationErrors, upsertSetting);
router.post('/bulk', authenticate, requireAdmin, updateMultipleValidation, handleValidationErrors, updateMultipleSettings);
router.delete('/:key', authenticate, requireAdmin, deleteSetting);

export default router;
