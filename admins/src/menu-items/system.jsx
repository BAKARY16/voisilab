// assets
import {
  MailOutlined,
  UserOutlined,
  SettingOutlined,
  BellOutlined
} from '@ant-design/icons';

// icons
const icons = {
  MailOutlined,
  UserOutlined,
  SettingOutlined,
  BellOutlined
};

// ==============================|| MENU ITEMS - SYSTEM ||============================== //

const system = {
  id: 'group-system',
  title: 'Système',
  type: 'group',
  children: [
    {
      id: 'contacts',
      title: 'Messages',
      type: 'item',
      url: '/contacts',
      icon: icons.MailOutlined,
      breadcrumbs: true
    },
    {
      id: 'notifications',
      title: 'Notifications',
      type: 'item',
      url: '/notifications',
      icon: icons.BellOutlined,
      breadcrumbs: true
    },
    {
      id: 'users',
      title: 'Utilisateurs',
      type: 'item',
      url: '/users',
      icon: icons.UserOutlined,
      breadcrumbs: true
    },
    {
      id: 'settings',
      title: 'Paramètres',
      type: 'item',
      url: '/settings',
      icon: icons.SettingOutlined,
      breadcrumbs: true
    }
  ]
};

export default system;
