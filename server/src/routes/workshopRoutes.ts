import { Router } from 'express';
import { body } from 'express-validator';
import {
  getAllWorkshops,
  getUpcomingWorkshops,
  getPublishedWorkshops,
  getWorkshopById,
  getPublicWorkshopById,
  createWorkshop,
  updateWorkshop,
  deleteWorkshop,
  getWorkshopRegistrations,
  registerForWorkshop,
  getUnreadCount,
  markAsRead,
  markAllAsRead
} from '../controllers/workshopController';
import { authenticate, requireAdmin } from '../middlewares/auth';
import { handleValidationErrors } from '../middlewares/errors';

const router = Router();

// Validation rules
const createWorkshopValidation = [
  body('title').trim().notEmpty().withMessage('Titre requis'),
  body('description').optional().trim(),
  body('date').optional().isISO8601().withMessage('Date invalide'),
  body('location').optional().trim(),
  body('max_participants').optional().toInt().isInt({ min: 1 }).withMessage('Nombre de participants doit être positif'),
  body('price').optional().toFloat(),
  body('type').optional().isIn(['formation', 'atelier', 'evenement']).withMessage('Type invalide'),
  body('level').optional().isIn(['Débutant', 'Intermédiaire', 'Avancé', 'Tous niveaux']).withMessage('Niveau invalide'),
  body('status').optional().isIn(['upcoming', 'ongoing', 'completed', 'cancelled']).withMessage('Statut invalide')
];

const updateWorkshopValidation = [
  body('title').optional().trim().notEmpty().withMessage('Titre ne peut pas être vide'),
  body('date').optional().isISO8601().withMessage('Date invalide'),
  body('max_participants').optional().toInt().isInt({ min: 1 }).withMessage('Nombre de participants doit être positif'),
  body('price').optional().toFloat(),
  body('type').optional().isIn(['formation', 'atelier', 'evenement']).withMessage('Type invalide'),
  body('level').optional().isIn(['Débutant', 'Intermédiaire', 'Avancé', 'Tous niveaux']).withMessage('Niveau invalide'),
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
router.get('/published', getPublishedWorkshops);
router.get('/:id/public', getPublicWorkshopById);
router.post('/:id/register', registerWorkshopValidation, handleValidationErrors, registerForWorkshop);

// Admin routes
router.get('/unread/count', authenticate, requireAdmin, getUnreadCount);
router.post('/mark-all-read', authenticate, requireAdmin, markAllAsRead);
router.get('/', authenticate, requireAdmin, getAllWorkshops);
router.get('/:id', authenticate, requireAdmin, getWorkshopById);
router.post('/:id/read', authenticate, requireAdmin, markAsRead);
router.get('/:id/registrations', authenticate, requireAdmin, getWorkshopRegistrations);
router.post('/', authenticate, requireAdmin, createWorkshopValidation, handleValidationErrors, createWorkshop);
router.put('/:id', authenticate, requireAdmin, updateWorkshopValidation, handleValidationErrors, updateWorkshop);
router.delete('/:id', authenticate, requireAdmin, deleteWorkshop);

export default router;
