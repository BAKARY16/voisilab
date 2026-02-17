import { Request, Response } from 'express';
import { pool } from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { asyncHandler, NotFoundError } from '../middlewares/errors';
import logger from '../config/logger';

/**
 * Get all settings
 */
export const getAllSettings = asyncHandler(async (req: Request, res: Response) => {
  const { category } = req.query;

  let query = 'SELECT * FROM site_settings';
  const params: any[] = [];

  if (category) {
    query += ' WHERE category = ?';
    params.push(category);
  }

  query += ' ORDER BY category, key';

  let result = await pool.query(query, params);

  res.json({ data: rows });
});

/**
 * Get public settings (for front-end)
 */
export const getPublicSettings = asyncHandler(async (req: Request, res: Response) => {
  // Only return non-sensitive settings
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT \`key\`, value FROM site_settings
     WHERE category IN ('general', 'social')
     ORDER BY \`key\``
  );

  // Convert to key-value object
  const settings: Record<string, any> = {};
  rows.forEach(row => {
    settings[row.key] = row.value;
  });

  res.json({ data: settings });
});

/**
 * Get setting by key
 */
export const getSettingByKey = asyncHandler(async (req: Request, res: Response) => {
  const { key } = req.params;

  const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM site_settings WHERE key = ?',
    [key]
  );

  if (rows.length === 0) {
    throw new NotFoundError('Paramètre non trouvé');
  }

  res.json({ data: rows[0] });
});

/**
 * Create or update setting
 */
export const upsertSetting = asyncHandler(async (req: Request, res: Response) => {
  const { key, value, description, category = 'general' } = req.body;

  const [insertResult] = await pool.query<ResultSetHeader>(
    `INSERT INTO site_settings (\`key\`, value, description, category)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       value = VALUES(value),
       description = COALESCE(VALUES(description), description),
       category = COALESCE(VALUES(category), category)`,
    [key, value, description, category]
  );

  logger.info(`Paramètre mis à jour: ${key}`);

  res.json({
    message: `Paramètre enregistré avec succès',
    data: rows[0]
  });
});

/**
 * Update multiple settings at once
 */
export const updateMultipleSettings = asyncHandler(async (req: Request, res: Response) => {
  const { settings } = req.body; // Array of {key, value, description?, category?}

  if (!Array.isArray(settings) || settings.length === 0) {
    throw new Error('Format de données invalide');
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const results = [];
    for (const setting of settings) {
      const { key, value, description, category } = setting;

      let result = await client.query(
        `INSERT INTO site_settings (key, value, description, category)
         VALUES (?, ?, ?, ?)
         ON CONFLICT (key)
         DO UPDATE SET
           value = EXCLUDED.value,
           description = COALESCE(EXCLUDED.description, site_settings.description),
           category = COALESCE(EXCLUDED.category, site_settings.category)
        `,
        [key, value, description || null, category || 'general']
      );

      results.push(rows[0]);
    }

    await client.query('COMMIT');

    logger.info(`${settings.length} paramètres mis à jour`);

    res.json({
      message: 'Paramètres mis à jour avec succès',
      data: results
    });
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
});

/**
 * Delete setting
 */
export const deleteSetting = asyncHandler(async (req: Request, res: Response) => {
  const { key } = req.params;

  const [result] = await pool.query<ResultSetHeader>('DELETE FROM site_settings WHERE key = ? RETURNING key',
    [key]
  );

  if (rows.length === 0) {
    throw new NotFoundError('Paramètre non trouvé');
  }

  logger.info(`Paramètre supprimé: ${key}`);

  res.json({ message: 'Paramètre supprimé avec succès' });
});

/**
 * Get settings by category
 */
export const getSettingsByCategory = asyncHandler(async (req: Request, res: Response) => {
  const { category } = req.params;

  const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM site_settings WHERE category = ? ORDER BY key',
    [category]
  );

  res.json({ data: rows });
});

/**
 * Get all categories
 */
export const getCategories = asyncHandler(async (req: Request, res: Response) => {
  const [rows] = await pool.query<RowDataPacket[]>('SELECT DISTINCT category FROM site_settings ORDER BY category'
  );

  const categories = rows.map(row => row.category);

  res.json({ data: categories });
});
