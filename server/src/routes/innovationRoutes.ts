import { Router } from 'express';
import { authenticate, authorizeAdmin } from '../middlewares/auth';
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
router.get('/', authenticate, authorizeAdmin, getAllInnovations);

// Create new innovation
router.post('/', authenticate, authorizeAdmin, createInnovation);

// Update innovation
router.put('/:id', authenticate, authorizeAdmin, updateInnovation);

// Delete innovation
router.delete('/:id', authenticate, authorizeAdmin, deleteInnovation);

// Toggle publish status
router.patch('/:id/publish', authenticate, authorizeAdmin, togglePublish);

// Toggle featured status
router.patch('/:id/featured', authenticate, authorizeAdmin, toggleFeatured);

// ===============================
// PUBLIC ROUTE (catch-all for ID - MUST be last)
// ===============================

// Get single innovation by ID (increments views)
router.get('/:id', getInnovationById);

export default router;
