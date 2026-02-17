import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Chip, Paper, Box, Button } from '@mui/material';
import { DeleteOutlined, CheckOutlined, EyeOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';
import { notificationsService } from 'api/voisilab';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

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
    if (!window.confirm('Supprimer cette notification?')) return;
    try {
      await notificationsService.delete(id);
      loadNotifications();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
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
  );
}
