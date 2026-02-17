import { Router } from 'express';
import { body } from 'express-validator';
import {
  getAllEquipment,
  getAvailableEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment,
  getEquipmentCategories
} from '../controllers/equipmentController';
import { authenticate, requireAdmin } from '../middlewares/auth';
import { handleValidationErrors } from '../middlewares/errors';

const router = Router();

// Validation rules
const createEquipmentValidation = [
  body('name').trim().notEmpty().withMessage('Nom requis'),
  body('description').optional().trim(),
  body('category').optional().trim(),
  body('status').optional().isIn(['available', 'in_use', 'maintenance', 'unavailable']).withMessage('Statut invalide'),
  body('specifications').optional().isObject().withMessage('Specifications doit être un objet')
];

const updateEquipmentValidation = [
  body('name').optional().trim().notEmpty().withMessage('Nom ne peut pas être vide'),
  body('status').optional().isIn(['available', 'in_use', 'maintenance', 'unavailable']).withMessage('Statut invalide'),
  body('specifications').optional().isObject().withMessage('Specifications doit être un objet')
];

// Public routes
router.get('/available', getAvailableEquipment);
router.get('/categories', getEquipmentCategories);

// Admin routes
router.get('/', authenticate, requireAdmin, getAllEquipment);
router.get('/:id', authenticate, requireAdmin, getEquipmentById);
router.post('/', authenticate, requireAdmin, createEquipmentValidation, handleValidationErrors, createEquipment);
router.put('/:id', authenticate, requireAdmin, updateEquipmentValidation, handleValidationErrors, updateEquipment);
router.delete('/:id', authenticate, requireAdmin, deleteEquipment);

export default router;
