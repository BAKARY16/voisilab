import { Router } from 'express';
import { body, param, validationResult } from 'express-validator';
import pool from '../config/database';
import { authenticate, requireAdmin } from '../middlewares/auth';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

const router = Router();

interface TeamMember extends RowDataPacket {
  id: number;
  first_name: string;
  last_name: string;
  title: string;
  department: string | null;
  bio: string | null;
  photo_url: string | null;
  email: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

// Public route - Active team members only
router.get('/active', async (req, res) => {
  try {
    const [rows] = await pool.query<TeamMember[]>(
      'SELECT * FROM team WHERE is_active = TRUE ORDER BY display_order ASC'
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// Admin routes - All team members
router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query<TeamMember[]>(
      'SELECT * FROM team ORDER BY display_order ASC, created_at DESC'
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

router.post('/',
  authenticate,
  requireAdmin,
  [
    body('first_name').trim().notEmpty(),
    body('last_name').trim().notEmpty(),
    body('title').trim().notEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { first_name, last_name, title, department, bio, photo_url, email, linkedin_url, twitter_url, display_order = 0, is_active = true } = req.body;

    try {
      const [result] = await pool.query<ResultSetHeader>(
        'INSERT INTO team (first_name, last_name, title, department, bio, photo_url, email, linkedin_url, twitter_url, display_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [first_name, last_name, title, department, bio, photo_url, email, linkedin_url, twitter_url, display_order, is_active]
      );

      const [newMember] = await pool.query<TeamMember[]>('SELECT * FROM team WHERE id = ?', [result.insertId]);
      res.status(201).json({ success: true, data: newMember[0] });
    } catch (error) {
      console.error('Erreur:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  }
);

router.put('/:id', authenticate, requireAdmin, param('id').isInt(), async (req, res) => {
  try {
    const allowedFields = ['first_name', 'last_name', 'title', 'department', 'bio', 'photo_url', 'email', 'linkedin_url', 'twitter_url', 'display_order', 'is_active'];
    const updates: string[] = [];
    const values: any[] = [];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates.push(field + ' = ?');
        values.push(req.body[field]);
      }
    });

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'Aucune donnée' });
    }

    values.push(req.params.id);
    await pool.query('UPDATE team SET ' + updates.join(', ') + ' WHERE id = ?', values);

    const [updated] = await pool.query<TeamMember[]>('SELECT * FROM team WHERE id = ?', [req.params.id]);
    res.json({ success: true, data: updated[0] });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

router.delete('/:id', authenticate, requireAdmin, param('id').isInt(), async (req, res) => {
  try {
    const [result] = await pool.query<ResultSetHeader>('DELETE FROM team WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Non trouvé' });
    }
    res.json({ success: true, message: 'Supprimé' });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

export default router;
