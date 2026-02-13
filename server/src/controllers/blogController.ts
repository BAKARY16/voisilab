import { Request, Response } from 'express';
import { pool } from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { asyncHandler, NotFoundError } from '../middlewares/errors';
import logger from '../config/logger';
import { createNotification } from './notificationsController';

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
 * Get all blog posts with pagination and filters
 */
export const getAllBlogPosts = asyncHandler(async (req: Request, res: Response) => {
  const { status, category, author_id, page = '1', limit = '10', search } = req.query;
  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const offset = (pageNum - 1) * limitNum;

  let query = `
    SELECT bp.*, u.full_name as author_name
    FROM blog_posts bp
    LEFT JOIN users u ON bp.author_id = u.id
    WHERE 1=1
  `;
  const params: any[] = [];

  if (status) {
    query += ` AND bp.status = ?`;
    params.push(status);
  }

  if (category) {
    query += ` AND bp.category = ?`;
    params.push(category);
  }

  if (author_id) {
    query += ` AND bp.author_id = ?`;
    params.push(author_id);
  }

  if (search) {
    query += ` AND (bp.title LIKE ? OR bp.excerpt LIKE ? OR bp.content LIKE ?)`;
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  query += ` ORDER BY bp.published_at DESC, bp.created_at DESC LIMIT ? OFFSET ?`;
  params.push(limitNum, offset);

  const [rows] = await pool.query<RowDataPacket[]>(query, params);

  // Get total count
  let countQuery = 'SELECT COUNT(*) as count FROM blog_posts WHERE 1=1';
  const countParams: any[] = [];

  if (status) {
    countQuery += ` AND status = ?`;
    countParams.push(status);
  }

  if (category) {
    countQuery += ` AND category = ?`;
    countParams.push(category);
  }

  if (author_id) {
    countQuery += ` AND author_id = ?`;
    countParams.push(author_id);
  }

  if (search) {
    countQuery += ` AND (title LIKE ? OR excerpt LIKE ? OR content LIKE ?)`;
    countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  const [countResult] = await pool.query<RowDataPacket[]>(countQuery, countParams);
  const total = countResult[0].count as number;

  res.json({
    data: rows,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / (limit as number))
    }
  });
});

/**
 * Get published blog posts (public)
 */
export const getPublishedBlogPosts = asyncHandler(async (req: Request, res: Response) => {
  const { category, page = '1', limit = '10' } = req.query;
  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const offset = (pageNum - 1) * limitNum;

  let query = `
    SELECT bp.id, bp.title, bp.slug, bp.excerpt, bp.featured_image,
           bp.category, bp.tags, bp.published_at, u.full_name as author_name
    FROM blog_posts bp
    LEFT JOIN users u ON bp.author_id = u.id
    WHERE bp.status = ?
  `;
  const params: any[] = ['published'];

  if (category) {
    query += ' AND bp.category = ?';
    params.push(category);
  }

  query += ` ORDER BY bp.published_at DESC LIMIT ? OFFSET ?`;
  params.push(limitNum, offset);

  const [rows] = await pool.query<RowDataPacket[]>(query, params);

  res.json({ data: rows });
});

/**
 * Get blog post by slug (public)
 */
export const getBlogPostBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;

  const [rows] = await pool.query<RowDataPacket[]>(`
    SELECT bp.*, u.full_name as author_name, u.avatar_url as author_avatar
    FROM blog_posts bp
    LEFT JOIN users u ON bp.author_id = u.id
    WHERE bp.slug = ? AND bp.status = ?`,
    [slug, 'published']
  );

  if (rows.length === 0) {
    throw new NotFoundError('Article non trouvé');
  }

  res.json({ data: rows[0] });
});

/**
 * Get blog post by ID (admin)
 */
export const getBlogPostById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const [rows] = await pool.query<RowDataPacket[]>(`SELECT bp.*, u.full_name as author_name
     FROM blog_posts bp
     LEFT JOIN users u ON bp.author_id = u.id
     WHERE bp.id = ?`,
    [id]
  );

  if (rows.length === 0) {
    throw new NotFoundError('Article non trouvé');
  }

  res.json({ data: rows[0] });
});

/**
 * Create blog post
 */
