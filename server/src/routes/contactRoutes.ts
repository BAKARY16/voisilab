import { Router } from 'express';
import { body, param, validationResult } from 'express-validator';
import pool from '../config/database';
import { authenticate, requireAdmin } from '../middlewares/auth';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

const router = Router();

interface ContactMessage extends RowDataPacket {
  id: number;
  lastname: string;
  firstname: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied' | 'archived';
  ip_address: string | null;
  user_agent: string | null;
  created_at: Date;
  read_at: Date | null;
  replied_at: Date | null;
  replied_by: number | null;
  reply_content: string | null;
}

// ========================================
// PUBLIC ROUTE - Soumettre un message
// ========================================
router.post(
  '/submit',
  [
    body('lastname').trim().notEmpty().withMessage('Nom requis'),
    body('firstname').trim().notEmpty().withMessage('Prénom requis'),
    body('email').isEmail().withMessage('Email invalide'),
    body('phone').trim().notEmpty().withMessage('Téléphone requis'),
    body('subject').trim().notEmpty().withMessage('Sujet requis'),
    body('message').trim().notEmpty().withMessage('Message requis')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { lastname, firstname, email, phone, subject, message } = req.body;

    // Récupérer IP et User-Agent pour sécurité
    const ip_address = req.ip || req.connection.remoteAddress || null;
    const user_agent = req.get('User-Agent') || null;

    try {
      console.log('Tentative d\'insertion dans la base de données...');
      console.log('Données reçues:', { lastname, firstname, email, phone, subject, message });
      
      const [result] = await pool.query<ResultSetHeader>(
        `INSERT INTO contact_messages
        (lastname, firstname, email, phone, subject, message, ip_address, user_agent)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [lastname, firstname, email, phone, subject, message, ip_address, user_agent]
      );

      console.log('Message inséré avec succès, ID:', result.insertId);

      res.status(201).json({
        success: true,
        message: 'Message envoyé avec succès! Nous vous répondrons sous 24h.',
        data: { id: result.insertId }
      });
    } catch (error: any) {
      console.error('Erreur détaillée soumission contact:', error);
      console.error('Code erreur MySQL:', error.code);
      console.error('Message erreur:', error.message);
      
      let errorMessage = 'Erreur lors de l\'envoi du message';
      
      // Erreurs spécifiques MySQL
      if (error.code === 'ER_NO_SUCH_TABLE') {
        errorMessage = 'Table contact_messages non trouvée dans la base de données';
      } else if (error.code === 'ER_BAD_FIELD_ERROR') {
        errorMessage = 'Champ invalide dans la table contact_messages';
      } else if (error.code === 'ECONNREFUSED') {
        errorMessage = 'Impossible de se connecter à la base de données';
      }
      
      res.status(500).json({ 
        success: false, 
        message: errorMessage,
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

// ADMIN ROUTES
router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;

    let query = 'SELECT * FROM contact_messages';
    const params: any[] = [];

    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const [rows] = await pool.query<ContactMessage[]>(query, params);

    let countQuery = 'SELECT COUNT(*) as total FROM contact_messages';
    if (status) countQuery += ' WHERE status = ?';
    const [countResult] = await pool.query<any[]>(countQuery, status ? [status] : []);

    res.json({
      success: true,
      data: rows,
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

router.get('/:id', authenticate, requireAdmin, param('id').isInt(), async (req, res) => {
  try {
    const [rows] = await pool.query<ContactMessage[]>(
      'SELECT * FROM contact_messages WHERE id = ?',
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Message non trouvé' });
    }

    if (rows[0].status === 'unread') {
      await pool.query(
        'UPDATE contact_messages SET status = ?, read_at = NOW() WHERE id = ?',
        ['read', req.params.id]
      );
      rows[0].status = 'read';
      rows[0].read_at = new Date();
    }

    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

router.patch(
  '/:id/status',
  authenticate,
  requireAdmin,
  [param('id').isInt(), body('status').isIn(['unread', 'read', 'replied', 'archived'])],
  async (req, res) => {
    try {
      const { status } = req.body;
      const userId = (req as any).user?.id;

      let updateQuery = 'UPDATE contact_messages SET status = ?';
      const params: any[] = [status];

      if (status === 'read') {
        updateQuery += ', read_at = NOW()';
      } else if (status === 'replied') {
        updateQuery += ', replied_at = NOW(), replied_by = ?';
        params.push(userId);
      }

      updateQuery += ' WHERE id = ?';
      params.push(req.params.id);

      const [result] = await pool.query<ResultSetHeader>(updateQuery, params);

      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Message non trouvé' });
      }

      res.json({ success: true, message: 'Statut mis à jour' });
    } catch (error) {
      console.error('Erreur:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  }
);

router.delete('/:id', authenticate, requireAdmin, param('id').isInt(), async (req, res) => {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM contact_messages WHERE id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Message non trouvé' });
    }

    res.json({ success: true, message: 'Message supprimé' });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

export default router;
