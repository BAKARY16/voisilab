import { Request, Response } from 'express';
import pool from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { generateToken, hashPassword, comparePassword } from '../config/auth';
import { asyncHandler, ValidationError, UnauthorizedError } from '../middlewares/errors';
import logger from '../config/logger';

/**
 * Register new user
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, full_name } = req.body;

  if (!email || !password) {
    throw new ValidationError('Email et mot de passe requis');
  }

  // Check if user exists
  const [existingUsers] = await pool.query<RowDataPacket[]>(
    'SELECT id FROM users WHERE email = ?',
    [email]
  );

  if (existingUsers.length > 0) {
    throw new ValidationError('Un utilisateur avec cet email existe déjà');
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Create user
  const [insertResult] = await pool.query<ResultSetHeader>(
    `INSERT INTO users (email, password_hash, full_name, role)
     VALUES (?, ?, ?, ?)`,
    [email, passwordHash, full_name || '', 'user']
  );

  // Get the inserted user
  const [users] = await pool.query<RowDataPacket[]>(
    'SELECT id, email, full_name, role, created_at FROM users WHERE email = ?',
    [email]
  );

  const user = users[0];

  // Generate token
  const token = generateToken({
    userId: user.id as string,
    email: user.email as string,
    role: user.role as 'user' | 'admin' | 'superadmin'
  });

  logger.info(`Nouvel utilisateur créé: ${user.email}`);

  res.status(201).json({
    message: 'Utilisateur créé avec succès',
    token,
    user: {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role
    }
  });
});

/**
 * Login user
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ValidationError('Email et mot de passe requis');
  }

  // Find user
  const [users] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );

  if (users.length === 0) {
    throw new UnauthorizedError('Email ou mot de passe incorrect');
  }

  const user = users[0];

  // Check password
  const isValidPassword = await comparePassword(password, user.password_hash as string);

  if (!isValidPassword) {
    throw new UnauthorizedError('Email ou mot de passe incorrect');
  }

  // Check if user is active
  if (!user.active) {
    throw new UnauthorizedError('Compte désactivé');
  }

  // Update last login
  await pool.query(
    'UPDATE users SET last_login = NOW() WHERE id = ?',
    [user.id]
  );

  // Generate token
  const token = generateToken({
    userId: user.id as string,
    email: user.email as string,
    role: user.role as 'user' | 'admin' | 'superadmin'
  });

  logger.info(`Connexion réussie: ${user.email}`);

  res.json({
    message: 'Connexion réussie',
    token,
    user: {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      avatar_url: user.avatar_url
    }
  });
});

/**
 * Get current user
 */
export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;

  const [users] = await pool.query<RowDataPacket[]>(
    'SELECT id, email, full_name, role, avatar_url, email_verified, created_at FROM users WHERE id = ?',
    [userId]
  );

  if (users.length === 0) {
    throw new UnauthorizedError('Utilisateur non trouvé');
  }

  const user = users[0];

  res.json({ user });
});

/**
 * Refresh token
 */
export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;

  const [users] = await pool.query<RowDataPacket[]>(
    'SELECT id, email, role FROM users WHERE id = ? AND active = true',
    [userId]
  );

  if (users.length === 0) {
    throw new UnauthorizedError('Utilisateur non trouvé ou inactif');
  }

  const user = users[0];

  // Generate new token
  const token = generateToken({
    userId: user.id as string,
    email: user.email as string,
    role: user.role as 'user' | 'admin' | 'superadmin'
  });

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role
    }
  });
});

/**
 * Get current user profile
 */
export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;

  const [users] = await pool.query<RowDataPacket[]>(
    'SELECT id, email, full_name, role, avatar_url, phone, bio, organization, created_at FROM users WHERE id = ?',
    [userId]
  );

  if (users.length === 0) {
    throw new UnauthorizedError('Utilisateur non trouvé');
  }

  res.json({ user: users[0] });
});

/**
 * Update user profile
 */
export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  const { full_name, avatar_url, phone, bio, organization } = req.body;

  await pool.query<ResultSetHeader>(
    `UPDATE users
     SET full_name = COALESCE(?, full_name),
         avatar_url = COALESCE(?, avatar_url),
         phone = COALESCE(?, phone),
         bio = COALESCE(?, bio),
         organization = COALESCE(?, organization)
     WHERE id = ?`,
    [full_name, avatar_url, phone, bio, organization, userId]
  );

  // Get updated user
  const [users] = await pool.query<RowDataPacket[]>(
    'SELECT id, email, full_name, role, avatar_url, phone, bio, organization FROM users WHERE id = ?',
    [userId]
  );

  res.json({
    message: 'Profil mis à jour',
    user: users[0]
  });
});

/**
 * Change password
 */
export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  const { current_password, new_password } = req.body;

  if (!current_password || !new_password) {
    throw new ValidationError('Mot de passe actuel et nouveau requis');
  }

  // Get current password hash
  const [users] = await pool.query<RowDataPacket[]>(
    'SELECT password_hash FROM users WHERE id = ?',
    [userId]
  );

  if (users.length === 0) {
    throw new UnauthorizedError('Utilisateur non trouvé');
  }

  // Verify current password
  const isValid = await comparePassword(current_password, users[0].password_hash as string);

  if (!isValid) {
    throw new UnauthorizedError('Mot de passe actuel incorrect');
  }

  // Hash new password
  const newPasswordHash = await hashPassword(new_password);

  // Update password
  await pool.query<ResultSetHeader>(
    'UPDATE users SET password_hash = ? WHERE id = ?',
    [newPasswordHash, userId]
  );

  logger.info(`Mot de passe changé pour l'utilisateur: ${userId}`);

  res.json({ message: 'Mot de passe changé avec succès' });
});
