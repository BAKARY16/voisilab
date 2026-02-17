import { Request, Response } from 'express';
import { pool } from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { asyncHandler, NotFoundError } from '../middlewares/errors';
import logger from '../config/logger';

// Helper function for creating notifications
async function createNotificationHelper(
  userId: string,
  type: string,
  title: string,
  message: string,
  link?: string
): Promise<void> {
  await pool.query(
    `INSERT INTO notifications (user_id, type, title, message, link)
     VALUES (?, ?, ?, ?, ?)`,
    [userId, type, title, message, link || null]
  );
}

interface Equipment extends RowDataPacket {
  id: number;
  name: string;
  category: string;
  description: string;
  image_url: string;
  count_info: string;
  specs: string;
  status: 'available' | 'maintenance' | 'unavailable';
  category_color: string;
  gradient: string;
  order_index: number;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}

/**
 * Get all equipment with pagination and filters
 */
export const getAllEquipment = asyncHandler(async (req: Request, res: Response) => {
  const { status, category, page = 1, limit = 50, search, active } = req.query;
  const offset = ((page as number) - 1) * (limit as number);

  let query = 'SELECT * FROM equipment WHERE 1=1';
  const params: any[] = [];

  if (status) {
    query += ` AND status = ?`;
    params.push(status);
  }

  if (category) {
    query += ` AND category = ?`;
    params.push(category);
  }

  if (active !== undefined) {
    query += ` AND active = ?`;
    params.push(active === 'true' ? 1 : 0);
  }

  if (search) {
    query += ` AND (name LIKE ? OR description LIKE ?)`;
    params.push(`%${search}%`, `%${search}%`);
  }

  query += ` ORDER BY order_index ASC, name ASC LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  const [rows] = await pool.query<Equipment[]>(query, params);

  // Parser les specs JSON (si c'est une string, sinon garder tel quel)
  const equipment = rows.map(item => ({
    ...item,
    specs: item.specs 
      ? (typeof item.specs === 'string' ? JSON.parse(item.specs) : item.specs)
      : []
  }));

  // Get total count
  let countQuery = 'SELECT COUNT(*) as count FROM equipment WHERE 1=1';
  const countParams: any[] = [];

  if (status) {
    countQuery += ` AND status = ?`;
    countParams.push(status);
  }

  if (category) {
    countQuery += ` AND category = ?`;
    countParams.push(category);
  }

  if (active !== undefined) {
    countQuery += ` AND active = ?`;
    countParams.push(active === 'true' ? 1 : 0);
  }

  if (search) {
    countQuery += ` AND (name LIKE ? OR description LIKE ?)`;
    countParams.push(`%${search}%`, `%${search}%`);
  }

  const [countRows] = await pool.query<RowDataPacket[]>(countQuery, countParams);
  const total = parseInt((countRows[0] as any).count);

  res.json({
    success: true,
    data: equipment,
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

  let query = 'SELECT * FROM equipment WHERE active = TRUE';
  const params: any[] = [];

  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }

  query += ' ORDER BY order_index ASC, name ASC';

  const [rows] = await pool.query<Equipment[]>(query, params);

  const equipment = rows.map(item => ({
    ...item,
    specs: item.specs 
      ? (typeof item.specs === 'string' ? JSON.parse(item.specs) : item.specs)
      : []
  }));

  res.json({ success: true, data: equipment });
});

/**
 * Get equipment by ID
 */
export const getEquipmentById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const [rows] = await pool.query<Equipment[]>(
    'SELECT * FROM equipment WHERE id = ?',
    [id]
  );

  if (rows.length === 0) {
    throw new NotFoundError('Équipement non trouvé');
  }

  const equipment = {
    ...rows[0],
    specs: rows[0].specs 
      ? (typeof rows[0].specs === 'string' ? JSON.parse(rows[0].specs) : rows[0].specs)
      : []
  };

  res.json({ success: true, data: equipment });
});

/**
 * Get equipment categories
 */


/**
 * Create equipment
 */
export const createEquipment = asyncHandler(async (req: Request, res: Response) => {
  const {
    name,
    category,
    description,
    image_url,
    count_info,
    specs,
    status = 'available',
    category_color,
    gradient,
    order_index = 0,
    active = true
  } = req.body;

  const specsJson = specs ? JSON.stringify(specs) : null;

  const [insertResult] = await pool.query<ResultSetHeader>(
    `INSERT INTO equipment 
     (name, category, description, image_url, count_info, specs, status, 
      category_color, gradient, order_index, active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, category, description, image_url, count_info, specsJson, status, 
     category_color, gradient, order_index, active]
  );

  // Créer une notification pour tous les admins
  const [admins] = await pool.query<RowDataPacket[]>(
    'SELECT id FROM users WHERE role = ?',
    ['admin']
  );

  for (const admin of admins) {
    await createNotificationHelper(
      admin.id.toString(),
      'equipment',
      'Nouvel équipement ajouté',
      `L'équipement "${name}" (${category}) a été ajouté au catalogue`,
      `/voisilab/equipment`
    );
  }

  logger.info(`Nouvel équipement créé: ${name}`);

  res.status(201).json({
    success: true,
    message: 'Équipement créé avec succès',
    data: { id: insertResult.insertId }
  });
});

