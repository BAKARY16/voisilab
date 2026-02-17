import { Request, Response } from 'express';
import { pool } from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { asyncHandler, NotFoundError } from '../middlewares/errors';
import logger from '../config/logger';

/**
 * Generate slug from title
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/-+/g, '-') // Replace multiple - with single -
    .trim();
}

/**
 * Get all pages with pagination and filters
 */
export const getAllPages = asyncHandler(async (req: Request, res: Response) => {
  const { status, template, page = 1, limit = 10, search } = req.query;
  const offset = ((page as number) - 1) * (limit as number);

  let query = 'SELECT * FROM dynamic_pages WHERE 1=1';
  const params: any[] = [];
  let paramIndex = 1;

  if (status) {
    query += ` AND status = $${paramIndex}`;
    params.push(status);
    paramIndex++;
  }

  if (template) {
    query += ` AND template = $${paramIndex}`;
    params.push(template);
    paramIndex++;
  }

  if (search) {
    query += ` AND (title ILIKE $${paramIndex} OR slug ILIKE $${paramIndex})`;
    params.push(`%${search}%`);
    paramIndex++;
  }

  query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  params.push(limit, offset);

  let result = await pool.query(query, params);

  // Get total count
  let countQuery = 'SELECT COUNT(*) as count FROM dynamic_pages WHERE 1=1';
  const countParams: any[] = [];
  let countParamIndex = 1;

  if (status) {
    countQuery += ` AND status = $${countParamIndex}`;
    countParams.push(status);
    countParamIndex++;
  }

  if (template) {
    countQuery += ` AND template = $${countParamIndex}`;
    countParams.push(template);
    countParamIndex++;
  }

  if (search) {
    countQuery += ` AND (title ILIKE $${countParamIndex} OR slug ILIKE $${countParamIndex})`;
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
 * Get published pages (public)
 */
export const getPublishedPages = asyncHandler(async (req: Request, res: Response) => {
  const [rows] = await pool.query<RowDataPacket[]>('SELECT id, slug, title, template FROM dynamic_pages WHERE status = ? ORDER BY title ASC',
    ['published']
  );

  res.json({ data: rows });
});

/**
 * Get page by slug (public)
 */
export const getPageBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;

  const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM dynamic_pages WHERE slug = ? AND status = ?',
    [slug, 'published']
  );

  if (rows.length === 0) {
    throw new NotFoundError('Page non trouvée');
  }

  res.json({ data: rows[0] });
});

/**
 * Get page by ID (admin)
 */
export const getPageById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM dynamic_pages WHERE id = ?',
    [id]
  );

  if (rows.length === 0) {
    throw new NotFoundError('Page non trouvée');
  }

  res.json({ data: rows[0] });
});

/**
 * Create page
 */
export const createPage = asyncHandler(async (req: Request, res: Response) => {
  const {
    title,
    content,
    template = 'default',
    status = 'draft',
    meta_title,
    meta_description,
    meta_keywords
  } = req.body;

  const slug = generateSlug(title);

  // Check if slug exists
  const existing = await pool.query('SELECT id FROM dynamic_pages WHERE slug = ?', [slug]);
  if (existing.rows.length > 0) {
    throw new Error('Une page avec ce titre existe déjà');
  }

  const publishedAt = status === 'published' ? 'NOW()' : null;

  const [insertResult] = await pool.query<ResultSetHeader>( `INSERT INTO dynamic_pages (
      slug, title, content, template, status,
      meta_title, meta_description, meta_keywords, published_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ${publishedAt})
   `,
    [slug, title, content, template, status, meta_title, meta_description, meta_keywords || []]
  );

  logger.info(`Nouvelle page créée: ${title}`);

  res.status(201).json({
    message: `Page créée avec succès',
    data: rows[0]
  });
});

/**
 * Update page
 */
export const updatePage = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    title,
    content,
    template,
    status,
    meta_title,
    meta_description,
    meta_keywords
  } = req.body;

  // Get current page
  const current = await pool.query('SELECT status, slug FROM dynamic_pages WHERE id = ?', [id]);
  if (current.rows.length === 0) {
    throw new NotFoundError('Page non trouvée');
  }

  let slug = current.rows[0].slug;
  if (title) {
    const newSlug = generateSlug(title);
    if (newSlug !== slug) {
      const existing = await pool.query('SELECT id FROM dynamic_pages WHERE slug = ? AND id != ?', [newSlug, id]);
      if (existing.rows.length > 0) {
        throw new Error('Une page avec ce titre existe déjà');
      }
      slug = newSlug;
    }
  }

  // Set published_at if status changes from draft to published
  let publishedAtQuery = '';
  if (status === 'published' && current.rows[0].status !== 'published') {
    publishedAtQuery = ', published_at = NOW()';
  }

  const [updateResult] = await pool.query<ResultSetHeader>( `UPDATE dynamic_pages SET
      slug = ?,
      title = COALESCE(?, title),
      content = COALESCE(?, content),
      template = COALESCE(?, template),
      status = COALESCE(?, status),
      meta_title = COALESCE(?, meta_title),
      meta_description = COALESCE(?, meta_description),
      meta_keywords = COALESCE(?, meta_keywords)
      ${publishedAtQuery}
    WHERE id = ?
   `,
    [slug, title, content, template, status, meta_title, meta_description, meta_keywords, id]
  );

  logger.info(`Page mise à jour: ${id}`);

  res.json({
    message: `Page mise à jour avec succès',
    data: rows[0]
  });
});

/**
 * Delete page
 */
export const deletePage = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const [result] = await pool.query<ResultSetHeader>('DELETE FROM dynamic_pages WHERE id = ?',
    [id]
  );

  if (rows.length === 0) {
    throw new NotFoundError('Page non trouvée');
  }

  logger.info(`Page supprimée: ${id}`);

  res.json({ message: 'Page supprimée avec succès' });
});
