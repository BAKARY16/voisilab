import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteReadNotifications
} from '../controllers/notificationsController';

const router = Router();

// Toutes les routes nécessitent une authentification
router.use(authenticate);

// GET /api/notifications - Récupérer les notifications
router.get('/', getNotifications);

// PUT /api/notifications/:id/read - Marquer comme lue
router.put('/:id/read', markAsRead);

// PUT /api/notifications/mark-all-read - Marquer toutes comme lues
router.put('/mark-all-read', markAllAsRead);

// DELETE /api/notifications/:id - Supprimer une notification
router.delete('/:id', deleteNotification);

// DELETE /api/notifications/read - Supprimer toutes les lues
router.delete('/read', deleteReadNotifications);

export default router;
