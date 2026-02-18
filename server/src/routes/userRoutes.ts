import { Router } from 'express';
import { body } from 'express-validator';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  resetUserPassword,
  deleteUser,
  getUserStats,
  toggleUserStatus
} from '../controllers/userController';
import { authenticate, requireAdmin, requireSuperAdmin } from '../middlewares/auth';
import { handleValidationErrors } from '../middlewares/errors';

const router = Router();

// Validation rules
const createUserValidation = [
  body('email').isEmail().withMessage('Email invalide'),
  body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  body('full_name').optional().trim(),
  body('role').optional().isIn(['user', 'admin', 'superadmin', 'editor', 'viewer']).withMessage('Rôle invalide'),
  body('active').optional().isBoolean().withMessage('Active doit être un booléen')
];

const updateUserValidation = [
  body('email').optional().isEmail().withMessage('Email invalide'),
  body('full_name').optional().trim(),
  body('role').optional().isIn(['user', 'admin', 'superadmin', 'editor', 'viewer']).withMessage('Rôle invalide'),
  body('active').optional().isBoolean().withMessage('Active doit être un booléen'),
  body('email_verified').optional().isBoolean().withMessage('Email verified doit être un booléen')
];

const resetPasswordValidation = [
  body('new_password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères')
];

// Routes accessibles aux admins (lecture seule)
router.use(authenticate);
router.use(requireAdmin);

// Routes de consultation (tous les admins)
router.get('/', getAllUsers);
router.get('/stats', getUserStats);
router.get('/:id', getUserById);

// Routes de modification (SuperAdmin uniquement)
router.post('/', requireSuperAdmin, createUserValidation, handleValidationErrors, createUser);
router.put('/:id', requireSuperAdmin, updateUserValidation, handleValidationErrors, updateUser);
router.post('/:id/reset-password', requireSuperAdmin, resetPasswordValidation, handleValidationErrors, resetUserPassword);
router.post('/:id/toggle-status', requireSuperAdmin, toggleUserStatus);
router.delete('/:id', requireSuperAdmin, deleteUser);

export default router;
