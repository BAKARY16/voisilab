// assets
import {
  BulbOutlined,
  EnvironmentOutlined,
  BookOutlined,
  ToolOutlined
} from '@ant-design/icons';

// icons
const icons = {
  BulbOutlined,
  EnvironmentOutlined,
  BookOutlined,
  ToolOutlined
};

// ==============================|| MENU ITEMS - FABLAB ||============================== //

const fablab = {
  id: 'group-fablab',
  title: 'Fablab',
  type: 'group',
  children: [
    {
      id: 'projects',
      title: 'Projets',
      type: 'item',
      url: '/projects',
      icon: icons.BulbOutlined,
      breadcrumbs: true
    },
    {
      id: 'ppn',
      title: 'Points PPN',
      type: 'item',
      url: '/ppn',
      icon: icons.EnvironmentOutlined,
      breadcrumbs: true
    },
    {
      id: 'workshops',
      title: 'Ateliers',
      type: 'item',
      url: '/workshops',
      icon: icons.BookOutlined,
      breadcrumbs: true
    },
    {
      id: 'equipment',
      title: 'Équipements',
      type: 'item',
      url: '/equipment',
      icon: icons.ToolOutlined,
      breadcrumbs: true
    }
  ]
};

export default fablab;
