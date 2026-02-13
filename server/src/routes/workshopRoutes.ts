import { Router } from 'express';
import { body } from 'express-validator';
import {
  getAllWorkshops,
  getUpcomingWorkshops,
  getWorkshopById,
  createWorkshop,
  updateWorkshop,
  deleteWorkshop,
  getWorkshopRegistrations,
  registerForWorkshop
} from '../controllers/workshopController';
import { authenticate, requireAdmin } from '../middlewares/auth';
import { handleValidationErrors } from '../middlewares/errors';

const router = Router();

// Validation rules
const createWorkshopValidation = [
  body('title').trim().notEmpty().withMessage('Titre requis'),
  body('description').optional().trim(),
  body('date').isISO8601().withMessage('Date invalide'),
  body('location').optional().trim(),
  body('capacity').optional().isInt({ min: 1 }).withMessage('Capacité doit être un nombre positif'),
  body('price').optional().isDecimal().withMessage('Prix invalide'),
  body('status').optional().isIn(['upcoming', 'ongoing', 'completed', 'cancelled']).withMessage('Statut invalide')
];

const updateWorkshopValidation = [
  body('title').optional().trim().notEmpty().withMessage('Titre ne peut pas être vide'),
  body('date').optional().isISO8601().withMessage('Date invalide'),
  body('capacity').optional().isInt({ min: 1 }).withMessage('Capacité doit être un nombre positif'),
  body('price').optional().isDecimal().withMessage('Prix invalide'),
  body('status').optional().isIn(['upcoming', 'ongoing', 'completed', 'cancelled']).withMessage('Statut invalide')
];

const registerWorkshopValidation = [
  body('name').trim().notEmpty().withMessage('Nom requis'),
  body('email').isEmail().withMessage('Email invalide'),
  body('phone').optional().trim(),
  body('message').optional().trim()
];

// Public routes
router.get('/upcoming', getUpcomingWorkshops);
router.get('/:id/public', getWorkshopById);
router.post('/:id/register', registerWorkshopValidation, handleValidationErrors, registerForWorkshop);

// Admin routes
router.get('/', authenticate, requireAdmin, getAllWorkshops);
router.get('/:id', authenticate, requireAdmin, getWorkshopById);
router.get('/:id/registrations', authenticate, requireAdmin, getWorkshopRegistrations);
router.post('/', authenticate, requireAdmin, createWorkshopValidation, handleValidationErrors, createWorkshop);
router.put('/:id', authenticate, requireAdmin, updateWorkshopValidation, handleValidationErrors, updateWorkshop);
router.delete('/:id', authenticate, requireAdmin, deleteWorkshop);

export default router;
