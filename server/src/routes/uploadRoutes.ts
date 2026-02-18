import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { authenticate } from '../middlewares/auth';
import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/errors';
import fs from 'fs';

const router = Router();

// Configuration multer générique pour tous les uploads
const genericStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = (req.body.folder || 'general') as string;
    const uploadDir = path.join(__dirname, '../../uploads', folder);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const folder = req.body.folder || 'file';
    cb(null, `${folder}-${uniqueSuffix}${ext}`);
  }
});

const genericUpload = multer({
  storage: genericStorage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max
  },
  fileFilter: (req, file, cb) => {
    // Accepte images et certains documents
    const allowedTypes = /jpeg|jpg|png|gif|webp|pdf|doc|docx|svg/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype) || file.mimetype.includes('image') || file.mimetype.includes('pdf');

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Type de fichier non autorisé'));
    }
  }
});

// POST /api/upload - Route générique pour tous les uploads
router.post(
  '/',
  authenticate,
  genericUpload.single('file'),
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier fourni' });
    }

    const folder = req.body.folder || 'general';
    const fileUrl = `/uploads/${folder}/${req.file.filename}`;
    
    res.json({
      success: true,
      message: 'Fichier uploadé avec succès',
      url: fileUrl,
      path: fileUrl,
      filename: req.file.filename
    });
  })
);

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

// Configuration multer pour les photos d'équipe
const teamStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/team');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `team-${uniqueSuffix}${ext}`);
  }
});

const teamUpload = multer({
  storage: teamStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Seules les images sont autorisées (jpeg, jpg, png, gif, webp)'));
    }
  }
});

// POST /api/upload/team - Upload photo équipe
router.post(
  '/team',
  authenticate,
  teamUpload.single('file'),
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier fourni' });
    }

    const fileUrl = `/uploads/team/${req.file.filename}`;

    res.json({
      success: true,
      message: 'Photo uploadée avec succès',
      url: fileUrl,
      filename: req.file.filename
    });
  })
);

// Configuration multer pour les équipements
const equipmentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/equipment');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `equipment-${uniqueSuffix}${ext}`);
  }
});

const equipmentUpload = multer({
  storage: equipmentStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Seules les images sont autorisées (jpeg, jpg, png, gif, webp)'));
    }
  }
});

// POST /api/upload/equipment - Upload image équipement
router.post(
  '/equipment',
  authenticate,
  equipmentUpload.single('file'),
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier fourni' });
    }

    const fileUrl = `/uploads/equipment/${req.file.filename}`;

    res.json({
      success: true,
      message: 'Image équipement uploadée avec succès',
      url: fileUrl,
      filename: req.file.filename
    });
  })
);

// Configuration multer pour les services
const servicesStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/services');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `service-${uniqueSuffix}${ext}`);
  }
});

const servicesUpload = multer({
  storage: servicesStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Seules les images sont autorisées (jpeg, jpg, png, gif, webp)'));
    }
  }
});

// POST /api/upload/services - Upload image service
router.post(
  '/services',
  authenticate,
  servicesUpload.single('file'),
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier fourni' });
    }

    const fileUrl = `/uploads/services/${req.file.filename}`;

    res.json({
      success: true,
      message: 'Image service uploadée avec succès',
      url: fileUrl,
      filename: req.file.filename
    });
  })
);

// Configuration multer pour les blogs
const blogStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/blog');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `blog-${uniqueSuffix}${ext}`);
  }
});

const blogUpload = multer({
  storage: blogStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Seules les images sont autorisées'));
    }
  }
});

// POST /api/upload/blog - Upload image blog
router.post(
  '/blog',
  authenticate,
  blogUpload.single('file'),
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier fourni' });
    }

    const fileUrl = `/uploads/blog/${req.file.filename}`;

    res.json({
      success: true,
      message: 'Image blog uploadée avec succès',
      url: fileUrl,
      filename: req.file.filename
    });
  })
);

// Configuration multer pour les innovations
const innovationStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/innovations');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `innovation-${uniqueSuffix}${ext}`);
  }
});

const innovationUpload = multer({
  storage: innovationStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Seules les images sont autorisées'));
    }
  }
});

// POST /api/upload/innovations - Upload image innovation
router.post(
  '/innovations',
  authenticate,
  innovationUpload.single('file'),
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier fourni' });
    }

    const fileUrl = `/uploads/innovations/${req.file.filename}`;

    res.json({
      success: true,
      message: 'Image innovation uploadée avec succès',
      url: fileUrl,
      filename: req.file.filename
    });
  })
);

// Configuration multer pour les workshops/ateliers
const workshopStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/workshops');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `workshop-${uniqueSuffix}${ext}`);
  }
});

const workshopUpload = multer({
  storage: workshopStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Seules les images sont autorisées'));
    }
  }
});

// POST /api/upload/workshops - Upload image atelier
router.post(
  '/workshops',
  authenticate,
  workshopUpload.single('file'),
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier fourni' });
    }

    const fileUrl = `/uploads/workshops/${req.file.filename}`;

    res.json({
      success: true,
      message: 'Image atelier uploadée avec succès',
      url: fileUrl,
      filename: req.file.filename
    });
  })
);

export default router;
