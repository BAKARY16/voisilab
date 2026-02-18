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
      title, name, description, icon, features, price_info,
      image_url, image, order_index, active
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      title,
      title, // name = title
      description,
      icon,
      JSON.stringify(features || []),
      price_info || null,
      image_url || null,
      image_url || null, // image = image_url
      parseInt(String(order_index)) || 0,
      active ? 1 : 0
    ]
  );

  // Récupérer le service créé
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM services WHERE id = ?',
    [(result as ResultSetHeader).insertId]
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

  const updates: string[] = [];
  const values: any[] = [];

  const body = req.body;

  // Mapper les champs frontend vers les colonnes BDD
  if (body.title !== undefined) {
    updates.push('title = ?', 'name = ?');
    values.push(body.title, body.title);
  }
  if (body.description !== undefined) { updates.push('description = ?'); values.push(body.description || null); }
  if (body.icon !== undefined) { updates.push('icon = ?'); values.push(body.icon || null); }
  if (body.features !== undefined) { updates.push('features = ?'); values.push(JSON.stringify(body.features || [])); }
  if (body.price_info !== undefined) { updates.push('price_info = ?'); values.push(body.price_info || null); }
  if (body.image_url !== undefined) {
    updates.push('image_url = ?', 'image = ?');
    values.push(body.image_url || null, body.image_url || null);
  }
  if (body.order_index !== undefined) { updates.push('order_index = ?'); values.push(parseInt(String(body.order_index)) || 0); }
  if (body.active !== undefined) { updates.push('active = ?'); values.push(body.active ? 1 : 0); }

  if (updates.length === 0) {
    return res.status(400).json({ success: false, message: 'Aucune donnée à mettre à jour' });
  }

  values.push(id);
  const [result] = await pool.query<ResultSetHeader>(
    `UPDATE services SET ${updates.join(', ')} WHERE id = ?`,
    values
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
