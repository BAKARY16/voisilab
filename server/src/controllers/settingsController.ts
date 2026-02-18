import { Request, Response } from 'express';
import pool from '../config/database';
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

  query += ' ORDER BY category, `key`';

  const [rows] = await pool.query<RowDataPacket[]>(query, params);

  res.json({ data: rows });
});

/**
 * Get public settings (for front-end)
 */
export const getPublicSettings = asyncHandler(async (req: Request, res: Response) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT \`key\`, value FROM site_settings
     WHERE category IN ('general', 'social', 'footer', 'seo')
     ORDER BY \`key\``
  );

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

  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM site_settings WHERE `key` = ?',
    [key]
  );

  if (rows.length === 0) {
    throw new NotFoundError('Parametre non trouve');
  }

  res.json({ data: rows[0] });
});

/**
 * Create or update setting
 */
export const upsertSetting = asyncHandler(async (req: Request, res: Response) => {
  const { key, value, description, category = 'general' } = req.body;

  await pool.query<ResultSetHeader>(
    `INSERT INTO site_settings (\`key\`, value, description, category)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       value = VALUES(value),
       description = COALESCE(VALUES(description), description),
       category = COALESCE(VALUES(category), category)`,
    [key, value, description, category]
  );

  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM site_settings WHERE `key` = ?',
    [key]
  );

  logger.info(`Parametre mis a jour: ${key}`);

  res.json({
    message: 'Parametre enregistre avec succes',
    data: rows[0]
  });
});

/**
 * Update multiple settings at once
 */
export const updateMultipleSettings = asyncHandler(async (req: Request, res: Response) => {
  const { settings } = req.body;

  if (!Array.isArray(settings) || settings.length === 0) {
    throw new Error('Format de donnees invalide');
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    for (const setting of settings) {
      const { key, value, description, category } = setting;

      await connection.query(
        `INSERT INTO site_settings (\`key\`, value, description, category)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           value = VALUES(value),
           description = COALESCE(VALUES(description), description),
           category = COALESCE(VALUES(category), category)`,
        [key, value, description || null, category || 'general']
      );
    }

    await connection.commit();

    logger.info(`${settings.length} parametres mis a jour`);

    res.json({
      message: 'Parametres mis a jour avec succes'
    });
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
});

/**
 * Delete setting
 */
export const deleteSetting = asyncHandler(async (req: Request, res: Response) => {
  const { key } = req.params;

  const [result] = await pool.query<ResultSetHeader>(
    'DELETE FROM site_settings WHERE `key` = ?',
    [key]
  );

  if (result.affectedRows === 0) {
    throw new NotFoundError('Parametre non trouve');
  }

  logger.info(`Parametre supprime: ${key}`);

  res.json({ message: 'Parametre supprime avec succes' });
});

/**
 * Get settings by category
 */
export const getSettingsByCategory = asyncHandler(async (req: Request, res: Response) => {
  const { category } = req.params;

  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM site_settings WHERE category = ? ORDER BY `key`',
    [category]
  );

  res.json({ data: rows });
});

/**
 * Get all categories
 */
export const getCategories = asyncHandler(async (req: Request, res: Response) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT DISTINCT category FROM site_settings ORDER BY category'
  );

  const categories = rows.map(row => row.category);

  res.json({ data: categories });
});
