import { Request, Response } from 'express';
import { pool } from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { asyncHandler, NotFoundError } from '../middlewares/errors';
import logger from '../config/logger';

/**
 * Get all workshops with pagination and filters
 */
export const getAllWorkshops = asyncHandler(async (req: Request, res: Response) => {
  const { status, category, page = 1, limit = 10, search } = req.query;
  const offset = ((page as number) - 1) * (limit as number);

  let query = 'SELECT * FROM workshops WHERE 1=1';
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
    query += ` AND (title ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
    params.push(`%${search}%`);
    paramIndex++;
  }

  query += ` ORDER BY date DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  params.push(limit, offset);

  let result = await pool.query(query, params);

  // Get total count
  let countQuery = 'SELECT COUNT(*) as count FROM workshops WHERE 1=1';
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
    countQuery += ` AND (title ILIKE $${countParamIndex} OR description ILIKE $${countParamIndex})`;
    countParams.push(`%${search}%`);
  }

  const [countRows] = await pool.query<RowDataPacket[]>( pool.query(countQuery, countParams);
  const total = parseInt(countResult[0][0].count);

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
 * Get upcoming workshops (public)
 */
export const getUpcomingWorkshops = asyncHandler(async (req: Request, res: Response) => {
  const [rows] = await pool.query<RowDataPacket[]>( `SELECT * FROM workshops
     WHERE status = `upcoming' AND date >= NOW()
     ORDER BY date ASC
     LIMIT 10`
  );

  res.json({ data: rows });
});

/**
 * Get workshop by ID
 */
export const getWorkshopById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM workshops WHERE id = ?',
    [id]
  );

  if (rows.length === 0) {
    throw new NotFoundError('Atelier non trouvé');
  }

  res.json({ data: rows[0] });
});

/**
 * Create workshop
 */
export const createWorkshop = asyncHandler(async (req: Request, res: Response) => {
  const {
    title,
    description,
    date,
    location,
    capacity,
    image_url,
    category,
    price,
    instructor,
    status = 'upcoming'
  } = req.body;

  const [insertResult] = await pool.query<ResultSetHeader>( `INSERT INTO workshops (
      title, description, date, location, capacity,
      image_url, category, price, instructor, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
   `,
    [title, description, date, location, capacity, image_url, category, price, instructor, status]
  );

  logger.info(`Nouvel atelier créé: ${title}`);

  res.status(201).json({
    message: `Atelier créé avec succès',
    data: rows[0]
  });
});

/**
 * Update workshop
 */
export const updateWorkshop = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    title,
    description,
    date,
    location,
    capacity,
    image_url,
    category,
    price,
    instructor,
    status
  } = req.body;

  const [updateResult] = await pool.query<ResultSetHeader>( `UPDATE workshops SET
      title = COALESCE(?, title),
      description = COALESCE(?, description),
      date = COALESCE(?, date),
      location = COALESCE(?, location),
      capacity = COALESCE(?, capacity),
      image_url = COALESCE(?, image_url),
      category = COALESCE(?, category),
      price = COALESCE(?, price),
      instructor = COALESCE(?, instructor),
      status = COALESCE(?, status)
    WHERE id = ?
   `,
    [title, description, date, location, capacity, image_url, category, price, instructor, status, id]
  );

  if (rows.length === 0) {
    throw new NotFoundError(`Atelier non trouvé');
  }

  logger.info(`Atelier mis à jour: ${id}`);

  res.json({
    message: 'Atelier mis à jour avec succès',
    data: rows[0]
  });
});

/**
 * Delete workshop
 */
export const deleteWorkshop = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const [result] = await pool.query<ResultSetHeader>('DELETE FROM workshops WHERE id = ?',
    [id]
  );

  if (rows.length === 0) {
    throw new NotFoundError('Atelier non trouvé');
  }

  logger.info(`Atelier supprimé: ${id}`);

  res.json({ message: 'Atelier supprimé avec succès' });
});

/**
 * Get workshop registrations
 */
export const getWorkshopRegistrations = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const [rows] = await pool.query<RowDataPacket[]>( `SELECT * FROM workshop_registrations
     WHERE workshop_id = ?
     ORDER BY created_at DESC`,
    [id]
  );

  res.json({ data: rows });
});

/**
 * Register for workshop (public)
 */
export const registerForWorkshop = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, phone, message } = req.body;
  const userId = req.user?.userId || null;

  // Check if workshop exists and has capacity
  const workshop = await pool.query(
    `SELECT capacity FROM workshops WHERE id = ?',
    [id]
  );

  if (workshop[0].length === 0) {
    throw new NotFoundError('Atelier non trouvé');
  }

  // Check available spots
  const registrations = await pool.query(
    'SELECT COUNT(*) as count FROM workshop_registrations WHERE workshop_id = ? AND status = ?',
    [id, 'confirmed']
  );

  const registeredCount = parseInt(registrations[0][0].count);
  const capacity = workshop[0][0].capacity;

  if (capacity && registeredCount >= capacity) {
    throw new Error('Atelier complet');
  }

  const [insertResult] = await pool.query<ResultSetHeader>( `INSERT INTO workshop_registrations (
      workshop_id, user_id, name, email, phone, message
    ) VALUES (?, ?, ?, ?, ?, ?)
   `,
    [id, userId, name, email, phone, message]
  );

  logger.info(`Nouvelle inscription à l`atelier ${id}: ${email}`);

  res.status(201).json({
    message: 'Inscription enregistrée avec succès',
    data: rows[0]
  });
});
