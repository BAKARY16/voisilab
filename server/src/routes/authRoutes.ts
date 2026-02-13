import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, refreshToken, getProfile, updateProfile, changePassword } from '../controllers/authController';
import { authenticate } from '../middlewares/auth';
import { handleValidationErrors } from '../middlewares/errors';

const router = Router();

// Validation rules
const registerValidation = [
  body('email').isEmail().withMessage('Email invalide'),
  body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  body('full_name').optional().trim()
];

const loginValidation = [
  body('email').isEmail().withMessage('Email invalide'),
  body('password').notEmpty().withMessage('Mot de passe requis')
];

const changePasswordValidation = [
  body('current_password').notEmpty().withMessage('Mot de passe actuel requis'),
  body('new_password').isLength({ min: 6 }).withMessage('Le nouveau mot de passe doit contenir au moins 6 caractères')
];

// Routes
router.post('/register', registerValidation, handleValidationErrors, register);
router.post('/login', loginValidation, handleValidationErrors, login);
router.post('/refresh', authenticate, refreshToken);
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.post('/change-password', authenticate, changePasswordValidation, handleValidationErrors, changePassword);

export default router;
