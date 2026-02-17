import { Router } from 'express';
import { body } from 'express-validator';
import {
  getAllBlogPosts,
  getPublishedBlogPosts,
  getBlogPostBySlug,
  getBlogPostById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getBlogCategories
} from '../controllers/blogController';
import { authenticate, requireAdmin } from '../middlewares/auth';
import { handleValidationErrors } from '../middlewares/errors';

const router = Router();

// Validation rules
const createBlogPostValidation = [
  body('title').trim().notEmpty().withMessage('Titre requis'),
  body('content').trim().notEmpty().withMessage('Contenu requis'),
  body('excerpt').optional().trim(),
  body('category').optional().trim(),
  body('tags').optional().isArray().withMessage('Tags doit être un tableau'),
  body('status').optional().isIn(['draft', 'published', 'archived']).withMessage('Statut invalide')
];

const updateBlogPostValidation = [
  body('title').optional().trim().notEmpty().withMessage('Titre ne peut pas être vide'),
  body('content').optional().trim().notEmpty().withMessage('Contenu ne peut pas être vide'),
  body('tags').optional().isArray().withMessage('Tags doit être un tableau'),
  body('status').optional().isIn(['draft', 'published', 'archived']).withMessage('Statut invalide')
];

// Public routes
router.get('/published', getPublishedBlogPosts);
router.get('/slug/:slug', getBlogPostBySlug);
router.get('/categories', getBlogCategories);

// Admin routes
router.get('/', authenticate, requireAdmin, getAllBlogPosts);
router.get('/:id', authenticate, requireAdmin, getBlogPostById);
router.post('/', authenticate, requireAdmin, createBlogPostValidation, handleValidationErrors, createBlogPost);
router.put('/:id', authenticate, requireAdmin, updateBlogPostValidation, handleValidationErrors, updateBlogPost);
router.delete('/:id', authenticate, requireAdmin, deleteBlogPost);

export default router;
