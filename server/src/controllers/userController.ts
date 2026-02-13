import { Request, Response } from 'express';
import { pool } from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { hashPassword } from '../config/auth';
import { asyncHandler, NotFoundError, ValidationError } from '../middlewares/errors';
import logger from '../config/logger';

/**
 * Get all users with pagination and filters (admin only)
 */
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const { role, active, page = 1, limit = 10, search } = req.query;
  const offset = ((page as number) - 1) * (limit as number);

  let query = 'SELECT id, email, full_name, role, avatar_url, active, email_verified, last_login, created_at FROM users WHERE 1=1';
  const params: any[] = [];
  let paramIndex = 1;

  if (role) {
    query += ` AND role = $${paramIndex}`;
    params.push(role);
    paramIndex++;
  }

  if (active !== undefined) {
    query += ` AND active = $${paramIndex}`;
    params.push(active === 'true');
    paramIndex++;
  }

  if (search) {
    query += ` AND (email ILIKE $${paramIndex} OR full_name ILIKE $${paramIndex})`;
    params.push(`%${search}%`);
    paramIndex++;
  }

  query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  params.push(limit, offset);

  let result = await pool.query(query, params);

  // Get total count
  let countQuery = 'SELECT COUNT(*) as count FROM users WHERE 1=1';
  const countParams: any[] = [];
  let countParamIndex = 1;

  if (role) {
    countQuery += ` AND role = $${countParamIndex}`;
    countParams.push(role);
    countParamIndex++;
  }

  if (active !== undefined) {
    countQuery += ` AND active = $${countParamIndex}`;
    countParams.push(active === 'true');
  }

  if (search) {
    countQuery += ` AND (email ILIKE $${countParamIndex} OR full_name ILIKE $${countParamIndex})`;
    countParams.push(`%${search}%`);
  }

  const [countRows] = await pool.query<RowDataPacket[]>( pool.query(countQuery, countParams);
  const total = parseInt(countRows[0].count);

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
 * Get user by ID (admin only)
 */
export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const [rows] = await pool.query<RowDataPacket[]>('SELECT id, email, full_name, role, avatar_url, active, email_verified, last_login, created_at FROM users WHERE id = ?',
    [id]
  );

  if (rows.length === 0) {
    throw new NotFoundError('Utilisateur non trouvé');
  }

  res.json({ data: rows[0] });
});

/**
 * Create user (admin only)
 */
export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, full_name, role = 'user', active = true } = req.body;

  // Check if user exists
  const existingUser = await pool.query(
    'SELECT id FROM users WHERE email = ?',
    [email]
  );

  if (existingUser.rows.length > 0) {
    throw new ValidationError('Un utilisateur avec cet email existe déjà');
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Create user
  const [insertResult] = await pool.query<ResultSetHeader>( `INSERT INTO users (email, password_hash, full_name, role, active)
     VALUES (?, ?, ?, ?, ?)
    , email, full_name, role, active, created_at`,
    [email, passwordHash, full_name || `', role, active]
  );

  logger.info(`Nouvel utilisateur créé par admin: ${email}`);

  res.status(201).json({
    message: 'Utilisateur créé avec succès',
    data: rows[0]
  });
});

/**
 * Update user (admin only)
 */
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { email, full_name, role, active, email_verified, avatar_url } = req.body;

  // If email is being changed, check if it's already taken
  if (email) {
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = ? AND id != ?',
      [email, id]
    );

    if (existingUser.rows.length > 0) {
      throw new ValidationError('Un utilisateur avec cet email existe déjà');
    }
  }

  const [updateResult] = await pool.query<ResultSetHeader>( `UPDATE users SET
      email = COALESCE(?, email),
      full_name = COALESCE(?, full_name),
      role = COALESCE(?, role),
      active = COALESCE(?, active),
      email_verified = COALESCE(?, email_verified),
      avatar_url = COALESCE(?, avatar_url)
    WHERE id = ?
   , email, full_name, role, avatar_url, active, email_verified`,
    [email, full_name, role, active, email_verified, avatar_url, id]
  );

  if (rows.length === 0) {
    throw new NotFoundError(`Utilisateur non trouvé');
  }

  logger.info(`Utilisateur mis à jour par admin: ${id}`);

  res.json({
    message: 'Utilisateur mis à jour avec succès',
    data: rows[0]
  });
});

/**
 * Reset user password (admin only)
 */
export const resetUserPassword = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { new_password } = req.body;

  if (!new_password) {
    throw new ValidationError('Nouveau mot de passe requis');
  }

  // Hash new password
  const passwordHash = await hashPassword(new_password);

  // Update password
  const [result] = await pool.query<ResultSetHeader>('UPDATE users SET password_hash = ? WHERE id = ?',
    [passwordHash, id]
  );

  if (rows.length === 0) {
    throw new NotFoundError('Utilisateur non trouvé');
  }

  logger.info(`Mot de passe réinitialisé par admin pour l'utilisateur: ${id}`);

  res.json({ message: 'Mot de passe réinitialisé avec succès' });
});

/**
 * Delete user (admin only)
 */
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Prevent deleting yourself
  if (id === req.user?.userId) {
    throw new ValidationError('Vous ne pouvez pas supprimer votre propre compte');
  }

  const [result] = await pool.query<ResultSetHeader>('DELETE FROM users WHERE id = ?, email',
    [id]
  );

  if (rows.length === 0) {
    throw new NotFoundError('Utilisateur non trouvé');
  }

  logger.info(`Utilisateur supprimé par admin: ${rows[0].email}`);

  res.json({ message: 'Utilisateur supprimé avec succès' });
});

/**
 * Get user statistics (admin only)
 */
export const getUserStats = asyncHandler(async (req: Request, res: Response) => {
  let result = await pool.query(`
    SELECT
      COUNT(*) as total,
      COUNT(*) as count FILTER (WHERE role = 'admin') as admins,
      COUNT(*) as count FILTER (WHERE role = 'user') as users,
      COUNT(*) as count FILTER (WHERE active = true) as active_users,
      COUNT(*) as count FILTER (WHERE email_verified = true) as verified_users,
      COUNT(*) as count FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') as new_last_month
    FROM users
  `);

  res.json({ data: rows[0] });
});

/**
 * Toggle user active status (admin only)
 */
export const toggleUserStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Prevent deactivating yourself
  if (id === req.user?.userId) {
    throw new ValidationError('Vous ne pouvez pas désactiver votre propre compte');
  }

  const [result] = await pool.query<ResultSetHeader>('UPDATE users SET active = NOT active WHERE id = ?, email, active',
    [id]
  );

  if (rows.length === 0) {
    throw new NotFoundError('Utilisateur non trouvé');
  }

  const user = rows[0];
  logger.info(`Statut utilisateur modifié par admin: ${user.email} - ${user.active ? 'activé' : 'désactivé'}`);

  res.json({
    message: user.active ? 'Utilisateur activé' : 'Utilisateur désactivé',
    data: user
  });
});
