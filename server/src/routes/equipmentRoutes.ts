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
  body('name').trim().notEmpty().withMessage('Le nom est requis'),
  body('category').trim().notEmpty().withMessage('La catégorie est requise'),
  body('description').optional().trim(),
  body('image_url').optional().trim(),
  body('count_info').optional().trim(),
  body('specs').optional().isArray().withMessage('specs doit être un tableau'),
  body('status').optional().isIn(['available', 'maintenance', 'unavailable']).withMessage('Statut invalide'),
  body('category_color').optional().trim(),
  body('gradient').optional().trim(),
  body('order_index').optional().toInt(),
  body('active').optional().toBoolean()
];

const updateEquipmentValidation = [
  body('name').optional().trim().notEmpty().withMessage('Le nom ne peut pas être vide'),
  body('category').optional().trim().notEmpty().withMessage('La catégorie ne peut pas être vide'),
  body('status').optional().isIn(['available', 'maintenance', 'unavailable']).withMessage('Statut invalide'),
  body('specs').optional().isArray().withMessage('specs doit être un tableau'),
  body('order_index').optional().toInt(),
  body('active').optional().toBoolean()
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
