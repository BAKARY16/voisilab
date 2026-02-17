import { Router } from 'express';
import { body } from 'express-validator';
import multer from 'multer';
import {
  getAllMedia,
  getMediaById,
  uploadMedia,
  updateMedia,
  deleteMedia,
  getMediaByType
} from '../controllers/mediaController';
import { authenticate, requireAdmin } from '../middlewares/auth';
import { handleValidationErrors } from '../middlewares/errors';

const router = Router();

// Configure multer for file upload (memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images, videos, audio, and PDFs
    const allowedMimes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
      'video/mp4', 'video/webm',
      'audio/mpeg', 'audio/wav',
      'application/pdf'
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Type de fichier non autorisé'));
    }
  }
});

// Validation rules
const updateMediaValidation = [
  body('title').optional().trim().notEmpty().withMessage('Titre ne peut pas être vide'),
  body('tags').optional().isArray().withMessage('Tags doit être un tableau')
];

// Admin routes
router.get('/', authenticate, requireAdmin, getAllMedia);
router.get('/type/:type', authenticate, requireAdmin, getMediaByType);
router.get('/:id', authenticate, requireAdmin, getMediaById);
router.post('/upload', authenticate, requireAdmin, upload.single('file'), uploadMedia);
router.put('/:id', authenticate, requireAdmin, updateMediaValidation, handleValidationErrors, updateMedia);
router.delete('/:id', authenticate, requireAdmin, deleteMedia);

export default router;
