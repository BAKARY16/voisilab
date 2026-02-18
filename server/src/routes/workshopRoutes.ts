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
  body('description').optional({ nullable: true }).trim(),
  body('date').optional({ nullable: true }).isISO8601().withMessage('Date invalide'),
  body('location').optional({ nullable: true }).trim(),
  body('capacity').optional({ nullable: true }).toInt().isInt({ min: 1 }).withMessage('Nombre de places doit être positif'),
  body('price').optional({ nullable: true }).toFloat(),
  body('level').optional({ nullable: true }).isIn(['debutant', 'intermediaire', 'avance', 'Débutant', 'Intermédiaire', 'Avancé', 'Tous niveaux']).withMessage('Niveau invalide'),
  body('status').optional({ nullable: true }).isIn(['upcoming', 'ongoing', 'completed', 'cancelled']).withMessage('Statut invalide'),
  body('active').optional({ nullable: true }).isBoolean()
];

const updateWorkshopValidation = [
  body('title').optional({ nullable: true }).trim().notEmpty().withMessage('Titre ne peut pas être vide'),
  body('date').optional({ nullable: true }).isISO8601().withMessage('Date invalide'),
  body('capacity').optional({ nullable: true }).toInt().isInt({ min: 1 }).withMessage('Nombre de places doit être positif'),
  body('price').optional({ nullable: true }).toFloat(),
  body('level').optional({ nullable: true }).isIn(['debutant', 'intermediaire', 'avance', 'Débutant', 'Intermédiaire', 'Avancé', 'Tous niveaux']).withMessage('Niveau invalide'),
  body('status').optional({ nullable: true }).isIn(['upcoming', 'ongoing', 'completed', 'cancelled']).withMessage('Statut invalide'),
  body('active').optional({ nullable: true }).isBoolean()
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
