import { Request, Response } from 'express';
import { pool } from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { asyncHandler, NotFoundError } from '../middlewares/errors';
import logger from '../config/logger';

/**
 * Get all services with pagination and filters
 */
export const getAllServices = asyncHandler(async (req: Request, res: Response) => {
  const { active, page = 1, limit = 10 } = req.query;
  const offset = ((page as number) - 1) * (limit as number);

  let query = 'SELECT * FROM services WHERE 1=1';
  const params: any[] = [];

  if (active !== undefined) {
    query += ' AND active = ?';
    params.push(active === 'true');
  }

  query += ' ORDER BY order_index ASC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const [rows] = await pool.query<RowDataPacket[]>(query, params);

  // Get total count
  let countQuery = 'SELECT COUNT(*) as count FROM services WHERE 1=1';
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
 * Get active services (public)
 */
export const getActiveServices = asyncHandler(async (req: Request, res: Response) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM services WHERE active = true ORDER BY order_index ASC'
  );

  res.json({ data: rows });
});

/**
 * Get service by ID
 */
export const getServiceById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM services WHERE id = ?',
    [id]
  );

  if (rows.length === 0) {
    throw new NotFoundError('Service non trouvé');
  }

  res.json({ data: rows[0] });
});

/**
 * Create service
 */
export const createService = asyncHandler(async (req: Request, res: Response) => {
  const {
    title,
    description,
    icon,
    features,
    price_info,
    image_url,
    order_index = 0,
    active = true
  } = req.body;

  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO services (
      title, description, icon, features, price_info,
      image_url, order_index, active
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [title, description, icon, JSON.stringify(features || []), price_info, image_url, order_index, active]
  );

  // Récupérer le service créé
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM services WHERE title = ? ORDER BY created_at DESC LIMIT 1',
    [title]
  );

  logger.info(`Nouveau service créé: ${title}`);

  res.status(201).json({
    message: 'Service créé avec succès',
    data: rows[0]
  });
});

/**
 * Update service
 */
export const updateService = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    title,
    description,
    icon,
    features,
    price_info,
    image_url,
    order_index,
    active
  } = req.body;

  const [result] = await pool.query<ResultSetHeader>(
    `UPDATE services SET
      title = COALESCE(?, title),
      description = COALESCE(?, description),
      icon = COALESCE(?, icon),
      features = COALESCE(?, features),
      price_info = COALESCE(?, price_info),
      image_url = COALESCE(?, image_url),
      order_index = COALESCE(?, order_index),
      active = COALESCE(?, active)
    WHERE id = ?`,
    [title, description, icon, features ? JSON.stringify(features) : null, price_info, image_url, order_index, active, id]
  );

  if (result.affectedRows === 0) {
    throw new NotFoundError('Service non trouvé');
  }

  // Récupérer le service mis à jour
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM services WHERE id = ?',
    [id]
  );

  logger.info(`Service mis à jour: ${id}`);

  res.json({
    message: 'Service mis à jour avec succès',
    data: rows[0]
  });
});

/**
 * Delete service
 */
export const deleteService = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const [result] = await pool.query<ResultSetHeader>(
    'DELETE FROM services WHERE id = ?',
    [id]
  );

  if (result.affectedRows === 0) {
    throw new NotFoundError('Service non trouvé');
  }

  logger.info(`Service supprimé: ${id}`);

  res.json({ message: 'Service supprimé avec succès' });
});
