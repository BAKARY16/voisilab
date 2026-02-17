import { Request, Response } from 'express';
import { pool } from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { asyncHandler, NotFoundError } from '../middlewares/errors';
import logger from '../config/logger';

/**
 * Get all project submissions with pagination and filters
 */
export const getAllProjects = asyncHandler(async (req: Request, res: Response) => {
  const { status, page = 1, limit = 10, search } = req.query;
  const offset = ((page as number) - 1) * (limit as number);

  let query = 'SELECT * FROM project_submissions WHERE 1=1';
  const params: any[] = [];

  if (status) {
    query += ` AND status = ?`;
    params.push(status);
  }

  if (search) {
    query += ` AND (title LIKE ? OR description LIKE ? OR name LIKE ?)`;
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  const [rows] = await pool.query<RowDataPacket[]>(query, params);

  // Get total count
  let countQuery = 'SELECT COUNT(*) as count FROM project_submissions WHERE 1=1';
  const countParams: any[] = [];

  if (status) {
    countQuery += ` AND status = ?`;
    countParams.push(status);
  }

  if (search) {
    countQuery += ` AND (title LIKE ? OR description LIKE ? OR name LIKE ?)`;
    countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  const [countRows] = await pool.query<RowDataPacket[]>(countQuery, countParams);
  const total = parseInt((countRows[0] as any).count);

  res.json({
    data: rows,
    pagination: {
      total,
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      totalPages: Math.ceil(total / (limit as number))
    }
  });
});

/**
 * Get project by ID
 */
export const getProjectById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM project_submissions WHERE id = ?',
    [id]
  );

  if (rows.length === 0) {
    throw new NotFoundError('Projet non trouvé');
  }

  res.json({ data: rows[0] });
});

/**
 * Create project submission
 */
export const createProject = asyncHandler(async (req: Request, res: Response) => {
  const {
    name,
    email,
    phone,
    project_type,
    title,
    description,
    objectives,
    timeline,
    budget,
    team_size,
    attachments
  } = req.body;

  const [insertResult] = await pool.query<ResultSetHeader>(`INSERT INTO project_submissions (
      name, email, phone, project_type, title, description,
      objectives, timeline, budget, team_size, attachments
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, email, phone, project_type, title, description, objectives, timeline, budget, team_size, JSON.stringify(attachments || [])]
  );

  // Récupérer le projet créé
  const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM project_submissions WHERE id = ?', [insertResult.insertId]);

  logger.info(`Nouveau projet soumis: ${title} par ${email}`);

  res.status(201).json({
    message: 'Projet soumis avec succès',
    data: rows[0]
  });
});

/**
 * Update project status (admin only)
 */
export const updateProjectStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, admin_notes } = req.body;

  const [result] = await pool.query<ResultSetHeader>('UPDATE project_submissions SET status = ?, admin_notes = ?, updated_at = NOW() WHERE id = ?',
    [status, admin_notes, id]
  );

  if (result.affectedRows === 0) {
    throw new NotFoundError('Projet non trouvé');
  }

  // Récupérer le projet mis à jour
  const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM project_submissions WHERE id = ?', [id]);

  logger.info(`Statut du projet ${id} mis à jour: ${status}`);

  res.json({
    message: 'Statut mis à jour',
    data: rows[0]
  });
});

/**
 * Delete project (admin only)
 */
export const deleteProject = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const [result] = await pool.query<ResultSetHeader>('DELETE FROM project_submissions WHERE id = ?',
    [id]
  );

  if (result.affectedRows === 0) {
    throw new NotFoundError('Projet non trouvé');
  }

  logger.info(`Projet supprimé: ${id}`);

  res.json({ message: 'Projet supprimé avec succès' });
});

/**
 * Get project statistics (admin only)
 */
export const getProjectStats = asyncHandler(async (req: Request, res: Response) => {
  const [rows] = await pool.query(`
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
      SUM(CASE WHEN status = 'reviewing' THEN 1 ELSE 0 END) as reviewing,
      SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
      SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected
    FROM project_submissions
  `);

  res.json({ data: rows[0] });
});
