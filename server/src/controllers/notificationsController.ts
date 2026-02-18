import { Request, Response } from 'express';
import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { asyncHandler, ValidationError } from '../middlewares/errors';
import logger from '../config/logger';

interface NotificationRow extends RowDataPacket {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  is_read: boolean;
  created_at: Date;
  read_at: Date | null;
}

/**
 * Créer une nouvelle notification
 */
export const createNotification = async (
  userId: string,
  type: string,
  title: string,
  message: string,
  link?: string
): Promise<void> => {
  await pool.query(
    `INSERT INTO notifications (user_id, type, title, message, link)
     VALUES (?, ?, ?, ?, ?)`,
    [userId, type, title, message, link || null]
  );
  
  logger.info(`Notification créée pour l'utilisateur ${userId}: ${title}`);
};

/**
 * Récupérer toutes les notifications d'un utilisateur
 */
export const getNotifications = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { unread_only } = req.query;

  let query = 'SELECT * FROM notifications WHERE user_id = ?';
  const params: any[] = [userId];

  if (unread_only === 'true') {
    query += ' AND is_read = FALSE';
  }

  query += ' ORDER BY created_at DESC LIMIT 50';

  const [notifications] = await pool.query<NotificationRow[]>(query, params);

  // Compter les non lues
  const [countResult] = await pool.query<RowDataPacket[]>(
    'SELECT COUNT(*) as unread_count FROM notifications WHERE user_id = ? AND is_read = FALSE',
    [userId]
  );

  res.json({
    data: notifications,
    unread_count: countResult[0].unread_count
  });
});

/**
 * Marquer une notification comme lue
 */
export const markAsRead = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;

  const [result] = await pool.query<ResultSetHeader>(
    `UPDATE notifications 
     SET is_read = TRUE, read_at = CURRENT_TIMESTAMP 
     WHERE id = ? AND user_id = ?`,
    [id, userId]
  );

  if (result.affectedRows === 0) {
    throw new ValidationError('Notification non trouvée');
  }

  res.json({ message: 'Notification marquée comme lue' });
});

/**
 * Marquer toutes les notifications comme lues
 */
export const markAllAsRead = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  const [result] = await pool.query<ResultSetHeader>(
    `UPDATE notifications 
     SET is_read = TRUE, read_at = CURRENT_TIMESTAMP 
     WHERE user_id = ? AND is_read = FALSE`,
    [userId]
  );

  res.json({ 
    message: 'Toutes les notifications marquées comme lues',
    count: result.affectedRows
  });
});

/**
 * Supprimer une notification
 */
export const deleteNotification = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;

  const [result] = await pool.query<ResultSetHeader>(
    'DELETE FROM notifications WHERE id = ? AND user_id = ?',
    [id, userId]
  );

  if (result.affectedRows === 0) {
    throw new ValidationError('Notification non trouvée');
  }

  res.json({ message: 'Notification supprimée' });
});

/**
 * Supprimer toutes les notifications lues
 */
export const deleteReadNotifications = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  const [result] = await pool.query<ResultSetHeader>(
    'DELETE FROM notifications WHERE user_id = ? AND is_read = TRUE',
    [userId]
  );

  res.json({ 
    message: 'Notifications lues supprimées',
    count: result.affectedRows
  });
});

/**
 * Créer une notification pour tous les admins et superadmins
 */
export const createForAllAdmins = async (
  type: string,
  title: string,
  message: string,
  link?: string
): Promise<void> => {
  try {
    // Récupérer tous les utilisateurs admin ET superadmin
    const [admins] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM users WHERE role IN ("admin", "superadmin") AND active = TRUE'
    );

    if (admins.length === 0) {
      logger.warn(`Aucun admin trouvé pour la notification: ${title}`);
      return;
    }

    // Créer une notification pour chaque admin/superadmin
    const promises = admins.map(admin =>
      pool.query(
        `INSERT INTO notifications (user_id, type, title, message, link)
         VALUES (?, ?, ?, ?, ?)`,
        [admin.id, type, title, message, link || null]
      )
    );

    await Promise.all(promises);
    logger.info(`Notifications créées pour ${admins.length} administrateur(s): ${title}`);
  } catch (err) {
    logger.error(`Erreur création notifications admins: ${err}`);
  }
};
