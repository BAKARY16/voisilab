import { Router } from 'express';
import { body } from 'express-validator';
import {
  getAllServices,
  getActiveServices,
  getServiceById,
  createService,
  updateService,
  deleteService
} from '../controllers/serviceController';
import { authenticate, requireAdmin } from '../middlewares/auth';
import { handleValidationErrors } from '../middlewares/errors';

const router = Router();

// Validation rules
const createServiceValidation = [
  body('title').trim().notEmpty().withMessage('Titre requis'),
  body('description').optional().trim(),
  body('icon').optional().trim(),
  body('features').optional().isArray().withMessage('Features doit être un tableau'),
  body('price_info').optional().trim(),
  body('order_index').optional().isInt({ min: 0 }).withMessage('Order index doit être un nombre positif'),
  body('active').optional().isBoolean().withMessage('Active doit être un booléen')
];

const updateServiceValidation = [
  body('title').optional().trim().notEmpty().withMessage('Titre ne peut pas être vide'),
  body('features').optional().isArray().withMessage('Features doit être un tableau'),
  body('order_index').optional().isInt({ min: 0 }).withMessage('Order index doit être un nombre positif'),
  body('active').optional().isBoolean().withMessage('Active doit être un booléen')
];

// Public routes
router.get('/active', getActiveServices);

// Admin routes
router.get('/', authenticate, requireAdmin, getAllServices);
router.get('/:id', authenticate, requireAdmin, getServiceById);
router.post('/', authenticate, requireAdmin, createServiceValidation, handleValidationErrors, createService);
router.put('/:id', authenticate, requireAdmin, updateServiceValidation, handleValidationErrors, updateService);
router.delete('/:id', authenticate, requireAdmin, deleteService);

export default router;
