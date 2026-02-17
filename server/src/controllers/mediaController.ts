import { Request, Response } from 'express';
import pool from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { asyncHandler, NotFoundError } from '../middlewares/errors';
import logger from '../config/logger';
import path from 'path';
import fs from 'fs/promises';

/**
 * Get all media with pagination and filters
 */
export const getAllMedia = asyncHandler(async (req: Request, res: Response) => {
  const { file_type, page = 1, limit = 20, search } = req.query;
  const pageNum = parseInt(page as string) || 1;
  const limitNum = parseInt(limit as string) || 20;
  const offset = (pageNum - 1) * limitNum;

  let query = `
    SELECT ml.*, u.full_name as uploaded_by_name
    FROM media_library ml
    LEFT JOIN users u ON ml.uploaded_by = u.id
    WHERE 1=1
  `;
  const params: any[] = [];

  if (file_type) {
    query += ` AND ml.file_type = ?`;
    params.push(file_type);
  }

  if (search) {
    query += ` AND (ml.title LIKE ? OR ml.description LIKE ?)`;
    params.push(`%${search}%`, `%${search}%`);
  }

  query += ` ORDER BY ml.created_at DESC LIMIT ? OFFSET ?`;
  params.push(limitNum, offset);

  const [rows] = await pool.query<RowDataPacket[]>(query, params);

  // Get total count
  let countQuery = 'SELECT COUNT(*) as count FROM media_library WHERE 1=1';
  const countParams: any[] = [];

  if (file_type) {
    countQuery += ` AND file_type = ?`;
    countParams.push(file_type);
  }

  if (search) {
    countQuery += ` AND (title LIKE ? OR description LIKE ?)`;
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
 * Get media by ID
 */
export const getMediaById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT ml.*, u.full_name as uploaded_by_name
     FROM media_library ml
     LEFT JOIN users u ON ml.uploaded_by = u.id
     WHERE ml.id = ?`,
    [id]
  );

  if (rows.length === 0) {
    throw new NotFoundError('Media non trouve');
  }

  res.json({ data: rows[0] });
});

/**
 * Upload media file
 */
export const uploadMedia = asyncHandler(async (req: Request, res: Response) => {
  const { title, description, tags } = req.body;
  const uploadedBy = (req as any).user?.userId;

  if (!req.file) {
    throw new Error('Aucun fichier fourni');
  }

  const file = req.file;
  const uploadDir = path.join(process.cwd(), 'uploads', 'media');

  try {
    await fs.mkdir(uploadDir, { recursive: true });
  } catch (error) {
    logger.error('Error creating upload directory:', error);
  }

  const timestamp = Date.now();
  const filename = `${timestamp}-${file.originalname}`;
  const filePath = path.join(uploadDir, filename);
  const fileUrl = `/uploads/media/${filename}`;

  await fs.writeFile(filePath, file.buffer);

  const mimeType = file.mimetype;
  let fileType = 'other';
  if (mimeType.startsWith('image/')) fileType = 'image';
  else if (mimeType.startsWith('video/')) fileType = 'video';
  else if (mimeType.startsWith('audio/')) fileType = 'audio';
  else if (mimeType === 'application/pdf') fileType = 'document';

  const [insertResult] = await pool.query<ResultSetHeader>(
    `INSERT INTO media_library (
      title, description, file_url, file_path, file_type,
      file_size, mime_type, tags, uploaded_by
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      title || file.originalname,
      description || null,
      fileUrl,
      filePath,
      fileType,
      file.size,
      mimeType,
      JSON.stringify(tags || []),
      uploadedBy
    ]
  );

  const [newRows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM media_library WHERE id = ?',
    [insertResult.insertId]
  );

  logger.info(`Nouveau media uploade: ${filename} par ${uploadedBy}`);

  res.status(201).json({
    message: 'Media uploade avec succes',
    data: newRows[0]
  });
});

/**
 * Update media metadata
 */
export const updateMedia = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, tags } = req.body;

  const [result] = await pool.query<ResultSetHeader>(
    `UPDATE media_library SET
      title = COALESCE(?, title),
      description = COALESCE(?, description),
      tags = COALESCE(?, tags)
    WHERE id = ?`,
    [title, description, tags ? JSON.stringify(tags) : null, id]
  );

  if (result.affectedRows === 0) {
    throw new NotFoundError('Media non trouve');
  }

  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM media_library WHERE id = ?',
    [id]
  );

  logger.info(`Media mis a jour: ${id}`);

  res.json({
    message: 'Media mis a jour avec succes',
    data: rows[0]
  });
});

/**
 * Delete media
 */
export const deleteMedia = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT file_path FROM media_library WHERE id = ?',
    [id]
  );

  if (rows.length === 0) {
    throw new NotFoundError('Media non trouve');
  }

  const filePath = rows[0].file_path;

  await pool.query('DELETE FROM media_library WHERE id = ?', [id]);

  try {
    await fs.unlink(filePath);
  } catch (error) {
    logger.error(`Error deleting file ${filePath}:`, error);
  }

  logger.info(`Media supprime: ${id}`);

  res.json({ message: 'Media supprime avec succes' });
});

/**
 * Get media by type
 */
export const getMediaByType = asyncHandler(async (req: Request, res: Response) => {
  const { type } = req.params;

  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM media_library WHERE file_type = ? ORDER BY created_at DESC',
    [type]
  );

  res.json({ data: rows });
});
