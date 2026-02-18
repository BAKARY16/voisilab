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

// Routes spécifiques AVANT les routes paramétrées (:id)
// PUT /api/notifications/mark-all-read - Marquer toutes comme lues
router.put('/mark-all-read', markAllAsRead);

// PUT /api/notifications/:id/read - Marquer comme lue
router.put('/:id/read', markAsRead);

// DELETE /api/notifications/read - Supprimer toutes les lues (doit être AVANT /:id)
router.delete('/read', deleteReadNotifications);

// DELETE /api/notifications/:id - Supprimer une notification
router.delete('/:id', deleteNotification);

export default router;
