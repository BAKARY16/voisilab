import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import pool from '../config/database';
import { authenticate, requireAdmin } from '../middlewares/auth';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

const router = Router();

interface TeamMember extends RowDataPacket {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  avatar_url: string | null;
  email: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  order_index: number;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}

// Public route - Active team members
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query<TeamMember[]>(
      'SELECT * FROM team_members WHERE active = TRUE ORDER BY order_index ASC'
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Erreur team GET /:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// Public route - Active team members only (alias)
router.get('/active', async (req, res) => {
  try {
    const [rows] = await pool.query<TeamMember[]>(
      'SELECT * FROM team_members WHERE active = TRUE ORDER BY order_index ASC'
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// Admin routes - All team members
router.get('/all', authenticate, requireAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query<TeamMember[]>(
      'SELECT * FROM team_members ORDER BY order_index ASC, created_at DESC'
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// Create team member
router.post('/',
  authenticate,
  requireAdmin,
  [
    body('name').trim().notEmpty().withMessage('Le nom est requis'),
    body('role').trim().notEmpty().withMessage('Le rôle est requis')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { 
      name, 
      role, 
      bio = '', 
      avatar_url = '', 
      email = '', 
      linkedin_url = '', 
      twitter_url = '', 
      order_index = 0, 
      active = true 
    } = req.body;

    try {
      const [result] = await pool.query<ResultSetHeader>(
        `INSERT INTO team_members (name, role, bio, avatar_url, email, linkedin_url, twitter_url, order_index, active) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, role, bio, avatar_url, email, linkedin_url, twitter_url, order_index, active ? 1 : 0]
      );

      const [newMember] = await pool.query<TeamMember[]>(
        'SELECT * FROM team_members WHERE id = ?', 
        [result.insertId]
      );
      
      res.status(201).json({ success: true, data: newMember[0], message: 'Membre créé avec succès' });
    } catch (error) {
      console.error('Erreur création membre:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  }
);

// Update team member
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const allowedFields = ['name', 'role', 'bio', 'avatar_url', 'email', 'linkedin_url', 'twitter_url', 'order_index', 'active'];
    const updates: string[] = [];
    const values: any[] = [];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates.push(`${field} = ?`);
        if (field === 'active') {
          values.push(req.body[field] ? 1 : 0);
        } else {
          values.push(req.body[field]);
        }
      }
    });

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'Aucune donnée à mettre à jour' });
    }

    values.push(req.params.id);
    await pool.query(
      `UPDATE team_members SET ${updates.join(', ')} WHERE id = ?`, 
      values
    );

    const [updated] = await pool.query<TeamMember[]>(
      'SELECT * FROM team_members WHERE id = ?', 
      [req.params.id]
    );
    
    if (updated.length === 0) {
      return res.status(404).json({ success: false, message: 'Membre non trouvé' });
    }
    
    res.json({ success: true, data: updated[0], message: 'Membre mis à jour' });
  } catch (error) {
    console.error('Erreur mise à jour membre:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// Delete team member
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM team_members WHERE id = ?', 
      [req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Membre non trouvé' });
    }
    
    res.json({ success: true, message: 'Membre supprimé avec succès' });
  } catch (error) {
    console.error('Erreur suppression membre:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

export default router;