export const createBlogPost = asyncHandler(async (req: Request, res: Response) => {
  const {
    title,
    excerpt,
    content,
    featured_image,
    category,
    tags,
    status = 'draft',
    meta_title,
    meta_description,
    meta_keywords,
    og_image
  } = req.body;

  const authorId = req.user?.userId;
  const slug = generateSlug(title);

  // Check if slug exists
  const [existing] = await pool.query('SELECT id FROM blog_posts WHERE slug = ?', [slug]);
  if (existing.length > 0) {
    throw new Error('Un article avec ce titre existe déjà');
  }

  const publishedAt = status === 'published' ? new Date() : null;

  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO blog_posts (
      title, slug, excerpt, content, featured_image, author_id,
      category, tags, status, meta_title, meta_description,
      meta_keywords, og_image, published_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [title, slug, excerpt, content, featured_image, authorId, category, JSON.stringify(tags || []), status, meta_title, meta_description, JSON.stringify(meta_keywords || []), og_image, publishedAt]
  );

  // Get the inserted blog post
  const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM blog_posts WHERE id = ?', [result.insertId]);

  // Créer une notification pour tous les admins
  const [admins] = await pool.query<RowDataPacket[]>('SELECT id FROM users WHERE role = ?', ['admin']);
  for (const admin of admins) {
    await createNotification(
      admin.id,
      'blog',
      status === 'published' ? 'Nouvelle actualité publiée' : 'Nouveau brouillon créé',
      `${title}`,
      `/blog`
    );
  }

  logger.info(`Nouvel article de blog créé: ${title} par ${authorId}`);

  res.status(201).json({
    message: 'Article créé avec succès',
    data: rows[0]
  });
});

/**
 * Update blog post
 */
export const updateBlogPost = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    title,
    excerpt,
    content,
    featured_image,
    category,
    tags,
    status,
    meta_title,
    meta_description,
    meta_keywords,
    og_image
  } = req.body;

  // Get current post
  const [current] = await pool.query('SELECT status, slug FROM blog_posts WHERE id = ?', [id]);
  if (current.length === 0) {
    throw new NotFoundError('Article non trouvé');
  }

  let slug = current[0].slug;
  if (title) {
    const newSlug = generateSlug(title);
    if (newSlug !== slug) {
      const [existing] = await pool.query('SELECT id FROM blog_posts WHERE slug = ? AND id != ?', [newSlug, id]);
      if (existing.length > 0) {
        throw new Error('Un article avec ce titre existe déjà');
      }
      slug = newSlug;
    }
  }

  // Set published_at if status changes from draft to published
  let publishedAt = null;
  if (status === 'published' && current[0].status !== 'published') {
    publishedAt = new Date();
  }

  await pool.query(
    `UPDATE blog_posts SET
      title = COALESCE(?, title),
      slug = ?,
      excerpt = COALESCE(?, excerpt),
      content = COALESCE(?, content),
      featured_image = COALESCE(?, featured_image),
      category = COALESCE(?, category),
      tags = COALESCE(?, tags),
      status = COALESCE(?, status),
      meta_title = COALESCE(?, meta_title),
      meta_description = COALESCE(?, meta_description),
      meta_keywords = COALESCE(?, meta_keywords),
      og_image = COALESCE(?, og_image),
      published_at = COALESCE(?, published_at)
    WHERE id = ?`,
    [title, slug, excerpt, content, featured_image, category, tags ? JSON.stringify(tags) : null, status, meta_title, meta_description, meta_keywords ? JSON.stringify(meta_keywords) : null, og_image, publishedAt, id]
  );

  // Get updated post
  const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM blog_posts WHERE id = ?', [id]);

  // Créer une notification pour tous les admins
  const [admins] = await pool.query<RowDataPacket[]>('SELECT id FROM users WHERE role = ?', ['admin']);
  const notificationTitle = publishedAt ? 'Actualité publiée' : 'Actualité modifiée';
  const notificationMessage = publishedAt ? `${title || rows[0].title} a été publiée` : `${title || rows[0].title} a été modifiée`;
  
  for (const admin of admins) {
    await createNotification(
      admin.id,
      'blog',
      notificationTitle,
      notificationMessage,
      `/blog`
    );
  }

  logger.info(`Article de blog mis à jour: ${id}`);

  res.json({
    message: 'Article mis à jour avec succès',
    data: rows[0]
  });
});

/**
 * Delete blog post
 */
export const deleteBlogPost = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Récupérer le titre avant suppression
  const [post] = await pool.query<RowDataPacket[]>('SELECT title FROM blog_posts WHERE id = ?', [id]);
  const postTitle = post.length > 0 ? post[0].title : 'Article';

  const [result] = await pool.query<ResultSetHeader>(
    'DELETE FROM blog_posts WHERE id = ?',
    [id]
  );

  if (result.affectedRows === 0) {
    throw new NotFoundError('Article non trouvé');
  }

  // Créer une notification pour tous les admins
  const [admins] = await pool.query<RowDataPacket[]>('SELECT id FROM users WHERE role = ?', ['admin']);
  for (const admin of admins) {
    await createNotification(
      admin.id,
      'blog',
      'Actualité supprimée',
      `${postTitle} a été supprimée`,
      `/blog`
    );
  }

  logger.info(`Article de blog supprimé: ${id}`);

  res.json({ message: 'Article supprimé avec succès' });
});

/**
 * Get blog categories
 */
export const getBlogCategories = asyncHandler(async (req: Request, res: Response) => {
  const [rows] = await pool.query<RowDataPacket[]>('SELECT DISTINCT category FROM blog_posts WHERE category IS NOT NULL ORDER BY category ASC');

  const categories = rows.map((row: any) => row.category);

  res.json({ data: categories });
});
