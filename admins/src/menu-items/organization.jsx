// assets
import {
  TeamOutlined,
  CustomerServiceOutlined
} from '@ant-design/icons';

// icons
const icons = {
  TeamOutlined,
  CustomerServiceOutlined
};

// ==============================|| MENU ITEMS - ORGANIZATION ||============================== //

const organization = {
  id: 'group-organization',
  title: 'Organisation',
  type: 'group',
  children: [
    {
      id: 'team',
      title: 'Équipe',
      type: 'item',
      url: '/team',
      icon: icons.TeamOutlined,
      breadcrumbs: true
    },
    {
      id: 'services',
      title: 'Services',
      type: 'item',
      url: '/services',
      icon: icons.CustomerServiceOutlined,
      breadcrumbs: true
    }
  ]
};

export default organization;
