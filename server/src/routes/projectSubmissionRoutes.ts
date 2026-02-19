import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { body, param, validationResult } from 'express-validator';
import pool from '../config/database';
import { authenticate, requireAdmin } from '../middlewares/auth';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { createNotification } from '../controllers/notificationsController';
import { sendProjectNotificationEmail } from '../utils/emailService';
import logger from '../config/logger';

const router = Router();

interface ProjectSubmission extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  phone: string;
  project_type: string;
  budget: string | null;
  timeline: string | null;
  description: string;
  files_json: any;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected' | 'archived';
  ip_address: string | null;
  user_agent: string | null;
  submission_source: string;
  created_at: Date;
  reviewed_at: Date | null;
  reviewed_by: number | null;
  admin_notes: string | null;
}

// ========================================
// MULTER CONFIGURATION
// ========================================

// Créer dossier par mois: uploads/confidential/projects/YYYY-MM/
const getUploadPath = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const monthDir = `${year}-${month}`;
  // Utiliser le dossier uploads de l'application (monté comme volume Docker)
  const uploadPath = path.join(process.cwd(), 'uploads', 'confidential', 'projects', monthDir);

  // NE PAS créer le dossier ici - cela bloque le chargement du module !
  // La création se fait dans la fonction destination de Multer

  return { uploadPath, monthDir };
};

// Configuration stockage Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { uploadPath } = getUploadPath();
    // Créer le dossier de façon asynchrone seulement quand nécessaire
    if (!fs.existsSync(uploadPath)) {
      try {
        fs.mkdirSync(uploadPath, { recursive: true });
      } catch (error) {
        console.error('Erreur création dossier upload:', error);
        return cb(new Error('Impossible de créer le dossier de destination'), '');
      }
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9]/g, '_')
      .substring(0, 50);
    cb(null, `${basename}-${uniqueSuffix}${ext}`);
  }
});

// Validation fichiers
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/sla', // .stl
    'model/stl',
    'model/obj',
    'application/step',
    'application/iges'
  ];

  const allowedExts = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.stl', '.obj', '.step', '.iges'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedMimes.includes(file.mimetype) || allowedExts.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Type de fichier non autorisé: ${ext}`));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
    files: 5
  }
});

// ========================================
// PUBLIC ROUTE - Soumettre un projet
// ========================================

router.post(
  '/submit',
  upload.array('files', 5), // Max 5 fichiers
  [
    body('name').trim().notEmpty().withMessage('Nom requis'),
    body('email').isEmail().withMessage('Email invalide'),
    body('phone').trim().notEmpty().withMessage('Téléphone requis'),
    body('projectType').trim().notEmpty().withMessage('Type de projet requis'),
    body('description').trim().notEmpty().withMessage('Description requise')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Supprimer fichiers uploadés en cas d'erreur
      if (req.files && Array.isArray(req.files)) {
        req.files.forEach(file => fs.unlinkSync(file.path));
      }
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, phone, projectType, budget, timeline, description } = req.body;

    const files = req.files as Express.Multer.File[];
    const { monthDir } = getUploadPath();

    const filesJson = files ? files.map(file => ({
      originalName: file.originalname,
      storedName: file.filename,
      path: `uploads/confidential/projects/${monthDir}/${file.filename}`,
      size: file.size,
      mimetype: file.mimetype,
      uploadedAt: new Date().toISOString()
    })) : [];

    const ip_address = req.ip || req.connection.remoteAddress || null;
    const user_agent = req.get('User-Agent') || null;

    try {
      const [result] = await pool.query<ResultSetHeader>(
        `INSERT INTO project_submissions
        (name, email, phone, project_type, budget, timeline, description, files_json,
         ip_address, user_agent, submission_source)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'web')`,
        [
          name,
          email,
          phone,
          projectType,
          budget || null,
          timeline || null,
          description,
          JSON.stringify(filesJson),
          ip_address,
          user_agent
        ]
      );

      const submissionId = result.insertId;

      if (files && files.length > 0) {
        const fileInserts = files.map(file => [
          submissionId,
          file.originalname,
          file.filename,
          `uploads/confidential/projects/${monthDir}/${file.filename}`,
          file.size,
          file.mimetype,
          path.extname(file.originalname)
        ]);

        await pool.query(
          `INSERT INTO submission_files
          (submission_id, original_filename, stored_filename, file_path, file_size, mime_type, file_extension)
          VALUES ?`,
          [fileInserts]
        );
      }

      // Créer une notification pour tous les admins (admin ET superadmin)
      const [admins] = await pool.query<RowDataPacket[]>(
        'SELECT id FROM users WHERE role IN (?, ?)',
        ['admin', 'superadmin']
      );

      for (const admin of admins) {
        await createNotification(
          admin.id.toString(),
          'project',
          'Nouvelle soumission de projet',
          `${name} a soumis un projet: ${projectType}`,
          `/contacts`
        );
      }

      // Envoyer une notification email à l'administrateur (non-bloquant)
      sendProjectNotificationEmail({
        name,
        email,
        phone,
        projectType,
        budget,
        timeline,
        description,
        filesCount: filesJson.length,
        projectId: submissionId
      }).catch(err => {
        logger.warn('⚠️  Email de notification projet non envoyé:', err?.text || err?.message || err);
      });

      res.status(201).json({
        success: true,
        message: 'Projet soumis avec succès! Notre équipe vous contactera sous 48h.',
        data: {
          id: submissionId,
          filesCount: filesJson.length
        }
      });
    } catch (error) {
      console.error('Erreur soumission projet:', error);

      if (files && files.length > 0) {
        files.forEach(file => {
          try {
            fs.unlinkSync(file.path);
          } catch (e) {
            console.error('Erreur suppression fichier:', e);
          }
        });
      }

      res.status(500).json({ success: false, message: 'Erreur lors de la soumission' });
    }
  }
);

