import { useState, useEffect } from 'react';

// material-ui
import {
  Box,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Paper,
  Button,
  Chip,
  IconButton,
  Backdrop,
  CircularProgress,
  Alert,
  Stack,
  Divider
} from '@mui/material';

// project imports
import MainCard from 'components/MainCard';
import { notificationsService } from 'api/voisilab';

// assets
import {
  BellOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  ContactsOutlined,
  FileTextOutlined,
  GiftOutlined,
  SettingOutlined,
  MessageOutlined
} from '@ant-design/icons';

// ==============================|| NOTIFICATIONS PAGE ||============================== //

const getNotificationIcon = (type) => {
  switch (type) {
    case 'contact':
      return <ContactsOutlined />;
    case 'blog':
      return <FileTextOutlined />;
    case 'project':
      return <GiftOutlined />;
    case 'system':
      return <SettingOutlined />;
    default:
      return <MessageOutlined />;
  }
};

const getNotificationColor = (type) => {
  switch (type) {
    case 'contact':
      return { color: 'warning.main', bgcolor: 'warning.lighter' };
    case 'blog':
      return { color: 'info.main', bgcolor: 'info.lighter' };
    case 'project':
      return { color: 'success.main', bgcolor: 'success.lighter' };
    case 'system':
      return { color: 'error.main', bgcolor: 'error.lighter' };
    default:
      return { color: 'primary.main', bgcolor: 'primary.lighter' };
  }
};

const formatDate = (date) => {
  return new Date(date).toLocaleString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all' | 'unread'
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadNotifications();
  }, [filter]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = filter === 'unread' ? { unread_only: 'true' } : {};
      const response = await notificationsService.getAll(params);
      setNotifications(response.data || []);
      setUnreadCount(response.unread_count || 0);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des notifications');
      console.error('Erreur chargement notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationsService.markAsRead(notificationId);
      await loadNotifications();
    } catch (err) {
      console.error('Erreur marquage notification:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setLoading(true);
      await notificationsService.markAllAsRead();
      await loadNotifications();
    } catch (err) {
      setError('Erreur lors du marquage des notifications');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await notificationsService.delete(notificationId);
      await loadNotifications();
    } catch (err) {
      console.error('Erreur suppression notification:', err);
    }
  };

  const handleDeleteReadNotifications = async () => {
    if (window.confirm('Supprimer toutes les notifications lues ?')) {
      try {
        setLoading(true);
        await notificationsService.deleteReadNotifications();
        await loadNotifications();
      } catch (err) {
        setError('Erreur lors de la suppression');
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Backdrop open={loading} sx={{ zIndex: 1300 }}>
        <CircularProgress color="primary" />
      </Backdrop>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <MainCard
            title={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <BellOutlined style={{ fontSize: '1.5rem' }} />
                <Typography variant="h3">
                  Notifications
                  {unreadCount > 0 && (
                    <Chip
                      label={unreadCount}
                      color="primary"
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  )}
                </Typography>
              </Box>
            }
            secondary={
              <Stack direction="row" spacing={1}>
                <Button
                  variant={filter === 'all' ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => setFilter('all')}
                >
                  Toutes
                </Button>
                <Button
                  variant={filter === 'unread' ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => setFilter('unread')}
                >
                  Non lues ({unreadCount})
                </Button>
                <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                {unreadCount > 0 && (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<CheckCircleOutlined />}
                    onClick={handleMarkAllAsRead}
                  >
                    Tout marquer comme lu
                  </Button>
                )}
                <Button
                  variant="outlined"
                  size="small"
                  color="error"
                  startIcon={<DeleteOutlined />}
                  onClick={handleDeleteReadNotifications}
                >
                  Supprimer les lues
                </Button>
              </Stack>
            }
          >
            {error && (
              <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            {notifications.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <BellOutlined style={{ fontSize: '4rem', color: '#ccc' }} />
                <Typography variant="h5" color="text.secondary" sx={{ mt: 2 }}>
                  {filter === 'unread' ? 'Aucune notification non lue' : 'Aucune notification'}
                </Typography>
              </Box>
            ) : (
              <List sx={{ p: 0 }}>
                {notifications.map((notification, index) => (
                  <Box key={notification.id}>
                    <ListItem
                      component={Paper}
                      variant={notification.is_read ? 'outlined' : 'elevation'}
                      elevation={notification.is_read ? 0 : 1}
                      sx={{
                        mb: 2,
                        bgcolor: notification.is_read ? 'background.paper' : 'primary.lighter',
                        opacity: notification.is_read ? 0.7 : 1
                      }}
                      secondaryAction={
                        <Stack direction="row" spacing={1}>
                          {!notification.is_read && (
                            <IconButton
                              edge="end"
                              aria-label="marquer comme lu"
                              onClick={() => handleMarkAsRead(notification.id)}
                              color="success"
                            >
                              <CheckCircleOutlined />
                            </IconButton>
                          )}
                          <IconButton
                            edge="end"
                            aria-label="supprimer"
                            onClick={() => handleDeleteNotification(notification.id)}
                            color="error"
                          >
                            <DeleteOutlined />
                          </IconButton>
                        </Stack>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar sx={getNotificationColor(notification.type)}>
                          {getNotificationIcon(notification.type)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="h6" sx={{ fontWeight: notification.is_read ? 'normal' : 'bold' }}>
                            {notification.title}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              {notification.message}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                              {formatDate(notification.created_at)}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  </Box>
                ))}
              </List>
            )}
          </MainCard>
        </Grid>
      </Grid>
    </>
  );
}
