import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
// material-ui
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

// assets
import LockOutlined from '@ant-design/icons/LockOutlined';
import UserOutlined from '@ant-design/icons/UserOutlined';
import SettingOutlined from '@ant-design/icons/SettingOutlined';

// ==============================|| HEADER PROFILE - SETTING TAB ||============================== //

export default function SettingTab({ handleClose }) {
  const navigate = useNavigate();

  const handleProfileSettings = () => {
    navigate('/profile');
    if (handleClose) handleClose();
  };

  const handleSystemSettings = () => {
    navigate('/settings');
    if (handleClose) handleClose();
  };

  return (
    <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
      <ListItemButton onClick={handleProfileSettings}>
        <ListItemIcon>
          <UserOutlined />
        </ListItemIcon>
        <ListItemText primary="Paramètres du compte" />
      </ListItemButton>
      <ListItemButton onClick={handleProfileSettings}>
        <ListItemIcon>
          <LockOutlined />
        </ListItemIcon>
        <ListItemText primary="Sécurité" />
      </ListItemButton>
      <ListItemButton onClick={handleSystemSettings}>
        <ListItemIcon>
          <SettingOutlined />
        </ListItemIcon>
        <ListItemText primary="Paramètres système" />
      </ListItemButton>
    </List>
  );
}

SettingTab.propTypes = { handleClose: PropTypes.func };