/**
 * Update equipment
 */
export const updateEquipment = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = { ...req.body };

  // Convertir specs en JSON si présent
  if (updateData.specs) {
    updateData.specs = JSON.stringify(updateData.specs);
  }

  // Construire la requête UPDATE dynamiquement
  const fields = Object.keys(updateData);
  const values = Object.values(updateData);

  if (fields.length === 0) {
    return res.status(400).json({ success: false, message: 'Aucune donnée à mettre à jour' });
  }

  const setClause = fields.map(field => `${field} = ?`).join(', ');
  values.push(id);

  const [result] = await pool.query<ResultSetHeader>(
    `UPDATE equipment SET ${setClause} WHERE id = ?`,
    values
  );

  if (result.affectedRows === 0) {
    throw new NotFoundError('Équipement non trouvé');
  }

  // Notification si changement de statut
  if (updateData.status) {
    const [admins] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM users WHERE role = ?',
      ['admin']
    );

    const [equipment] = await pool.query<Equipment[]>(
      'SELECT name FROM equipment WHERE id = ?',
      [id]
    );

    const statusLabels: Record<string, string> = {
      available: 'disponible',
      maintenance: 'en maintenance',
      unavailable: 'indisponible'
    };

    for (const admin of admins) {
      await createNotificationHelper(
        admin.id.toString(),
        'equipment',
        'Statut équipement modifié',
        `${equipment[0].name} est maintenant ${statusLabels[updateData.status]}`,
        `/voisilab/equipment`
      );
    }
  }

  logger.info(`Équipement modifié: ${id}`);

  res.json({ success: true, message: 'Équipement mis à jour avec succès' });
});

/**
 * Delete equipment
 */
export const deleteEquipment = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Récupérer le nom avant suppression pour la notification
  const [equipment] = await pool.query<Equipment[]>(
    'SELECT name FROM equipment WHERE id = ?',
    [id]
  );

  if (equipment.length === 0) {
    throw new NotFoundError('Équipement non trouvé');
  }

  const [result] = await pool.query<ResultSetHeader>(
    'DELETE FROM equipment WHERE id = ?',
    [id]
  );

  if (result.affectedRows === 0) {
    throw new NotFoundError('Équipement non trouvé');
  }

  // Notification de suppression
  const [admins] = await pool.query<RowDataPacket[]>(
    'SELECT id FROM users WHERE role = ?',
    ['admin']
  );

  for (const admin of admins) {
    await createNotificationHelper(
      admin.id.toString(),
      'equipment',
      'Équipement supprimé',
      `L'équipement "${equipment[0].name}" a été supprimé du catalogue`,
      `/voisilab/equipment`
    );
  }

  logger.info(`Équipement supprimé: ${id}`);

  res.json({ success: true, message: 'Équipement supprimé avec succès' });
});

/**
 * Delete equipment
 */
export const deleteEquipment2 = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const [result] = await pool.query<ResultSetHeader>('DELETE FROM equipment WHERE id = ?',
    [id]
  );

  if (result.affectedRows === 0) {
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
