import { Request, Response } from 'express';
import { pool } from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { asyncHandler, NotFoundError } from '../middlewares/errors';
import logger from '../config/logger';

/**
 * Get all team members with pagination and filters
 */
export const getAllTeamMembers = asyncHandler(async (req: Request, res: Response) => {
  const { active, page = 1, limit = 10 } = req.query;
  const offset = ((page as number) - 1) * (limit as number);

  let query = 'SELECT * FROM team_members WHERE 1=1';
  const params: any[] = [];

  if (active !== undefined) {
    query += ' AND active = ?';
    params.push(active === 'true');
  }

  query += ' ORDER BY order_index ASC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const [rows] = await pool.query<RowDataPacket[]>(query, params);

  // Get total count
  let countQuery = 'SELECT COUNT(*) as count FROM team_members WHERE 1=1';
  const countParams: any[] = [];

  if (active !== undefined) {
    countQuery += ' AND active = ?';
    countParams.push(active === 'true');
  }

  const [countRows] = await pool.query<RowDataPacket[]>(countQuery, countParams);
  const total = parseInt(countRows[0].count as string);

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
 * Get active team members (public)
 */
export const getActiveTeamMembers = asyncHandler(async (req: Request, res: Response) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM team_members WHERE active = true ORDER BY order_index ASC'
  );

  res.json({ data: rows });
});

/**
 * Get team member by ID
 */
export const getTeamMemberById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM team_members WHERE id = ?',
    [id]
  );

  if (rows.length === 0) {
    throw new NotFoundError('Membre non trouvé');
  }

  res.json({ data: rows[0] });
});

/**
 * Create team member
 */
export const createTeamMember = asyncHandler(async (req: Request, res: Response) => {
  const {
    name,
    role,
    bio,
    avatar_url,
    email,
    linkedin_url,
    twitter_url,
    order_index = 0,
    active = true
  } = req.body;

  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO team_members (
      name, role, bio, avatar_url, email, linkedin_url,
      twitter_url, order_index, active
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, role, bio, avatar_url, email, linkedin_url, twitter_url, order_index, active]
  );

  // Récupérer le membre créé
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM team_members WHERE email = ?',
    [email]
  );

  logger.info(`Nouveau membre de l'équipe créé: ${name}`);

  res.status(201).json({
    message: 'Membre créé avec succès',
    data: rows[0]
  });
});

/**
 * Update team member
 */
export const updateTeamMember = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    name,
    role,
    bio,
    avatar_url,
    email,
    linkedin_url,
    twitter_url,
    order_index,
    active
  } = req.body;

  const [result] = await pool.query<ResultSetHeader>(
    `UPDATE team_members SET
      name = COALESCE(?, name),
      role = COALESCE(?, role),
      bio = COALESCE(?, bio),
      avatar_url = COALESCE(?, avatar_url),
      email = COALESCE(?, email),
      linkedin_url = COALESCE(?, linkedin_url),
      twitter_url = COALESCE(?, twitter_url),
      order_index = COALESCE(?, order_index),
      active = COALESCE(?, active)
    WHERE id = ?`,
    [name, role, bio, avatar_url, email, linkedin_url, twitter_url, order_index, active, id]
  );

  if (result.affectedRows === 0) {
    throw new NotFoundError('Membre non trouvé');
  }

  // Récupérer le membre mis à jour
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM team_members WHERE id = ?',
    [id]
  );

  logger.info(`Membre de l'équipe mis à jour: ${id}`);

  res.json({
    message: 'Membre mis à jour avec succès',
    data: rows[0]
  });
});

/**
 * Delete team member
 */
export const deleteTeamMember = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const [result] = await pool.query<ResultSetHeader>(
    'DELETE FROM team_members WHERE id = ?',
    [id]
  );

  if (result.affectedRows === 0) {
    throw new NotFoundError('Membre non trouvé');
  }

  logger.info(`Membre de l'équipe supprimé: ${id}`);

  res.json({ message: 'Membre supprimé avec succès' });
});
