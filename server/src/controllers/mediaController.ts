import { Request, Response } from 'express';
import { pool } from '../config/database';
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
  const offset = ((page as number) - 1) * (limit as number);

  let query = `
    SELECT ml.*, u.full_name as uploaded_by_name
    FROM media_library ml
    LEFT JOIN users u ON ml.uploaded_by = u.id
    WHERE 1=1
  `;
  const params: any[] = [];
  let paramIndex = 1;

  if (file_type) {
    query += ` AND ml.file_type = $${paramIndex}`;
    params.push(file_type);
    paramIndex++;
  }

  if (search) {
    query += ` AND (ml.title ILIKE $${paramIndex} OR ml.description ILIKE $${paramIndex})`;
    params.push(`%${search}%`);
    paramIndex++;
  }

  query += ` ORDER BY ml.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  params.push(limit, offset);

  let result = await pool.query(query, params);

  // Get total count
  let countQuery = 'SELECT COUNT(*) as count FROM media_library WHERE 1=1';
  const countParams: any[] = [];
  let countParamIndex = 1;

  if (file_type) {
    countQuery += ` AND file_type = $${countParamIndex}`;
    countParams.push(file_type);
    countParamIndex++;
  }

  if (search) {
    countQuery += ` AND (title ILIKE $${countParamIndex} OR description ILIKE $${countParamIndex})`;
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
 * Get media by ID
 */
export const getMediaById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const [rows] = await pool.query<RowDataPacket[]>( `SELECT ml.*, u.full_name as uploaded_by_name
     FROM media_library ml
     LEFT JOIN users u ON ml.uploaded_by = u.id
     WHERE ml.id = ?`,
    [id]
  );

  if (rows.length === 0) {
    throw new NotFoundError(`Média non trouvé');
  }

  res.json({ data: rows[0] });
});

/**
 * Upload media file
 * Note: This is a basic implementation. In production, you should use
 * a proper file upload library like multer and store files in cloud storage.
 */
export const uploadMedia = asyncHandler(async (req: Request, res: Response) => {
  const { title, description, tags } = req.body;
  const uploadedBy = req.user?.userId;

  // Check if file exists in request
  if (!req.file) {
    throw new Error('Aucun fichier fourni');
  }

  const file = req.file;
  const uploadDir = path.join(process.cwd(), 'uploads', 'media');

  // Create upload directory if it doesn't exist
  try {
    await fs.mkdir(uploadDir, { recursive: true });
  } catch (error) {
    logger.error('Error creating upload directory:', error);
  }

  // Generate unique filename
  const timestamp = Date.now();
  const filename = `${timestamp}-${file.originalname}`;
  const filePath = path.join(uploadDir, filename);
  const fileUrl = `/uploads/media/${filename}`;

  // Save file
  await fs.writeFile(filePath, file.buffer);

  // Determine file type
  const mimeType = file.mimetype;
  let fileType = 'other';
  if (mimeType.startsWith('image/')) fileType = 'image';
  else if (mimeType.startsWith('video/')) fileType = 'video';
  else if (mimeType.startsWith('audio/')) fileType = 'audio';
  else if (mimeType === 'application/pdf') fileType = 'document';

  // Save to database
  const [insertResult] = await pool.query<ResultSetHeader>( `INSERT INTO media_library (
      title, description, file_url, file_path, file_type,
      file_size, mime_type, tags, uploaded_by
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
   `,
    [
      title || file.originalname,
      description,
      fileUrl,
      filePath,
      fileType,
      file.size,
      mimeType,
      tags || [],
      uploadedBy
    ]
  );

  logger.info(`Nouveau média uploadé: ${filename} par ${uploadedBy}`);

  res.status(201).json({
    message: `Média uploadé avec succès',
    data: rows[0]
  });
});

/**
 * Update media metadata
 */
export const updateMedia = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, tags } = req.body;

  const [updateResult] = await pool.query<ResultSetHeader>( `UPDATE media_library SET
      title = COALESCE(?, title),
      description = COALESCE(?, description),
      tags = COALESCE(?, tags)
    WHERE id = ?
   `,
    [title, description, tags, id]
  );

  if (rows.length === 0) {
    throw new NotFoundError(`Média non trouvé');
  }

  logger.info(`Média mis à jour: ${id}`);

  res.json({
    message: 'Média mis à jour avec succès',
    data: rows[0]
  });
});

/**
 * Delete media
 */
export const deleteMedia = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const [rows] = await pool.query<RowDataPacket[]>('SELECT file_path FROM media_library WHERE id = ?',
    [id]
  );

  if (rows.length === 0) {
    throw new NotFoundError('Média non trouvé');
  }

  const filePath = rows[0].file_path;

  // Delete from database
  await pool.query('DELETE FROM media_library WHERE id = ?', [id]);

  // Delete physical file
  try {
    await fs.unlink(filePath);
  } catch (error) {
    logger.error(`Error deleting file ${filePath}:`, error);
    // Continue even if file deletion fails
  }

  logger.info(`Média supprimé: ${id}`);

  res.json({ message: 'Média supprimé avec succès' });
});

/**
 * Get media by type
 */
export const getMediaByType = asyncHandler(async (req: Request, res: Response) => {
  const { type } = req.params;

  const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM media_library WHERE file_type = ? ORDER BY created_at DESC',
    [type]
  );

  res.json({ data: rows });
});