// ========================================
// ADMIN ROUTES
// ========================================

router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;

    let query = 'SELECT * FROM project_submissions';
    const params: any[] = [];

    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const [rows] = await pool.query<ProjectSubmission[]>(query, params);

    const data = rows.map(row => ({
      ...row,
      files: typeof row.files_json === 'string' ? JSON.parse(row.files_json) : row.files_json
    }));

    let countQuery = 'SELECT COUNT(*) as total FROM project_submissions';
    if (status) countQuery += ' WHERE status = ?';
    const [countResult] = await pool.query<any[]>(countQuery, status ? [status] : []);

    res.json({
      success: true,
      data,
      pagination: {
        total: countResult[0].total,
        limit: Number(limit),
        offset: Number(offset)
      }
    });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// Route pour obtenir le nombre de projets non lus (AVANT /:id pour éviter les conflits)
router.get('/unread-count', authenticate, requireAdmin, async (req, res) => {
  try {
    const [result] = await pool.query<RowDataPacket[]>(
      'SELECT COUNT(*) as count FROM project_submissions WHERE status = ?',
      ['pending']
    );

    res.json({ success: true, count: result[0].count });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

router.get('/:id', authenticate, requireAdmin, param('id').isInt(), async (req, res) => {
  try {
    const [rows] = await pool.query<ProjectSubmission[]>(
      'SELECT * FROM project_submissions WHERE id = ?',
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Soumission non trouvée' });
    }

    const submission = {
      ...rows[0],
      files: typeof rows[0].files_json === 'string' ? JSON.parse(rows[0].files_json) : rows[0].files_json
    };

    res.json({ success: true, data: submission });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

router.patch(
  '/:id/status',
  authenticate,
  requireAdmin,
  [param('id').isInt(), body('status').isIn(['pending', 'reviewing', 'approved', 'rejected', 'archived'])],
  async (req, res) => {
    try {
      const { status, admin_notes } = req.body;
      const userId = (req as any).user?.id;

      const [result] = await pool.query<ResultSetHeader>(
        `UPDATE project_submissions
        SET status = ?, reviewed_at = NOW(), reviewed_by = ?, admin_notes = ?
        WHERE id = ?`,
        [status, userId, admin_notes || null, req.params.id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Soumission non trouvée' });
      }

      res.json({ success: true, message: 'Statut mis à jour' });
    } catch (error) {
      console.error('Erreur:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  }
);

router.get(
  '/:id/files/:filename',
  authenticate,
  requireAdmin,
  param('id').isInt(),
  async (req, res) => {
    try {
      const [submission] = await pool.query<ProjectSubmission[]>(
        'SELECT files_json FROM project_submissions WHERE id = ?',
        [req.params.id]
      );

      if (submission.length === 0) {
        return res.status(404).json({ success: false, message: 'Soumission non trouvée' });
      }

      const files = typeof submission[0].files_json === 'string'
        ? JSON.parse(submission[0].files_json)
        : submission[0].files_json;

      const file = files.find((f: any) => f.storedName === req.params.filename);

      if (!file) {
        return res.status(404).json({ success: false, message: 'Fichier non trouvé' });
      }

      const filePath = path.join(process.cwd(), file.path);

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ success: false, message: 'Fichier introuvable sur le serveur' });
      }

      res.download(filePath, file.originalName);
    } catch (error) {
      console.error('Erreur:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  }
);

router.delete('/:id', authenticate, requireAdmin, param('id').isInt(), async (req, res) => {
  try {
    const [submission] = await pool.query<ProjectSubmission[]>(
      'SELECT files_json FROM project_submissions WHERE id = ?',
      [req.params.id]
    );

    if (submission.length === 0) {
      return res.status(404).json({ success: false, message: 'Soumission non trouvée' });
    }

    const files = typeof submission[0].files_json === 'string'
      ? JSON.parse(submission[0].files_json)
      : submission[0].files_json;

    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM project_submissions WHERE id = ?',
      [req.params.id]
    );

    if (files && Array.isArray(files)) {
      files.forEach((file: any) => {
        try {
          const filePath = path.join(process.cwd(), file.path);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } catch (e) {
          console.error('Erreur suppression fichier:', e);
        }
      });
    }

    res.json({ success: true, message: 'Soumission supprimée' });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

export default router;
