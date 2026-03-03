import { Request, Response } from 'express';
import { pool } from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { asyncHandler, NotFoundError } from '../middlewares/errors';
import logger from '../config/logger';
import { createForAllAdmins } from './notificationsController';

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
  const { status, category, page = 1, limit = 20, search } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  let query = 'SELECT * FROM workshops WHERE 1=1';
  const params: any[] = [];

  if (status) {
    query += ' AND status = ?';
    params.push(status);
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

  // Compter le total
  let countQuery = 'SELECT COUNT(*) as total FROM workshops WHERE 1=1';
  const countParams: any[] = [];

  if (status) {
    countQuery += ' AND status = ?';
    countParams.push(status);
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
  const { limit = 50, include_completed = 'true' } = req.query;

  const statusFilter = include_completed === 'false'
    ? `status IN ('upcoming', 'ongoing')`
    : `status IN ('upcoming', 'ongoing', 'completed')`;

  const query = `
    SELECT w.*,
      w.capacity AS max_participants,
      CAST(COALESCE((
        SELECT COUNT(*) FROM workshop_registrations wr
        WHERE wr.workshop_id = w.id AND wr.status != 'cancelled'
      ), 0) AS UNSIGNED) AS current_participants,
      CAST(COALESCE((
        SELECT COUNT(*) FROM workshop_registrations wr
        WHERE wr.workshop_id = w.id AND wr.status != 'cancelled'
      ), 0) AS UNSIGNED) AS registered
    FROM workshops w
    WHERE w.active = TRUE 
    AND ${statusFilter}
    ORDER BY 
      CASE w.status
        WHEN 'upcoming' THEN 0
        WHEN 'ongoing' THEN 1
        WHEN 'completed' THEN 2
      END ASC,
      w.date DESC
    LIMIT ?
  `;

  const [rows] = await pool.query<RowDataPacket[]>(query, [Number(limit)]);

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
    'SELECT * FROM workshops WHERE id = ? AND active = TRUE',
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

// Normalise le champ level vers les valeurs ENUM de la table
const normalizeLevel = (l: string | undefined): string => {
  const map: Record<string, string> = {
    'Débutant': 'debutant', 'débutant': 'debutant', 'debutant': 'debutant',
    'Intermédiaire': 'intermediaire', 'intermédiaire': 'intermediaire', 'intermediaire': 'intermediaire',
    'Avancé': 'avance', 'avancé': 'avance', 'avance': 'avance',
    'Tous niveaux': 'debutant', 'tous_niveaux': 'debutant'
  };
  return map[l ?? ''] ?? l ?? 'debutant';
};

// Génère un slug unique à partir du titre
const generateSlug = (title: string): string => {
  return title.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '').trim()
    .replace(/\s+/g, '-').replace(/-+/g, '-')
    + '-' + Date.now();
};

/**
 * Create workshop
 */
export const createWorkshop = asyncHandler(async (req: Request, res: Response) => {
  const {
    title,
    description = '',
    date,
    location   = '',
    capacity   = 20,
    level,
    image,
    category,
    type,
    price      = 0,
    instructor,
    status     = 'upcoming',
    active     = false,
    content    = null,
    cta_label  = null,
    cta_url    = null,
    // Aliases tolérés depuis l'ancien frontend
    is_published,
    max_participants,
    image_url
  } = req.body;

  const slug        = generateSlug(title);
  const finalActive = active !== undefined ? active : (is_published ?? false);
  const finalCap    = capacity !== undefined ? capacity : (max_participants ?? 20);
  const finalImage  = image ?? image_url ?? null;
  const mysqlDate   = formatDateForMySQL(date) ||
    new Date().toISOString().slice(0, 19).replace('T', ' ');

  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO workshops
      (title, slug, description, content, date, location, capacity, price, image, instructor, level, category, type, status, active, cta_label, cta_url)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      title, slug, description, content ?? null, mysqlDate, location,
      Number(finalCap), Number(price), finalImage, instructor || null,
      normalizeLevel(level), category || null, type || null, status, finalActive ? 1 : 0,
      cta_label || null, cta_url || null
    ]
  );

  // Créer une notification pour tous les admins et superadmins
  try {
    await createForAllAdmins(
      'workshop',
      `Nouvel atelier: ${title}`,
      `Un nouvel atelier "${title}" a été créé`,
      `/workshops`
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
  const body = req.body;

  // Check if workshop exists
  const [existing] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM workshops WHERE id = ?',
    [id]
  );

  if (existing.length === 0) {
    throw new NotFoundError('Atelier non trouvé');
  }

  // Build dynamic update query — uniquement les colonnes existantes
  const updates: string[] = [];
  const params: any[]     = [];

  if (body.title       !== undefined) { updates.push('title = ?');       params.push(body.title); }
  if (body.description !== undefined) { updates.push('description = ?'); params.push(body.description); }
  if (body.date        !== undefined) { updates.push('date = ?');        params.push(formatDateForMySQL(body.date)); }
  if (body.location    !== undefined) { updates.push('location = ?');    params.push(body.location); }
  if (body.category    !== undefined) { updates.push('category = ?');    params.push(body.category); }
  if (body.type        !== undefined) { updates.push('type = ?');        params.push(body.type || null); }
  if (body.price       !== undefined) { updates.push('price = ?');       params.push(Number(body.price)); }
  if (body.instructor  !== undefined) { updates.push('instructor = ?');  params.push(body.instructor); }
  if (body.status      !== undefined) { updates.push('status = ?');      params.push(body.status); }
  if (body.image       !== undefined) { updates.push('image = ?');       params.push(body.image); }
  // Gestion double nom: capacity / max_participants
  const cap = body.capacity ?? body.max_participants;
  if (cap !== undefined) { updates.push('capacity = ?'); params.push(Number(cap)); }
  // Gestion double nom: active / is_published
  const pub = body.active ?? body.is_published;
  if (pub !== undefined) { updates.push('active = ?'); params.push(pub ? 1 : 0); }
  // level : normalisation vers ENUM DB
  if (body.level     !== undefined) { updates.push('level = ?');     params.push(normalizeLevel(body.level)); }
  // content : colonne LONGTEXT
  if (body.content   !== undefined) { updates.push('content = ?');   params.push(body.content); }
  // CTA bouton personnalisé
  if (body.cta_label !== undefined) { updates.push('cta_label = ?'); params.push(body.cta_label || null); }
  if (body.cta_url   !== undefined) { updates.push('cta_url = ?');   params.push(body.cta_url   || null); }

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
  
  if (workshopData.registered >= workshopData.capacity) {
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

  // Incrémenter le compteur d'inscrits
  await pool.query(
    'UPDATE workshops SET registered = registered + 1 WHERE id = ?',
    [id]
  );

  // Créer une notification pour tous les admins et superadmins
  try {
    await createForAllAdmins(
      'workshop',
      `Nouvelle inscription: ${workshopData.title}`,
      `${name} s'est inscrit à l'atelier "${workshopData.title}"`,
      `/workshops`
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
 * Get all registrations across all workshops (admin overview)
 */
export const getAllRegistrationsAdmin = asyncHandler(async (req: Request, res: Response) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT r.*, w.title AS workshop_title, w.date AS workshop_date, w.capacity, w.registered
     FROM workshop_registrations r
     JOIN workshops w ON w.id = r.workshop_id
     ORDER BY r.created_at DESC`
  );
  res.json({ data: rows });
});

/**
 * Update registration status (confirmed / cancelled / pending)
 */
export const updateRegistrationStatus = asyncHandler(async (req: Request, res: Response) => {
  const { regId } = req.params;
  const { status } = req.body;

  const allowed = ['pending', 'confirmed', 'cancelled'];
  if (!allowed.includes(status)) {
    return res.status(400).json({ error: 'Statut invalide' });
  }

  const [result] = await pool.query<ResultSetHeader>(
    'UPDATE workshop_registrations SET status = ? WHERE id = ?',
    [status, regId]
  );

  if (result.affectedRows === 0) {
    throw new NotFoundError('Inscription non trouvée');
  }

  res.json({ message: 'Statut mis à jour', status });
});

/**
 * Delete a registration
 */
export const deleteRegistration = asyncHandler(async (req: Request, res: Response) => {
  const { regId } = req.params;

  // Récupérer l'inscription pour décrémenter le compteur
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM workshop_registrations WHERE id = ?',
    [regId]
  );

  if (rows.length === 0) {
    throw new NotFoundError('Inscription non trouvée');
  }

  const reg = rows[0];

  await pool.query('DELETE FROM workshop_registrations WHERE id = ?', [regId]);

  // Décrémenter le compteur d'inscrits si > 0
  await pool.query(
    'UPDATE workshops SET registered = GREATEST(registered - 1, 0) WHERE id = ?',
    [reg.workshop_id]
  );

  res.json({ message: 'Inscription supprimée' });
});

/**
 * Get unread workshops count
 * Note: workshops table n'a pas de colonne is_read — retourne 0
 */
export const getUnreadCount = asyncHandler(async (req: Request, res: Response) => {
  res.json({ count: 0 });
});

/**
 * Mark workshop as read (no-op — table sans colonne is_read)
 */
export const markAsRead = asyncHandler(async (req: Request, res: Response) => {
  res.json({ message: 'Marqué comme lu' });
});

/**
 * Mark all workshops as read (no-op — table sans colonne is_read)
 */
export const markAllAsRead = asyncHandler(async (req: Request, res: Response) => {
  res.json({ message: 'Tous les ateliers marqués comme lus' });
});
