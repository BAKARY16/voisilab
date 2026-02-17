import { Router } from 'express';
import { body } from 'express-validator';
import {
  getAllPages,
  getPublishedPages,
  getPageBySlug,
  getPageById,
  createPage,
  updatePage,
  deletePage
} from '../controllers/pageController';
import { authenticate, requireAdmin } from '../middlewares/auth';
import { handleValidationErrors } from '../middlewares/errors';

const router = Router();

// Validation rules
const createPageValidation = [
  body('title').trim().notEmpty().withMessage('Titre requis'),
  body('content').notEmpty().withMessage('Contenu requis'),
  body('template').optional().trim(),
  body('status').optional().isIn(['draft', 'published', 'archived']).withMessage('Statut invalide'),
  body('meta_keywords').optional().isArray().withMessage('Meta keywords doit être un tableau')
];

const updatePageValidation = [
  body('title').optional().trim().notEmpty().withMessage('Titre ne peut pas être vide'),
  body('content').optional().notEmpty().withMessage('Contenu ne peut pas être vide'),
  body('status').optional().isIn(['draft', 'published', 'archived']).withMessage('Statut invalide'),
  body('meta_keywords').optional().isArray().withMessage('Meta keywords doit être un tableau')
];

// Public routes
router.get('/published', getPublishedPages);
router.get('/slug/:slug', getPageBySlug);

// Admin routes
router.get('/', authenticate, requireAdmin, getAllPages);
router.get('/:id', authenticate, requireAdmin, getPageById);
router.post('/', authenticate, requireAdmin, createPageValidation, handleValidationErrors, createPage);
router.put('/:id', authenticate, requireAdmin, updatePageValidation, handleValidationErrors, updatePage);
router.delete('/:id', authenticate, requireAdmin, deletePage);

export default router;
