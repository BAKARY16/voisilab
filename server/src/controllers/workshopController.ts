import { Request, Response } from 'express';
import { pool } from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { asyncHandler, NotFoundError } from '../middlewares/errors';
import logger from '../config/logger';

/**
 * Convertir une date ISO 8601 en format MySQL DATETIME
 * Ex: '2026-03-25T10:30:00.000Z' -> '2026-03-25 10:30:00'
 */
const formatDateForMySQL = (isoDate: string | null | undefined): string | null => {
  if (!isoDate) return null;
  try {
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return null;
    // Format: YYYY-MM-DD HH:mm:ss
    return date.toISOString().slice(0, 19).replace('T', ' ');
  } catch {
    return null;
  }
};

/**
 * Get all workshops (admin) with pagination and filters
 */
export const getAllWorkshops = asyncHandler(async (req: Request, res: Response) => {
  const { status, type, category, page = 1, limit = 20, search } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  let query = 'SELECT * FROM workshops WHERE 1=1';
  const params: any[] = [];

  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }

  if (type) {
    query += ' AND type = ?';
    params.push(type);
  }

  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }

  if (search) {
    query += ' AND (title LIKE ? OR description LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  query += ' ORDER BY date DESC LIMIT ? OFFSET ?';
  params.push(Number(limit), offset);

  const [rows] = await pool.query<RowDataPacket[]>(query, params);

  // Get total count
  let countQuery = 'SELECT COUNT(*) as total FROM workshops WHERE 1=1';
  const countParams: any[] = [];

  if (status) {
    countQuery += ' AND status = ?';
    countParams.push(status);
  }

  if (type) {
    countQuery += ' AND type = ?';
    countParams.push(type);
  }

  if (category) {
    countQuery += ' AND category = ?';
    countParams.push(category);
  }

  if (search) {
    countQuery += ' AND (title LIKE ? OR description LIKE ?)';
    countParams.push(`%${search}%`, `%${search}%`);
  }

  const [countResult] = await pool.query<RowDataPacket[]>(countQuery, countParams);
  const total = countResult[0].total;

  res.json({
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
 * Get published workshops (public)
 */
export const getPublishedWorkshops = asyncHandler(async (req: Request, res: Response) => {
  const { type, limit = 20 } = req.query;

  let query = `
    SELECT * FROM workshops 
    WHERE is_published = TRUE 
    AND status IN ('upcoming', 'ongoing')
  `;
  const params: any[] = [];

  if (type && type !== 'all') {
    query += ' AND type = ?';
    params.push(type);
  }

  query += ' ORDER BY date ASC LIMIT ?';
  params.push(Number(limit));

  const [rows] = await pool.query<RowDataPacket[]>(query, params);

  res.json({ data: rows });
});

/**
 * Get upcoming workshops (public) - alias for backward compatibility
 */
export const getUpcomingWorkshops = asyncHandler(async (req: Request, res: Response) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT * FROM workshops
     WHERE status = 'upcoming' AND date >= CURDATE()
     ORDER BY date ASC
     LIMIT 10`
  );

  res.json({ data: rows });
});

/**
 * Get workshop by ID (public)
 */
export const getPublicWorkshopById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM workshops WHERE id = ? AND is_published = TRUE',
    [id]
  );

  if (rows.length === 0) {
    throw new NotFoundError('Atelier non trouvé');
  }

  res.json({ data: rows[0] });
});

/**
 * Get workshop by ID (admin)
 */
export const getWorkshopById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM workshops WHERE id = ?',
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
    type = 'formation',
    date,
    time,
    duration,
    location,
    max_participants = 10,
    level = 'Débutant',
    image_url,
    category,
    price = 0,
    instructor,
    prerequisites = [],
    what_you_learn = [],
    status = 'upcoming',
    is_published = false
  } = req.body;

  // Convertir la date ISO en format MySQL
  const mysqlDate = formatDateForMySQL(date);

  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO workshops (
      title, description, type, date, time, duration, location, 
      max_participants, current_participants, level, image_url, 
      category, price, instructor, prerequisites, what_you_learn, 
      status, is_published, is_read
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?, ?, ?, ?, ?, FALSE)`,
    [
      title, description, type, mysqlDate, time, duration, location,
      max_participants, level, image_url, category, price, instructor,
      JSON.stringify(prerequisites), JSON.stringify(what_you_learn),
      status, is_published
    ]
  );

  // Create notification for new workshop
  try {
    await pool.query(
      `INSERT INTO notifications (type, title, message, link, is_read, data) 
       VALUES ('workshop', ?, ?, ?, FALSE, ?)`,
      [
        `Nouvel atelier: ${title}`,
        `Un nouvel atelier "${title}" a été créé`,
        `/voisilab/workshops/${result.insertId}`,
        JSON.stringify({ workshop_id: result.insertId, type })
      ]
    );
  } catch (e) {
    logger.warn('Could not create notification for workshop');
  }

  // Fetch the created workshop
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM workshops WHERE id = ?',
    [result.insertId]
  );

  logger.info(`Nouvel atelier créé: ${title} (ID: ${result.insertId})`);

  res.status(201).json({
    message: 'Atelier créé avec succès',
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
    type,
    date,
    time,
    duration,
    location,
    max_participants,
    level,
    image_url,
    category,
    price,
    instructor,
    prerequisites,
    what_you_learn,
    status,
    is_published
  } = req.body;

  // Check if workshop exists
  const [existing] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM workshops WHERE id = ?',
    [id]
  );

  if (existing.length === 0) {
    throw new NotFoundError('Atelier non trouvé');
  }

  // Build dynamic update query
  const updates: string[] = [];
  const params: any[] = [];

  if (title !== undefined) { updates.push('title = ?'); params.push(title); }
  if (description !== undefined) { updates.push('description = ?'); params.push(description); }
  if (type !== undefined) { updates.push('type = ?'); params.push(type); }
  if (date !== undefined) { updates.push('date = ?'); params.push(formatDateForMySQL(date)); }
  if (time !== undefined) { updates.push('time = ?'); params.push(time); }
  if (duration !== undefined) { updates.push('duration = ?'); params.push(duration); }
  if (location !== undefined) { updates.push('location = ?'); params.push(location); }
  if (max_participants !== undefined) { updates.push('max_participants = ?'); params.push(max_participants); }
  if (level !== undefined) { updates.push('level = ?'); params.push(level); }
  if (image_url !== undefined) { updates.push('image_url = ?'); params.push(image_url); }
  if (category !== undefined) { updates.push('category = ?'); params.push(category); }
  if (price !== undefined) { updates.push('price = ?'); params.push(price); }
  if (instructor !== undefined) { updates.push('instructor = ?'); params.push(instructor); }
  if (prerequisites !== undefined) { updates.push('prerequisites = ?'); params.push(JSON.stringify(prerequisites)); }
  if (what_you_learn !== undefined) { updates.push('what_you_learn = ?'); params.push(JSON.stringify(what_you_learn)); }
  if (status !== undefined) { updates.push('status = ?'); params.push(status); }
  if (is_published !== undefined) { updates.push('is_published = ?'); params.push(is_published); }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'Aucune modification fournie' });
  }

  params.push(id);

  await pool.query(
    `UPDATE workshops SET ${updates.join(', ')}, updated_at = NOW() WHERE id = ?`,
    params
  );

  // Fetch updated workshop
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM workshops WHERE id = ?',
    [id]
  );

  logger.info(`Atelier mis à jour: ${rows[0].title} (ID: ${id})`);

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

  // Check if workshop exists
  const [existing] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM workshops WHERE id = ?',
    [id]
  );

  if (existing.length === 0) {
    throw new NotFoundError('Atelier non trouvé');
  }

  await pool.query('DELETE FROM workshops WHERE id = ?', [id]);

  logger.info(`Atelier supprimé: ${existing[0].title} (ID: ${id})`);

  res.json({ message: 'Atelier supprimé avec succès' });
});

