import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import ProtectedRoute from 'components/ProtectedRoute';

// Dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/default')));

// VoisiLab Pages - Content
const BlogPage = Loadable(lazy(() => import('pages/voisilab/BlogPage')));
const InnovationsPage = Loadable(lazy(() => import('pages/voisilab/InnovationsPage')));
const PagesManagement = Loadable(lazy(() => import('pages/voisilab/PagesManagement')));
const MediaPage = Loadable(lazy(() => import('pages/voisilab/MediaPage')));

// VoisiLab Pages - Fablab
const ProjectsPage = Loadable(lazy(() => import('pages/voisilab/ProjectsPage')));
const PPNPage = Loadable(lazy(() => import('pages/voisilab/PPNPage')));
const WorkshopsPage = Loadable(lazy(() => import('pages/voisilab/WorkshopsPage')));
const EquipmentPage = Loadable(lazy(() => import('pages/voisilab/EquipmentPage')));

// VoisiLab Pages - Organization
const TeamPage = Loadable(lazy(() => import('pages/voisilab/TeamPage')));
const ServicesPage = Loadable(lazy(() => import('pages/voisilab/ServicesPage')));

// VoisiLab Pages - System
const ContactsPage = Loadable(lazy(() => import('pages/voisilab/ContactsPage')));
const UsersPage = Loadable(lazy(() => import('pages/voisilab/UsersPage')));
const SettingsPage = Loadable(lazy(() => import('pages/voisilab/SettingsPage')));
const ProfilePage = Loadable(lazy(() => import('pages/voisilab/ProfilePage')));
const NotificationsPage = Loadable(lazy(() => import('pages/notifications/NotificationsPage')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: (
    <ProtectedRoute>
      <DashboardLayout />
    </ProtectedRoute>
  ),
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    // Content Management
    {
      path: 'blog',
      element: <BlogPage />
    },
    {
      path: 'innovations',
      element: <InnovationsPage />
    },
    {
      path: 'pages',
      element: <PagesManagement />
    },
    {
      path: 'media',
      element: <MediaPage />
    },
    // Fablab
    {
      path: 'projects',
      element: <ProjectsPage />
    },
    {
      path: 'ppn',
      element: <PPNPage />
    },
    {
      path: 'workshops',
      element: <WorkshopsPage />
    },
    {
      path: 'equipment',
      element: <EquipmentPage />
    },
    // Organization
    {
      path: 'team',
      element: <TeamPage />
    },
    {
      path: 'services',
      element: <ServicesPage />
    },
    // System
    {
      path: 'contacts',
      element: <ContactsPage />
    },
    {
      path: 'contacts/:id',
      element: <ContactsPage />
    },
    {
      path: 'users',
      element: <UsersPage />
    },
    {
      path: 'settings',
      element: <SettingsPage />
    },
    {
      path: 'profile',
      element: <ProfilePage />
    },
    {
      path: 'notifications',
      element: <NotificationsPage />
    }
  ]
};

export default MainRoutes;
