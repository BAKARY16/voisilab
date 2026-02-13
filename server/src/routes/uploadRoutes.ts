import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { authenticate } from '../middlewares/auth';
import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/errors';
import fs from 'fs';

const router = Router();

// Configuration multer pour les avatars
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/avatars');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `avatar-${uniqueSuffix}${ext}`);
  }
});

const avatarUpload = multer({
  storage: avatarStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Seules les images sont autorisées (jpeg, jpg, png, gif)'));
    }
  }
});

// POST /api/upload/avatar - Upload avatar
router.post(
  '/avatar',
  authenticate,
  avatarUpload.single('file'),
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier fourni' });
    }

    const fileUrl = `/uploads/avatars/${req.file.filename}`;

    res.json({
      message: 'Avatar uploadé avec succès',
      url: fileUrl,
      filename: req.file.filename
    });
  })
);

export default router;
