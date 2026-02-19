import { Request, Response } from 'express';
import { pool } from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { asyncHandler, NotFoundError } from '../middlewares/errors';
import logger from '../config/logger';
import { createNotification } from './notificationsController';

/**
 * Get all innovations with pagination and filters (Admin)
 */
export const getAllInnovations = asyncHandler(async (req: Request, res: Response) => {
  const { status, category, is_featured, page = '1', limit = '10', search } = req.query;
  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const offset = (pageNum - 1) * limitNum;

  let query = `SELECT * FROM innovations WHERE 1=1`;
  const params: any[] = [];

  if (status) {
    query += ` AND status = ?`;
    params.push(status);
  }

  if (category) {
    query += ` AND category = ?`;
    params.push(category);
  }

  if (is_featured !== undefined) {
    query += ` AND is_featured = ?`;
    params.push(is_featured === 'true' ? 1 : 0);
  }

  if (search) {
    query += ` AND (title LIKE ? OR description LIKE ? OR creator_name LIKE ?)`;
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
  params.push(limitNum, offset);

  const [rows] = await pool.query<RowDataPacket[]>(query, params);

  // Get total count
  let countQuery = 'SELECT COUNT(*) as count FROM innovations WHERE 1=1';
  const countParams: any[] = [];

  if (status) {
    countQuery += ` AND status = ?`;
    countParams.push(status);
  }

  if (category) {
    countQuery += ` AND category = ?`;
    countParams.push(category);
  }

  if (is_featured !== undefined) {
    countQuery += ` AND is_featured = ?`;
    countParams.push(is_featured === 'true' ? 1 : 0);
  }

  if (search) {
    countQuery += ` AND (title LIKE ? OR description LIKE ? OR creator_name LIKE ?)`;
    countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  const [countResult] = await pool.query<RowDataPacket[]>(countQuery, countParams);
  const total = countResult[0].count as number;

  res.json({
    data: rows,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    }
  });
});

/**
 * Get published innovations for public display
 */
export const getPublishedInnovations = asyncHandler(async (req: Request, res: Response) => {
  const { category, featured, limit = '50' } = req.query;
  const limitNum = parseInt(limit as string, 10);

  let query = `SELECT * FROM innovations WHERE is_published = 1`;
  const params: any[] = [];

  if (category) {
    query += ` AND category = ?`;
    params.push(category);
  }

  if (featured === 'true') {
    query += ` AND is_featured = 1`;
  }

  query += ` ORDER BY is_featured DESC, created_at DESC LIMIT ?`;
  params.push(limitNum);

  const [rows] = await pool.query<RowDataPacket[]>(query, params);
  res.json({ data: rows });
});

/**
 * Get innovation categories with counts
 */
export const getCategories = asyncHandler(async (req: Request, res: Response) => {
  const [rows] = await pool.query<RowDataPacket[]>(`
    SELECT category, COUNT(*) as count 
    FROM innovations 
    WHERE is_published = 1 AND category IS NOT NULL AND category != ''
    GROUP BY category 
    ORDER BY count DESC
  `);
  res.json({ data: rows });
});

/**
 * Get innovation by ID
 */
export const getInnovationById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM innovations WHERE id = ?',
    [id]
  );

  if (rows.length === 0) {
    throw new NotFoundError('Innovation non trouvée');
  }

  // Increment views
  await pool.query(
    'UPDATE innovations SET views = COALESCE(views, 0) + 1 WHERE id = ?',
    [id]
  );

  res.json(rows[0]);
});

/**
 * Create innovation (Admin)
 */
export const createInnovation = asyncHandler(async (req: Request, res: Response) => {
  const {
    title,
    description,
    category,
    creator_name,
    creator_email,
    image_url,
    tags,
    status = 'pending',
    is_published = false,
    is_featured = false
  } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: 'Le titre et la description sont requis' });
  }

  const tagsJson = Array.isArray(tags) ? JSON.stringify(tags) : tags;

  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO innovations (
      title, description, category, creator_name, creator_email, 
      image_url, tags, status, is_published, is_featured, likes, views
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0)`,
    [title, description, category, creator_name, creator_email, 
     image_url, tagsJson, status, is_published ? 1 : 0, is_featured ? 1 : 0]
  );

  logger.info(`Innovation créée: ${title} (ID: ${result.insertId})`);

  // Créer notification pour tous les admins et superadmins
  const [admins] = await pool.query<RowDataPacket[]>('SELECT id FROM users WHERE role IN (?, ?)', ['admin', 'superadmin']);
  for (const admin of admins) {
    await createNotification(
      admin.id,
      'innovation',
      'Nouvelle innovation créée',
      `L'innovation "${title}" a été ajoutée`,
      `/innovations`
    );
  }

  res.status(201).json({
    success: true,
    message: 'Innovation créée avec succès',
    data: { id: result.insertId, title }
  });
});

