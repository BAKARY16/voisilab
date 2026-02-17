import { Request, Response } from 'express';
import pool from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { hashPassword } from '../config/auth';
import { asyncHandler, NotFoundError, ValidationError } from '../middlewares/errors';
import logger from '../config/logger';

/**
 * Get all users with pagination and filters (admin only)
 */
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const { role, active, page = 1, limit = 10, search } = req.query;
  const offset = ((Number(page)) - 1) * (Number(limit));

  let query = 'SELECT id, email, full_name, role, avatar_url, active, email_verified, last_login, created_at FROM users WHERE 1=1';
  const params: any[] = [];

  if (role) {
    query += ' AND role = ?';
    params.push(role);
  }

  if (active !== undefined) {
    query += ' AND active = ?';
    params.push(active === 'true');
  }

  if (search) {
    query += ' AND (email LIKE ? OR full_name LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(Number(limit), offset);

  const [rows] = await pool.query<RowDataPacket[]>(query, params);

  // Get total count
  let countQuery = 'SELECT COUNT(*) as count FROM users WHERE 1=1';
  const countParams: any[] = [];

  if (role) {
    countQuery += ' AND role = ?';
    countParams.push(role);
  }

  if (active !== undefined) {
    countQuery += ' AND active = ?';
    countParams.push(active === 'true');
  }

  if (search) {
    countQuery += ' AND (email LIKE ? OR full_name LIKE ?)';
    countParams.push(`%${search}%`, `%${search}%`);
  }

  const [countRows] = await pool.query<RowDataPacket[]>(countQuery, countParams);
  const total = (countRows[0] as any).count;

  res.json({
    success: true,
    data: rows,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit))
    }
  });
});

/**
 * Get user by ID (admin only)
 */
export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT id, email, full_name, role, avatar_url, active, email_verified, last_login, created_at FROM users WHERE id = ?',
    [id]
  );

  if (rows.length === 0) {
    throw new NotFoundError('Utilisateur non trouve');
  }

  res.json({ success: true, data: rows[0] });
});

/**
 * Create user (admin only)
 */
export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, full_name, role = 'user', active = true } = req.body;

  // Check if user exists
  const [existingRows] = await pool.query<RowDataPacket[]>(
    'SELECT id FROM users WHERE email = ?',
    [email]
  );

  if (existingRows.length > 0) {
    throw new ValidationError('Un utilisateur avec cet email existe deja');
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Create user
  const [insertResult] = await pool.query<ResultSetHeader>(
    'INSERT INTO users (email, password_hash, full_name, role, active) VALUES (?, ?, ?, ?, ?)',
    [email, passwordHash, full_name || '', role, active]
  );

  // Get created user
  const [newRows] = await pool.query<RowDataPacket[]>(
    'SELECT id, email, full_name, role, active, created_at FROM users WHERE id = ?',
    [insertResult.insertId]
  );

  logger.info(`Nouvel utilisateur cree par admin: ${email}`);

  res.status(201).json({
    success: true,
    message: 'Utilisateur cree avec succes',
    data: newRows[0]
  });
});

/**
 * Update user (admin only)
 */
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { email, full_name, role, active, email_verified, avatar_url } = req.body;

  // Check if user exists
  const [existingRows] = await pool.query<RowDataPacket[]>(
    'SELECT id FROM users WHERE id = ?',
    [id]
  );

  if (existingRows.length === 0) {
    throw new NotFoundError('Utilisateur non trouve');
  }

  // If email is being changed, check if it's already taken
  if (email) {
    const [emailRows] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM users WHERE email = ? AND id != ?',
      [email, id]
    );

    if (emailRows.length > 0) {
      throw new ValidationError('Un utilisateur avec cet email existe deja');
    }
  }

  await pool.query<ResultSetHeader>(
    `UPDATE users SET
      email = COALESCE(?, email),
      full_name = COALESCE(?, full_name),
      role = COALESCE(?, role),
      active = COALESCE(?, active),
      email_verified = COALESCE(?, email_verified),
      avatar_url = COALESCE(?, avatar_url)
    WHERE id = ?`,
    [email, full_name, role, active, email_verified, avatar_url, id]
  );

  // Get updated user
  const [updatedRows] = await pool.query<RowDataPacket[]>(
    'SELECT id, email, full_name, role, avatar_url, active, email_verified FROM users WHERE id = ?',
    [id]
  );

  logger.info(`Utilisateur mis a jour par admin: ${id}`);

  res.json({
    success: true,
    message: 'Utilisateur mis a jour avec succes',
    data: updatedRows[0]
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

  // Check if user exists
  const [existingRows] = await pool.query<RowDataPacket[]>(
    'SELECT id FROM users WHERE id = ?',
    [id]
  );

  if (existingRows.length === 0) {
    throw new NotFoundError('Utilisateur non trouve');
  }

  // Hash new password
  const passwordHash = await hashPassword(new_password);

  // Update password
  await pool.query<ResultSetHeader>(
    'UPDATE users SET password_hash = ? WHERE id = ?',
    [passwordHash, id]
  );

  logger.info(`Mot de passe reinitialise par admin pour l'utilisateur: ${id}`);

  res.json({ success: true, message: 'Mot de passe reinitialise avec succes' });
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

  // Get user email before deleting
  const [userRows] = await pool.query<RowDataPacket[]>(
    'SELECT email FROM users WHERE id = ?',
    [id]
  );

  if (userRows.length === 0) {
    throw new NotFoundError('Utilisateur non trouve');
  }

  const userEmail = userRows[0].email;

  await pool.query<ResultSetHeader>('DELETE FROM users WHERE id = ?', [id]);

  logger.info(`Utilisateur supprime par admin: ${userEmail}`);

  res.json({ success: true, message: 'Utilisateur supprime avec succes' });
});

/**
 * Get user statistics (admin only)
 */
export const getUserStats = asyncHandler(async (req: Request, res: Response) => {
  const [rows] = await pool.query<RowDataPacket[]>(`
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as admins,
      SUM(CASE WHEN role = 'user' THEN 1 ELSE 0 END) as users,
      SUM(CASE WHEN active = true THEN 1 ELSE 0 END) as active_users,
      SUM(CASE WHEN email_verified = true THEN 1 ELSE 0 END) as verified_users,
      SUM(CASE WHEN created_at >= NOW() - INTERVAL 30 DAY THEN 1 ELSE 0 END) as new_last_month
    FROM users
  `);

  res.json({ success: true, data: rows[0] });
});

/**
 * Toggle user active status (admin only)
 */
export const toggleUserStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Prevent deactivating yourself
  if (id === req.user?.userId) {
    throw new ValidationError('Vous ne pouvez pas desactiver votre propre compte');
  }

  // Check if user exists and get current status
  const [userRows] = await pool.query<RowDataPacket[]>(
    'SELECT id, email, active FROM users WHERE id = ?',
    [id]
  );

  if (userRows.length === 0) {
    throw new NotFoundError('Utilisateur non trouve');
  }

  const newStatus = !userRows[0].active;

  await pool.query<ResultSetHeader>(
    'UPDATE users SET active = ? WHERE id = ?',
    [newStatus, id]
  );

  // Get updated user
  const [updatedRows] = await pool.query<RowDataPacket[]>(
    'SELECT id, email, active FROM users WHERE id = ?',
    [id]
  );

  const user = updatedRows[0];
  logger.info(`Statut utilisateur modifie par admin: ${user.email} - ${user.active ? 'active' : 'desactive'}`);

  res.json({
    success: true,
    message: user.active ? 'Utilisateur active' : 'Utilisateur desactive',
    data: user
  });
});
