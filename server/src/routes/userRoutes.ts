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
import { authenticate, requireAdmin } from '../middlewares/auth';
import { handleValidationErrors } from '../middlewares/errors';

const router = Router();

// Validation rules
const createUserValidation = [
  body('email').isEmail().withMessage('Email invalide'),
  body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  body('full_name').optional().trim(),
  body('role').optional().isIn(['user', 'admin']).withMessage('Rôle invalide'),
  body('active').optional().isBoolean().withMessage('Active doit être un booléen')
];

const updateUserValidation = [
  body('email').optional().isEmail().withMessage('Email invalide'),
  body('full_name').optional().trim(),
  body('role').optional().isIn(['user', 'admin']).withMessage('Rôle invalide'),
  body('active').optional().isBoolean().withMessage('Active doit être un booléen'),
  body('email_verified').optional().isBoolean().withMessage('Email verified doit être un booléen')
];

const resetPasswordValidation = [
  body('new_password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères')
];

// All routes require admin authentication
router.use(authenticate);
router.use(requireAdmin);

// Routes
router.get('/', getAllUsers);
router.get('/stats', getUserStats);
router.get('/:id', getUserById);
router.post('/', createUserValidation, handleValidationErrors, createUser);
router.put('/:id', updateUserValidation, handleValidationErrors, updateUser);
router.post('/:id/reset-password', resetPasswordValidation, handleValidationErrors, resetUserPassword);
router.post('/:id/toggle-status', toggleUserStatus);
router.delete('/:id', deleteUser);

export default router;
