import { Request, Response } from 'express';
import pool from '../config/database';
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
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Get all pages with pagination and filters
 */
export const getAllPages = asyncHandler(async (req: Request, res: Response) => {
  const { status, template, page = 1, limit = 10, search } = req.query;
  const pageNum = parseInt(page as string) || 1;
  const limitNum = parseInt(limit as string) || 10;
  const offset = (pageNum - 1) * limitNum;

  let query = 'SELECT * FROM dynamic_pages WHERE 1=1';
  const params: any[] = [];

  if (status) {
    query += ` AND status = ?`;
    params.push(status);
  }

  if (template) {
    query += ` AND template = ?`;
    params.push(template);
  }

  if (search) {
    query += ` AND (title LIKE ? OR slug LIKE ?)`;
    params.push(`%${search}%`, `%${search}%`);
  }

  query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
  params.push(limitNum, offset);

  const [rows] = await pool.query<RowDataPacket[]>(query, params);

  // Get total count
  let countQuery = 'SELECT COUNT(*) as count FROM dynamic_pages WHERE 1=1';
  const countParams: any[] = [];

  if (status) {
    countQuery += ` AND status = ?`;
    countParams.push(status);
  }

  if (template) {
    countQuery += ` AND template = ?`;
    countParams.push(template);
  }

  if (search) {
    countQuery += ` AND (title LIKE ? OR slug LIKE ?)`;
    countParams.push(`%${search}%`, `%${search}%`);
  }

  const [countRows] = await pool.query<RowDataPacket[]>(countQuery, countParams);
  const total = (countRows[0] as any).count;

  res.json({
    data: rows,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    }
  });
});

/**
 * Get published pages (public)
 */
export const getPublishedPages = asyncHandler(async (req: Request, res: Response) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT id, slug, title, template FROM dynamic_pages WHERE status = ? ORDER BY title ASC',
    ['published']
  );

  res.json({ data: rows });
});

/**
 * Get page by slug (public)
 */
export const getPageBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;

  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM dynamic_pages WHERE slug = ? AND status = ?',
    [slug, 'published']
  );

  if (rows.length === 0) {
    throw new NotFoundError('Page non trouvee');
  }

  res.json({ data: rows[0] });
});

/**
 * Get page by ID (admin)
 */
export const getPageById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM dynamic_pages WHERE id = ?',
    [id]
  );

  if (rows.length === 0) {
    throw new NotFoundError('Page non trouvee');
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
  const [existing] = await pool.query<RowDataPacket[]>(
    'SELECT id FROM dynamic_pages WHERE slug = ?',
    [slug]
  );
  
  if (existing.length > 0) {
    throw new Error('Une page avec ce titre existe deja');
  }

  const publishedAt = status === 'published' ? new Date() : null;

  const [insertResult] = await pool.query<ResultSetHeader>(
    `INSERT INTO dynamic_pages (
      slug, title, content, template, status,
      meta_title, meta_description, meta_keywords, published_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [slug, title, content, template, status, meta_title, meta_description, 
     meta_keywords ? JSON.stringify(meta_keywords) : null, publishedAt]
  );

  const [newRows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM dynamic_pages WHERE id = ?',
    [insertResult.insertId]
  );

  logger.info(`Nouvelle page creee: ${title}`);

  res.status(201).json({
    message: 'Page creee avec succes',
    data: newRows[0]
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
  const [current] = await pool.query<RowDataPacket[]>(
    'SELECT status, slug FROM dynamic_pages WHERE id = ?',
    [id]
  );
  
  if (current.length === 0) {
    throw new NotFoundError('Page non trouvee');
  }

  let slug = current[0].slug;
  if (title) {
    const newSlug = generateSlug(title);
    if (newSlug !== slug) {
      const [existing] = await pool.query<RowDataPacket[]>(
        'SELECT id FROM dynamic_pages WHERE slug = ? AND id != ?',
        [newSlug, id]
      );
      if (existing.length > 0) {
        throw new Error('Une page avec ce titre existe deja');
      }
      slug = newSlug;
    }
  }

  // Set published_at if status changes from draft to published
  const publishedAt = (status === 'published' && current[0].status !== 'published') 
    ? new Date() 
    : undefined;

  const updates: string[] = ['slug = ?'];
  const params: any[] = [slug];

  if (title !== undefined) { updates.push('title = ?'); params.push(title); }
  if (content !== undefined) { updates.push('content = ?'); params.push(content); }
  if (template !== undefined) { updates.push('template = ?'); params.push(template); }
  if (status !== undefined) { updates.push('status = ?'); params.push(status); }
  if (meta_title !== undefined) { updates.push('meta_title = ?'); params.push(meta_title); }
  if (meta_description !== undefined) { updates.push('meta_description = ?'); params.push(meta_description); }
  if (meta_keywords !== undefined) { 
    updates.push('meta_keywords = ?'); 
    params.push(JSON.stringify(meta_keywords)); 
  }
  if (publishedAt) { updates.push('published_at = ?'); params.push(publishedAt); }

  params.push(id);

  await pool.query<ResultSetHeader>(
    `UPDATE dynamic_pages SET ${updates.join(', ')} WHERE id = ?`,
    params
  );

  const [updatedRows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM dynamic_pages WHERE id = ?',
    [id]
  );

  logger.info(`Page mise a jour: ${id}`);

  res.json({
    message: 'Page mise a jour avec succes',
    data: updatedRows[0]
  });
});

/**
 * Delete page
 */
export const deletePage = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const [result] = await pool.query<ResultSetHeader>(
    'DELETE FROM dynamic_pages WHERE id = ?',
    [id]
  );

  if (result.affectedRows === 0) {
    throw new NotFoundError('Page non trouvee');
  }

  logger.info(`Page supprimee: ${id}`);

  res.json({ message: 'Page supprimee avec succes' });
});