/**
 * Update innovation (Admin)
 */
export const updateInnovation = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    title,
    description,
    category,
    creator_name,
    creator_email,
    image_url,
    tags,
    status,
    is_published,
    is_featured
  } = req.body;

  // Check if exists
  const [existing] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM innovations WHERE id = ?',
    [id]
  );

  if (existing.length === 0) {
    throw new NotFoundError('Innovation non trouvée');
  }

  const tagsJson = Array.isArray(tags) ? JSON.stringify(tags) : (tags ?? existing[0].tags);

  // image_url peut être explicitement vidé (null ou '') - ne pas utiliser COALESCE
  const newImageUrl = image_url !== undefined ? (image_url || null) : existing[0].image_url;

  await pool.query(
    `UPDATE innovations SET 
      title = COALESCE(?, title),
      description = COALESCE(?, description),
      category = ?,
      creator_name = ?,
      creator_email = ?,
      image_url = ?,
      tags = ?,
      status = COALESCE(?, status),
      is_published = COALESCE(?, is_published),
      is_featured = COALESCE(?, is_featured),
      updated_at = NOW()
    WHERE id = ?`,
    [title, description,
     category !== undefined ? category : existing[0].category,
     creator_name !== undefined ? creator_name : existing[0].creator_name,
     creator_email !== undefined ? creator_email : existing[0].creator_email,
     newImageUrl,
     tagsJson,
     status,
     is_published !== undefined ? (is_published ? 1 : 0) : null,
     is_featured !== undefined ? (is_featured ? 1 : 0) : null,
     id]
  );

  logger.info(`Innovation mise à jour: ${id}`);

  const [updated] = await pool.query<RowDataPacket[]>('SELECT * FROM innovations WHERE id = ?', [id]);

  res.json({
    success: true,
    message: 'Innovation mise à jour avec succès',
    data: updated[0]
  });
});

/**
 * Delete innovation (Admin)
 */
export const deleteInnovation = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const [existing] = await pool.query<RowDataPacket[]>(
    'SELECT title FROM innovations WHERE id = ?',
    [id]
  );

  if (existing.length === 0) {
    throw new NotFoundError('Innovation non trouvée');
  }

  await pool.query('DELETE FROM innovations WHERE id = ?', [id]);

  logger.info(`Innovation supprimée: ${id} - ${existing[0].title}`);

  res.json({
    success: true,
    message: 'Innovation supprimée avec succès'
  });
});

/**
 * Like an innovation (Public)
 */
export const likeInnovation = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const [existing] = await pool.query<RowDataPacket[]>(
    'SELECT id, likes FROM innovations WHERE id = ?',
    [id]
  );

  if (existing.length === 0) {
    throw new NotFoundError('Innovation non trouvée');
  }

  await pool.query(
    'UPDATE innovations SET likes = COALESCE(likes, 0) + 1 WHERE id = ?',
    [id]
  );

  res.json({
    success: true,
    message: 'Like ajouté',
    likes: (existing[0].likes || 0) + 1
  });
});

/**
 * Toggle publish status (Admin)
 */
export const togglePublish = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const [existing] = await pool.query<RowDataPacket[]>(
    'SELECT is_published, title FROM innovations WHERE id = ?',
    [id]
  );

  if (existing.length === 0) {
    throw new NotFoundError('Innovation non trouvée');
  }

  const newStatus = existing[0].is_published ? 0 : 1;

  await pool.query(
    'UPDATE innovations SET is_published = ?, status = ? WHERE id = ?',
    [newStatus, newStatus ? 'approved' : 'pending', id]
  );

  logger.info(`Innovation ${id} - publication: ${newStatus ? 'publié' : 'dépublié'}`);

  res.json({
    success: true,
    message: newStatus ? 'Innovation publiée' : 'Innovation dépubliée',
    is_published: newStatus === 1
  });
});

/**
 * Toggle featured status (Admin)
 */
export const toggleFeatured = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const [existing] = await pool.query<RowDataPacket[]>(
    'SELECT is_featured, title FROM innovations WHERE id = ?',
    [id]
  );

  if (existing.length === 0) {
    throw new NotFoundError('Innovation non trouvée');
  }

  const newStatus = existing[0].is_featured ? 0 : 1;

  await pool.query(
    'UPDATE innovations SET is_featured = ? WHERE id = ?',
    [newStatus, id]
  );

  logger.info(`Innovation ${id} - featured: ${newStatus ? 'activé' : 'désactivé'}`);

  res.json({
    success: true,
    message: newStatus ? 'Innovation mise en avant' : 'Innovation retirée de la une',
    is_featured: newStatus === 1
  });
});
