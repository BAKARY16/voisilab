import { Request, Response } from 'express';
import { pool } from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { asyncHandler, NotFoundError } from '../middlewares/errors';
import logger from '../config/logger';

/**
 * Get all equipment with pagination and filters
 */
export const getAllEquipment = asyncHandler(async (req: Request, res: Response) => {
  const { status, category, page = 1, limit = 10, search } = req.query;
  const offset = ((page as number) - 1) * (limit as number);

  let query = 'SELECT * FROM equipment WHERE 1=1';
  const params: any[] = [];
  let paramIndex = 1;

  if (status) {
    query += ` AND status = $${paramIndex}`;
    params.push(status);
    paramIndex++;
  }

  if (category) {
    query += ` AND category = $${paramIndex}`;
    params.push(category);
    paramIndex++;
  }

  if (search) {
    query += ` AND (name ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
    params.push(`%${search}%`);
    paramIndex++;
  }

  query += ` ORDER BY name ASC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  params.push(limit, offset);

  let result = await pool.query(query, params);

  // Get total count
  let countQuery = 'SELECT COUNT(*) as count FROM equipment WHERE 1=1';
  const countParams: any[] = [];
  let countParamIndex = 1;

  if (status) {
    countQuery += ` AND status = $${countParamIndex}`;
    countParams.push(status);
    countParamIndex++;
  }

  if (category) {
    countQuery += ` AND category = $${countParamIndex}`;
    countParams.push(category);
    countParamIndex++;
  }

  if (search) {
    countQuery += ` AND (name ILIKE $${countParamIndex} OR description ILIKE $${countParamIndex})`;
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
 * Get available equipment (public)
 */
export const getAvailableEquipment = asyncHandler(async (req: Request, res: Response) => {
  const { category } = req.query;

  let query = 'SELECT * FROM equipment WHERE status = ?';
  const params: any[] = ['available'];

  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }

  query += ' ORDER BY name ASC';

  let result = await pool.query(query, params);

  res.json({ data: rows });
});

/**
 * Get equipment by ID
 */
export const getEquipmentById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM equipment WHERE id = ?',
    [id]
  );

  if (rows.length === 0) {
    throw new NotFoundError('Équipement non trouvé');
  }

  res.json({ data: rows[0] });
});

/**
 * Create equipment
 */
export const createEquipment = asyncHandler(async (req: Request, res: Response) => {
  const {
    name,
    description,
    category,
    image_url,
    status = 'available',
    specifications,
    location
  } = req.body;

  const [insertResult] = await pool.query<ResultSetHeader>(`
    INSERT INTO equipment (
      name, description, category, image_url, status,
      specifications, location
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, description, category, image_url, status, JSON.stringify(specifications || {}), location]
  );

  // Récupérer l'équipement créé
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM equipment WHERE name = ? ORDER BY created_at DESC LIMIT 1',
    [name]
  );

  logger.info(`Nouvel équipement créé: ${name}`);

  res.status(201).json({
    message: 'Équipement créé avec succès',
    data: rows[0]
  });
});

/**
 * Update equipment
 */
export const updateEquipment = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    name,
    description,
    category,
    image_url,
    status,
    specifications,
    location
  } = req.body;

  const [updateResult] = await pool.query<ResultSetHeader>( `UPDATE equipment SET
      name = COALESCE(?, name),
      description = COALESCE(?, description),
      category = COALESCE(?, category),
      image_url = COALESCE(?, image_url),
      status = COALESCE(?, status),
      specifications = COALESCE(?, specifications),
      location = COALESCE(?, location)
    WHERE id = ?
   `,
    [name, description, category, image_url, status, specifications, location, id]
  );

  if (rows.length === 0) {
    throw new NotFoundError(`Équipement non trouvé');
  }

  logger.info(`Équipement mis à jour: ${id}`);

  res.json({
    message: 'Équipement mis à jour avec succès',
    data: rows[0]
  });
});

/**
 * Delete equipment
 */
export const deleteEquipment = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const [result] = await pool.query<ResultSetHeader>('DELETE FROM equipment WHERE id = ?',
    [id]
  );

  if (rows.length === 0) {
    throw new NotFoundError('Équipement non trouvé');
  }

  logger.info(`Équipement supprimé: ${id}`);

  res.json({ message: 'Équipement supprimé avec succès' });
});

/**
 * Get equipment categories
 */
export const getEquipmentCategories = asyncHandler(async (req: Request, res: Response) => {
  const [rows] = await pool.query<RowDataPacket[]>('SELECT DISTINCT category FROM equipment WHERE category IS NOT NULL ORDER BY category ASC'
  );

  const categories = rows.map(row => row.category);

  res.json({ data: categories });
});
