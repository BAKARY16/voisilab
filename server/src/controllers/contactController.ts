import { Request, Response } from 'express';
import { pool } from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { asyncHandler, NotFoundError } from '../middlewares/errors';
import logger from '../config/logger';
import { createNotification } from './notificationsController';

/**
 * Get all contact messages with pagination and filters
 */
export const getAllContacts = asyncHandler(async (req: Request, res: Response) => {
  const { status, page = 1, limit = 10, search } = req.query;
  const offset = ((page as number) - 1) * (limit as number);

  let query = 'SELECT * FROM contact_messages WHERE 1=1';
  const params: any[] = [];

  if (status) {
    query += ` AND status = ?`;
    params.push(status);
  }

  if (search) {
    query += ` AND (name LIKE ? OR email LIKE ? OR subject LIKE ? OR message LIKE ?)`;
    params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
  }

  query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  const [rows] = await pool.query<RowDataPacket[]>(query, params);

  // Get total count
  let countQuery = 'SELECT COUNT(*) as count FROM contact_messages WHERE 1=1';
  const countParams: any[] = [];

  if (status) {
    countQuery += ` AND status = ?`;
    countParams.push(status);
  }

  if (search) {
    countQuery += ` AND (name LIKE ? OR email LIKE ? OR subject LIKE ? OR message LIKE ?)`;
    countParams.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
  }

  const [countRows] = await pool.query<RowDataPacket[]>(countQuery, countParams);
  const total = parseInt(countRows[0].count as string);

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
 * Get contact message by ID
 */
export const getContactById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM contact_messages WHERE id = ?',
    [id]
  );

  if (rows.length === 0) {
    throw new NotFoundError('Message non trouvé');
  }

  // Mark as read if it was unread
  if (rows[0].status === 'unread') {
    await pool.query(
      'UPDATE contact_messages SET status = ? WHERE id = ?',
      ['read', id]
    );
  }

  res.json({ data: rows[0] });
});

/**
 * Create contact message (public)
 */
export const createContact = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, phone, subject, message } = req.body;

  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO contact_messages (name, email, phone, subject, message)
     VALUES (?, ?, ?, ?, ?)`,
    [name, email, phone, subject, message]
  );

  // Get the inserted contact message
  const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM contact_messages WHERE id = ?', [result.insertId]);

  // Créer une notification pour tous les admins
  const [admins] = await pool.query<RowDataPacket[]>('SELECT id FROM users WHERE role = ?', ['admin']);
  for (const admin of admins) {
    await createNotification(
      admin.id,
      'contact',
      'Nouveau message de contact',
      `${name} (${email}) : ${subject}`,
      `/contacts/${result.insertId}`
    );
  }

  logger.info(`Nouveau message de contact: ${email} - ${subject}`);

  res.status(201).json({
    message: 'Message envoyé avec succès',
    data: rows[0]
  });
});

/**
 * Update contact message status
 */
export const updateContactStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const [result] = await pool.query<ResultSetHeader>(
    'UPDATE contact_messages SET status = ? WHERE id = ?',
    [status, id]
  );

  if (result.affectedRows === 0) {
    throw new NotFoundError('Message non trouvé');
  }

  // Get updated contact message
  const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM contact_messages WHERE id = ?', [id]);

  logger.info(`Statut du message ${id} mis à jour: ${status}`);

  res.json({
    message: 'Statut mis à jour',
    data: rows[0]
  });
});

/**
 * Delete contact message
 */
export const deleteContact = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const [result] = await pool.query<ResultSetHeader>(
    'DELETE FROM contact_messages WHERE id = ?',
    [id]
  );

  if (result.affectedRows === 0) {
    throw new NotFoundError('Message non trouvé');
  }

  logger.info(`Message de contact supprimé: ${id}`);

  res.json({ message: 'Message supprimé avec succès' });
});

/**
 * Get contact statistics
 */
export const getContactStats = asyncHandler(async (req: Request, res: Response) => {
  const [rows] = await pool.query<RowDataPacket[]>(`
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN status = 'unread' THEN 1 ELSE 0 END) as unread,
      SUM(CASE WHEN status = 'read' THEN 1 ELSE 0 END) as \`read\`,
      SUM(CASE WHEN status = 'replied' THEN 1 ELSE 0 END) as replied,
      SUM(CASE WHEN status = 'archived' THEN 1 ELSE 0 END) as archived
    FROM contact_messages
  `);

  res.json({ data: rows[0] });
});