/**
 * Get workshop registrations
 */
export const getWorkshopRegistrations = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT * FROM workshop_registrations 
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

  // Check if workshop exists and has capacity
  const [workshop] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM workshops WHERE id = ?',
    [id]
  );

  if (workshop.length === 0) {
    throw new NotFoundError('Atelier non trouvé');
  }

  const workshopData = workshop[0];
  
  if (workshopData.current_participants >= workshopData.max_participants) {
    return res.status(400).json({ error: 'Cet atelier est complet' });
  }

  // Check if already registered
  const [existingReg] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM workshop_registrations WHERE workshop_id = ? AND email = ?',
    [id, email]
  );

  if (existingReg.length > 0) {
    return res.status(400).json({ error: 'Vous êtes déjà inscrit à cet atelier' });
  }

  // Create registration
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO workshop_registrations (workshop_id, name, email, phone, message, status)
     VALUES (?, ?, ?, ?, ?, 'pending')`,
    [id, name, email, phone, message]
  );

  // Update current participants count
  await pool.query(
    'UPDATE workshops SET current_participants = current_participants + 1 WHERE id = ?',
    [id]
  );

  // Create notification
  try {
    await pool.query(
      `INSERT INTO notifications (type, title, message, link, is_read, data)
       VALUES ('workshop_registration', ?, ?, ?, FALSE, ?)`,
      [
        `Nouvelle inscription: ${workshopData.title}`,
        `${name} s'est inscrit à l'atelier "${workshopData.title}"`,
        `/voisilab/workshops/${id}/registrations`,
        JSON.stringify({ workshop_id: id, registration_id: result.insertId, name, email })
      ]
    );
  } catch (e) {
    logger.warn('Could not create notification for registration');
  }

  logger.info(`Nouvelle inscription à l'atelier ${workshopData.title}: ${name} (${email})`);

  res.status(201).json({
    message: 'Inscription enregistrée avec succès',
    data: { id: result.insertId }
  });
});

/**
 * Get unread workshops count (for admin notifications)
 */
export const getUnreadCount = asyncHandler(async (req: Request, res: Response) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT COUNT(*) as count FROM workshops WHERE is_read = FALSE'
  );

  res.json({ count: rows[0].count });
});

/**
 * Mark workshop as read
 */
export const markAsRead = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  await pool.query('UPDATE workshops SET is_read = TRUE WHERE id = ?', [id]);

  res.json({ message: 'Marqué comme lu' });
});

/**
 * Mark all workshops as read
 */
export const markAllAsRead = asyncHandler(async (req: Request, res: Response) => {
  await pool.query('UPDATE workshops SET is_read = TRUE WHERE is_read = FALSE');

  res.json({ message: 'Tous les ateliers marqués comme lus' });
});
