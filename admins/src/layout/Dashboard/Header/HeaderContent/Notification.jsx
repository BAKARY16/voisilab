import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import MainCard from 'components/MainCard';
import IconButton from 'components/@extended/IconButton';
import Transitions from 'components/@extended/Transitions';
import { notificationsService } from 'api/voisilab';

// assets
import BellOutlined from '@ant-design/icons/BellOutlined';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import GiftOutlined from '@ant-design/icons/GiftOutlined';
import MessageOutlined from '@ant-design/icons/MessageOutlined';
import SettingOutlined from '@ant-design/icons/SettingOutlined';
import ContactsOutlined from '@ant-design/icons/ContactsOutlined';
import FileTextOutlined from '@ant-design/icons/FileTextOutlined';
import { keyframes } from '@mui/system';

// Animation de la cloche qui sonne
const bellRing = keyframes`
  0% { transform: rotate(0) scale(1); }
  10% { transform: rotate(25deg) scale(1.1); }
  20% { transform: rotate(-25deg) scale(1.1); }
  30% { transform: rotate(20deg) scale(1.05); }
  40% { transform: rotate(-20deg) scale(1.05); }
  50% { transform: rotate(15deg) scale(1); }
  60% { transform: rotate(-15deg) scale(1); }
  70% { transform: rotate(10deg) scale(1); }
  80% { transform: rotate(-10deg) scale(1); }
  90% { transform: rotate(5deg) scale(1); }
  100% { transform: rotate(0) scale(1); }
`;

// Animation de pause entre les sonneries
const bellPause = keyframes`
  0%, 100% { transform: rotate(0); }
`;

// sx styles
const avatarSX = {
  width: 36,
  height: 36,
  fontSize: '1rem'
};

const actionSX = {
  mt: '6px',
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',

  transform: 'none'
};

// ==============================|| HEADER CONTENT - NOTIFICATION ||============================== //

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

const formatTimeAgo = (date) => {
  const now = new Date();
  const notificationDate = new Date(date);
  const diffMs = now - notificationDate;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "À l'instant";
  if (diffMins < 60) return `Il y a ${diffMins} min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  if (diffDays === 1) return 'Hier';
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  
  return notificationDate.toLocaleDateString('fr-FR');
};

export default function Notification() {
  const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const anchorRef = useRef(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadNotifications();
    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    try {
      const response = await notificationsService.getAll();
      setNotifications(response.data || []);
      setUnreadCount(response.unread_count || 0);
    } catch (error) {
      console.error('Erreur chargement notifications:', error);
    }
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleMarkAllAsRead = async () => {
    try {
      setLoading(true);
      await notificationsService.markAllAsRead();
      await loadNotifications();
    } catch (error) {
      console.error('Erreur marquage notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.is_read) {
        await notificationsService.markAsRead(notification.id);
        await loadNotifications();
      }
      if (notification.link) {
        navigate(notification.link);
      }
      setOpen(false);
    } catch (error) {
      console.error('Erreur clic notification:', error);
    }
  };

  const handleViewAll = () => {
    setOpen(false);
    navigate('/notifications');
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <IconButton
        color="secondary"
        variant="light"
        sx={(theme) => ({
          color: 'text.primary',
          bgcolor: open ? 'grey.100' : 'transparent',
        })}
        aria-label="open notifications"
        ref={anchorRef}
        aria-controls={open ? 'notifications-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <Badge 
          badgeContent={unreadCount} 
          color="error"
          sx={{
            '& .MuiBadge-badge': {
              animation: unreadCount > 0 ? 'badgePulse 1.5s ease-in-out infinite' : 'none',
              '@keyframes badgePulse': {
                '0%, 100%': { transform: 'scale(1) translate(50%, -50%)', boxShadow: '0 0 0 0 rgba(244, 67, 54, 0.7)' },
                '50%': { transform: 'scale(1.15) translate(50%, -50%)', boxShadow: '0 0 0 4px rgba(244, 67, 54, 0)' }
              }
            }
          }}
        >
          <Box
            component="span"
            sx={{
              display: 'inline-flex',
              fontSize: '1.25rem',
              transformOrigin: 'top center',
              animation: unreadCount > 0 ? `${bellRing} 1s ease-in-out infinite` : 'none',
              animationDelay: '0.5s',
              color: unreadCount > 0 ? 'warning.main' : 'inherit',
              '&:hover': {
                animation: `${bellRing} 0.6s ease-in-out`,
                color: 'primary.main'
              }
            }}
          >
            <BellOutlined style={{ fontSize: '1.3rem' }} />
          </Box>
        </Badge>
      </IconButton>
      <Popper
        placement={downMD ? 'bottom' : 'bottom-end'}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{ modifiers: [{ name: 'offset', options: { offset: [downMD ? -5 : 0, 9] } }] }}
      >
        {({ TransitionProps }) => (
          <Transitions type="grow" position={downMD ? 'top' : 'top-right'} in={open} {...TransitionProps}>
            <Paper sx={(theme) => ({ boxShadow: theme.customShadows.z1, width: '100%', minWidth: 285, maxWidth: { xs: 285, md: 420 } })}>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard
                  title="Notifications"
                  elevation={0}
                  border={false}
                  content={false}
                  secondary={
                    <>
                      {unreadCount > 0 && (
                        <Tooltip title="Tout marquer comme lu">
                          <IconButton color="success" size="small" onClick={handleMarkAllAsRead} disabled={loading}>
                            <CheckCircleOutlined style={{ fontSize: '1.15rem' }} />
                          </IconButton>
                        </Tooltip>
                      )}
                    </>
                  }
                >
                  <List
                    component="nav"
                    sx={{
                      p: 0,
                      '& .MuiListItemButton-root': {
                        py: 0.5,
                        px: 2,
                        '&.Mui-selected': { bgcolor: 'grey.50', color: 'text.primary' },
                        '& .MuiAvatar-root': avatarSX,
                        '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' }
                      }
                    }}
                  >
                    {notifications.length === 0 ? (
                      <ListItem>
                        <ListItemText
                          primary={
                            <Typography variant="body2" color="text.secondary" align="center">
                              Aucune notification
                            </Typography>
                          }
                        />
                      </ListItem>
                    ) : (
                      <>
                        {notifications.slice(0, 5).map((notification) => (
                          <ListItem
                            key={notification.id}
                            component={ListItemButton}
                            divider
                            selected={!notification.is_read}
                            onClick={() => handleNotificationClick(notification)}
                            secondaryAction={
                              <Typography variant="caption" noWrap>
                                {formatTimeAgo(notification.created_at)}
                              </Typography>
                            }
                          >
                            <ListItemAvatar>
                              <Avatar sx={getNotificationColor(notification.type)}>
                                {getNotificationIcon(notification.type)}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Typography variant="h6">
                                  {notification.title}
                                </Typography>
                              }
                              secondary={notification.message}
                            />
                          </ListItem>
                        ))}
                        <ListItemButton sx={{ textAlign: 'center', py: `${12}px !important` }} onClick={handleViewAll}>
                          <ListItemText
                            primary={
                              <Typography variant="h6" color="primary">
                                Voir tout
                              </Typography>
                            }
                          />
                        </ListItemButton>
                      </>
                    )}
                  </List>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </Box>
  );
}
