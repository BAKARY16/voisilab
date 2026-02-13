// assets
import {
  FileTextOutlined,
  FileOutlined,
  PictureOutlined
} from '@ant-design/icons';

// icons
const icons = {
  FileTextOutlined,
  FileOutlined,
  PictureOutlined
};

// ==============================|| MENU ITEMS - CONTENT ||============================== //

const content = {
  id: 'group-content',
  title: 'Contenu',
  type: 'group',
  children: [
    {
      id: 'blog',
      title: 'Blog',
      type: 'item',
      url: '/blog',
      icon: icons.FileTextOutlined,
      breadcrumbs: true
    },
    {
      id: 'pages',
      title: 'Pages',
      type: 'item',
      url: '/pages',
      icon: icons.FileOutlined,
      breadcrumbs: true
    },
    {
      id: 'media',
      title: 'Médias',
      type: 'item',
      url: '/media',
      icon: icons.PictureOutlined,
      breadcrumbs: true
    }
  ]
};

export default content;
