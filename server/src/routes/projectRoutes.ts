import { Router } from 'express';
import { body } from 'express-validator';
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProjectStatus,
  deleteProject,
  getProjectStats
} from '../controllers/projectController';
import { authenticate, requireAdmin } from '../middlewares/auth';
import { handleValidationErrors } from '../middlewares/errors';

const router = Router();

// Validation
const createProjectValidation = [
  body('name').trim().notEmpty().withMessage('Nom requis'),
  body('email').isEmail().withMessage('Email invalide'),
  body('title').trim().notEmpty().withMessage('Titre requis'),
  body('description').trim().notEmpty().withMessage('Description requise')
];

const updateStatusValidation = [
  body('status').isIn(['pending', 'reviewing', 'approved', 'rejected']).withMessage('Statut invalide')
];

// Public routes
router.post('/', createProjectValidation, handleValidationErrors, createProject);

// Admin routes
router.get('/', authenticate, requireAdmin, getAllProjects);
router.get('/stats', authenticate, requireAdmin, getProjectStats);
router.get('/:id', authenticate, requireAdmin, getProjectById);
router.put('/:id/status', authenticate, requireAdmin, updateStatusValidation, handleValidationErrors, updateProjectStatus);
router.delete('/:id', authenticate, requireAdmin, deleteProject);

export default router;
