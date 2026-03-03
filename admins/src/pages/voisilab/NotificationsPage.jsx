import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Chip, Paper, Box, Button, Snackbar, Alert, Dialog, DialogContent, DialogActions, Typography } from '@mui/material';
import { DeleteOutlined, CheckOutlined, EyeOutlined, WarningOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';
import { notificationsService } from 'api/voisilab';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ open: false, title: '', message: '', severity: 'info' });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', message: '', onConfirm: null, onCancel: null });

  const showAlert = (title, message = '', ok = false) => setAlert({ open: true, title, message, severity: ok ? 'success' : 'error' });
  const askConfirm = (title, message) => new Promise(resolve => {
    setConfirmDialog({ open: true, title, message,
      onConfirm: () => { setConfirmDialog(d => ({ ...d, open: false })); resolve(true); },
      onCancel:  () => { setConfirmDialog(d => ({ ...d, open: false })); resolve(false); }
    });
  });

  useEffect(() => { loadNotifications(); }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const result = await notificationsService.getAll();
      setNotifications(result.data || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationsService.markAsRead(id);
      loadNotifications();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsService.markAllAsRead();
      loadNotifications();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleDelete = async (id) => {
    const ok = await askConfirm('Supprimer la notification', 'Cette action est irréversible.');
    if (!ok) return;
    try {
      await notificationsService.delete(id);
      loadNotifications();
      showAlert('Notification supprimée', '', true);
    } catch (error) {
      showAlert('Erreur', error.message || 'Erreur lors de la suppression');
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <Snackbar open={alert.open} autoHideDuration={4000} onClose={() => setAlert(p => ({ ...p, open: false }))} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert onClose={() => setAlert(p => ({ ...p, open: false }))} severity={alert.severity} variant="filled" sx={{ minWidth: 280 }}>
          <strong>{alert.title}</strong>{alert.message ? ' — ' + alert.message : ''}
        </Alert>
      </Snackbar>
      <Dialog open={confirmDialog.open} onClose={() => confirmDialog.onCancel?.()} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3, overflow: 'hidden' } }}>
        <Box sx={{ height: 6, bgcolor: 'error.main' }} />
        <DialogContent sx={{ pt: 4, pb: 2, textAlign: 'center' }}>
          <Box sx={{ width: 60, height: 60, borderRadius: '50%', mx: 'auto', mb: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#fef2f2' }}>
            <WarningOutlined style={{ fontSize: 28, color: '#ef4444' }} />
          </Box>
          <Typography variant="h6" fontWeight={700} gutterBottom>{confirmDialog.title}</Typography>
          <Typography variant="body2" color="text.secondary">{confirmDialog.message}</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1, justifyContent: 'center' }}>
          <Button variant="outlined" onClick={() => confirmDialog.onCancel?.()} sx={{ minWidth: 110, borderRadius: 2 }}>Annuler</Button>
          <Button variant="contained" color="error" onClick={() => confirmDialog.onConfirm?.()} disableElevation sx={{ minWidth: 110, borderRadius: 2 }}>Supprimer</Button>
        </DialogActions>
      </Dialog>
      <MainCard 
      title="Centre de notifications" 
      secondary={
        unreadCount > 0 && (
          <Button 
            variant="contained" 
            size="small" 
            startIcon={<CheckOutlined />} 
            onClick={handleMarkAllAsRead}
          >
            Tout marquer comme lu
          </Button>
        )
      }
    >
      {unreadCount > 0 && (
        <Box sx={{ mb: 2 }}>
          <Chip label={`${unreadCount} notification(s) non lue(s)`} color="primary" />
        </Box>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Message</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} align="center">Chargement...</TableCell></TableRow>
            ) : notifications.length === 0 ? (
              <TableRow><TableCell colSpan={5} align="center">Aucune notification</TableCell></TableRow>
            ) : (
              notifications.map((notification) => (
                <TableRow 
                  key={notification.id} 
                  sx={{ bgcolor: notification.read ? 'transparent' : 'action.hover' }}
                >
                  <TableCell>
                    <Chip 
                      label={notification.type || 'info'} 
                      size="small" 
                      color={
                        notification.type === 'error' ? 'error' :
                        notification.type === 'warning' ? 'warning' :
                        notification.type === 'success' ? 'success' : 'default'
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <div style={{ fontWeight: notification.read ? 400 : 600 }}>
                      {notification.title}
                    </div>
                    {notification.message && (
                      <div style={{ fontSize: '0.875rem', color: '#666' }}>
                        {notification.message}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {notification.created_at ? new Date(notification.created_at).toLocaleString('fr-FR') : '-'}
                  </TableCell>
                  <TableCell>
                    {notification.read ? (
                      <Chip label="Lu" size="small" />
                    ) : (
                      <Chip label="Non lu" color="primary" size="small" />
                    )}
                  </TableCell>
                  <TableCell>
                    {!notification.read && (
                      <IconButton 
                        onClick={() => handleMarkAsRead(notification.id)} 
                        size="small"
                        color="primary"
                      >
                        <EyeOutlined />
                      </IconButton>
                    )}
                    <IconButton 
                      onClick={() => handleDelete(notification.id)} 
                      color="error" 
                      size="small"
                    >
                      <DeleteOutlined />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </MainCard>
    </>
  );
}
