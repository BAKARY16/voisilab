import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

import {
  MailOutlined,
  FolderOpenOutlined,
  CheckCircleOutlined,
  TeamOutlined,
  RightOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  ReloadOutlined
} from '@ant-design/icons';

import { statsService, authService, contactsService, projectSubmissionsService, teamService } from 'api/voisilab';
import { useNavigate } from 'react-router-dom';

// Styled components pour un design épuré
const StatBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 12,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: 'none',
  height: '100%',
  minHeight: 140,
  cursor: 'pointer',
  transition: 'border-color 0.2s ease',
  '&:hover': {
    borderColor: theme.palette.text.secondary,
  }
}));

const ActivityItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 0),
  borderBottom: `1px solid ${theme.palette.divider}`,
  cursor: 'pointer',
  '&:last-child': {
    borderBottom: 'none'
  },
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    marginLeft: -16,
    marginRight: -16,
    paddingLeft: 16,
    paddingRight: 16,
  }
}));

const StatusDot = styled('span')(({ color }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: color,
  marginRight: 8,
  flexShrink: 0
}));

export default function DashboardDefault() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const result = await authService.verifyToken();
        if (!result || !result.user) {
          navigate('/login');
          return;
        }
        loadStats();
      } catch (error) {
        navigate('/login');
      }
    };
    checkAuth();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      
      // Récupérer les données directement depuis les APIs
      const [contactsResult, projectsResult, teamResult] = await Promise.all([
        contactsService.getAll({ limit: 200 }).catch(() => null),
        projectSubmissionsService.getAll({ limit: 200 }).catch(() => null),
        teamService.getAll().catch(() => null)
      ]);

      // Le backend renvoie { success, data: [...], pagination }
      // handleResponse retourne cet objet directement → accès via .data
      const contacts = contactsResult?.data || [];
      const projects = projectsResult?.data || [];
      const team = teamResult?.data || [];

      // Calculer les stats manuellement
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const overview = {
        contacts: {
          total: contacts.length,
          unread: contacts.filter(c => c.status === 'unread').length,
          thisWeek: contacts.filter(c => new Date(c.created_at) > weekAgo).length
        },
        projects: {
          total: projects.length,
          pending: projects.filter(p => p.status === 'pending').length,
          reviewing: projects.filter(p => p.status === 'reviewing').length,
          approved: projects.filter(p => p.status === 'approved').length,
          thisWeek: projects.filter(p => new Date(p.created_at) > weekAgo).length
        },
        team: {
          total: team.length,
          active: team.filter(t => t.active || t.is_active).length
        }
      };

      const recent = {
        contacts: contacts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5),
        projects: projects.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5)
      };

      setStats({ overview, recent });
    } catch (error) {
      if (!error.message.includes('Session expirée')) {
        console.error('Erreur chargement:', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `Il y a ${diffMins}m`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  };

  const getStatusColor = (status) => {
    const colors = {
      unread: '#ef4444',
      read: '#94a3b8',
      replied: '#22c55e',
      pending: '#f59e0b',
      reviewing: '#3b82f6',
      approved: '#22c55e',
      rejected: '#ef4444'
    };
    return colors[status] || '#94a3b8';
  };

  const getStatusLabel = (status, type) => {
    if (type === 'contact') {
      return { unread: 'Non lu', read: 'Lu', replied: 'Répondu' }[status] || status;
    }
    return { pending: 'En attente', reviewing: 'En revue', approved: 'Approuvé', rejected: 'Rejeté' }[status] || status;
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>Chargement...</Typography>
        <LinearProgress sx={{ borderRadius: 1 }} />
      </Box>
    );
  }

  if (!stats) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">Impossible de charger les données</Typography>
        <Button onClick={loadStats} sx={{ mt: 2 }} startIcon={<ReloadOutlined />}>
          Réessayer
        </Button>
      </Box>
    );
  }

  const { overview, recent } = stats;

  return (
    <Box sx={{ width: '100%', minHeight: '100%' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={600} sx={{ color: 'text.primary', mb: 0.5 }}>
          Tableau de bord
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Vue d'ensemble de l'activité
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' },
        gap: 3,
        mb: 4
      }}>
        <StatBox onClick={() => navigate('/contacts')}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <MailOutlined style={{ fontSize: 24, color: '#64748b' }} />
            {overview.contacts.unread > 0 && (
              <Typography variant="body2" sx={{ 
                bgcolor: '#fef2f2', 
                color: '#dc2626', 
                px: 1.5, 
                py: 0.5, 
                borderRadius: 1,
                fontWeight: 500 
              }}>
                {overview.contacts.unread} non lu{overview.contacts.unread > 1 ? 's' : ''}
              </Typography>
            )}
          </Box>
          <Typography variant="h3" fontWeight={600} sx={{ color: 'text.primary', mb: 1 }}>
            {overview.contacts.total}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Messages
          </Typography>
        </StatBox>

        <StatBox onClick={() => navigate('/contacts')}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <FolderOpenOutlined style={{ fontSize: 24, color: '#64748b' }} />
            {overview.projects.pending > 0 && (
              <Typography variant="body2" sx={{ 
                bgcolor: '#fffbeb', 
                color: '#d97706', 
                px: 1.5, 
                py: 0.5, 
                borderRadius: 1,
                fontWeight: 500 
              }}>
                {overview.projects.pending} en attente
              </Typography>
            )}
          </Box>
          <Typography variant="h3" fontWeight={600} sx={{ color: 'text.primary', mb: 1 }}>
            {overview.projects.total}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Projets soumis
          </Typography>
        </StatBox>

        <StatBox onClick={() => navigate('/contacts')}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <CheckCircleOutlined style={{ fontSize: 24, color: '#64748b' }} />
          </Box>
          <Typography variant="h3" fontWeight={600} sx={{ color: 'text.primary', mb: 1 }}>
            {overview.projects.approved}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Projets approuvés
          </Typography>
        </StatBox>

        <StatBox onClick={() => navigate('/team')}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <TeamOutlined style={{ fontSize: 24, color: '#64748b' }} />
          </Box>
          <Typography variant="h3" fontWeight={600} sx={{ color: 'text.primary', mb: 1 }}>
            {overview.team.active}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Membres actifs
          </Typography>
        </StatBox>
      </Box>

      {/* Activity Section */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
        gap: 3,
        mb: 4
      }}>
        {/* Messages récents */}
        <Paper sx={{ p: 0, border: '1px solid', borderColor: 'divider', borderRadius: 3, boxShadow: 'none', minHeight: 400 }}>
          <Box sx={{ 
            p: 3, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            borderBottom: '1px solid',
            borderColor: 'divider'
          }}>
            <Typography variant="h6" fontWeight={600}>
              Messages récents
            </Typography>
            <Button 
              endIcon={<RightOutlined style={{ fontSize: 14 }} />}
              onClick={() => navigate('/contacts')}
              sx={{ color: 'text.secondary', textTransform: 'none' }}
            >
              Voir tout
            </Button>
          </Box>
          <Box sx={{ p: 3, pt: 2 }}>
            {recent.contacts.length === 0 ? (
              <Box sx={{ py: 8, textAlign: 'center' }}>
                <MailOutlined style={{ fontSize: 32, color: '#cbd5e1' }} />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Aucun message
                </Typography>
              </Box>
            ) : (
              recent.contacts.slice(0, 5).map((contact) => (
                <ActivityItem key={contact.id} onClick={() => navigate('/contacts')}>
                  <StatusDot color={getStatusColor(contact.status)} />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={contact.status === 'unread' ? 600 : 400} noWrap>
                      {contact.firstname} {contact.lastname}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
                      {contact.subject}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right', ml: 2, flexShrink: 0 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      {formatDate(contact.created_at)}
                    </Typography>
                    <Typography variant="caption" sx={{ 
                      color: getStatusColor(contact.status),
                      fontSize: '0.7rem'
                    }}>
                      {getStatusLabel(contact.status, 'contact')}
                    </Typography>
                  </Box>
                </ActivityItem>
              ))
            )}
          </Box>
        </Paper>

        {/* Projets récents */}
        <Paper sx={{ p: 0, border: '1px solid', borderColor: 'divider', borderRadius: 3, boxShadow: 'none', minHeight: 400 }}>
          <Box sx={{ 
            p: 3, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            borderBottom: '1px solid',
            borderColor: 'divider'
          }}>
            <Typography variant="h6" fontWeight={600}>
              Projets récents
            </Typography>
            <Button 
              endIcon={<RightOutlined style={{ fontSize: 14 }} />}
              onClick={() => navigate('/voisilab/project-submissions')}
              sx={{ color: 'text.secondary', textTransform: 'none' }}
            >
              Voir tout
            </Button>
          </Box>
          <Box sx={{ p: 3, pt: 2 }}>
            {recent.projects.length === 0 ? (
              <Box sx={{ py: 8, textAlign: 'center' }}>
                <FolderOpenOutlined style={{ fontSize: 48, color: '#cbd5e1' }} />
                <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                  Aucun projet
                </Typography>
              </Box>
            ) : (
              recent.projects.slice(0, 5).map((project) => (
                <ActivityItem key={project.id} onClick={() => navigate('/voisilab/project-submissions')}>
                  <StatusDot color={getStatusColor(project.status)} />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body1" fontWeight={project.status === 'pending' ? 600 : 400} noWrap>
                      {project.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap sx={{ display: 'block', mt: 0.5 }}>
                      {project.project_type}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right', ml: 2, flexShrink: 0 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'block' }}>
                      {formatDate(project.created_at)}
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: getStatusColor(project.status),
                      mt: 0.5
                    }}>
                      {getStatusLabel(project.status, 'project')}
                    </Typography>
                  </Box>
                </ActivityItem>
              ))
            )}
          </Box>
        </Paper>
      </Box>

      {/* Summary Row */}
      <Box sx={{ 
        p: 3,
        bgcolor: '#f8fafc',
        borderRadius: 3,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 5,
        border: '1px solid',
        borderColor: 'divider'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <ClockCircleOutlined style={{ color: '#64748b', fontSize: 18 }} />
          <Typography variant="body1" color="text.secondary">
            Cette semaine: <strong style={{ color: '#1e293b' }}>{overview.contacts.thisWeek}</strong> messages, <strong style={{ color: '#1e293b' }}>{overview.projects.thisWeek}</strong> projets
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <EyeOutlined style={{ color: '#64748b', fontSize: 18 }} />
          <Typography variant="body1" color="text.secondary">
            En revue: <strong style={{ color: '#1e293b' }}>{overview.projects.reviewing}</strong> projet{overview.projects.reviewing > 1 ? 's' : ''}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <TeamOutlined style={{ color: '#64748b', fontSize: 18 }} />
          <Typography variant="body1" color="text.secondary">
            Équipe: <strong style={{ color: '#1e293b' }}>{overview.team.total}</strong> membres au total
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
