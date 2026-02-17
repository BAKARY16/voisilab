import { Router } from 'express';
import { authenticate, requireAdmin } from '../middlewares/auth';
import {
  getAllInnovations,
  getPublishedInnovations,
  getCategories,
  getInnovationById,
  createInnovation,
  updateInnovation,
  deleteInnovation,
  likeInnovation,
  togglePublish,
  toggleFeatured
} from '../controllers/innovationController';

const router = Router();

// ===============================
// PUBLIC ROUTES (specific paths first)
// ===============================

// Get all published innovations (for public display)
router.get('/published', getPublishedInnovations);

// Get categories with counts
router.get('/categories', getCategories);

// Like an innovation
router.post('/:id/like', likeInnovation);

// ===============================
// ADMIN ROUTES (Protected)
// ===============================

// Get all innovations with pagination (admin) - MUST be before /:id
router.get('/', authenticate, requireAdmin, getAllInnovations);

// Create new innovation
router.post('/', authenticate, requireAdmin, createInnovation);

// Update innovation
router.put('/:id', authenticate, requireAdmin, updateInnovation);

// Delete innovation
router.delete('/:id', authenticate, requireAdmin, deleteInnovation);

// Toggle publish status
router.patch('/:id/publish', authenticate, requireAdmin, togglePublish);

// Toggle featured status
router.patch('/:id/featured', authenticate, requireAdmin, toggleFeatured);

// ===============================
// PUBLIC ROUTE (catch-all for ID - MUST be last)
// ===============================

// Get single innovation by ID (increments views)
router.get('/:id', getInnovationById);

export default router;
