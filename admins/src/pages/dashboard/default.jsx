import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import Avatar from '@mui/material/Avatar';
import { alpha } from '@mui/material/styles';

// Icons Ant Design
import {
  MailOutlined,
  FolderOpenOutlined,
  CheckCircleOutlined,
  TeamOutlined,
  RiseOutlined,
  FallOutlined,
  UserOutlined,
  FileTextOutlined
} from '@ant-design/icons';

import { statsService, authService } from 'api/voisilab';
import { useNavigate } from 'react-router-dom';

// Wrappers pour icônes Ant Design avec support MUI sx
const antIconStyle = (sxProps) => {
  const style = {};
  if (sxProps?.fontSize) style.fontSize = sxProps.fontSize;
  if (sxProps?.color) {
    // Convertir les couleurs MUI en hex
    const colorMap = {
      'success.main': '#2e7d32',
      'error.main': '#d32f2f',
      'primary.main': '#1976d2',
      'warning.main': '#ed6c02',
      'info.main': '#0288d1',
      'text.secondary': '#757575'
    };
    style.color = colorMap[sxProps.color] || sxProps.color;
  }
  if (sxProps?.mr) style.marginRight = `${sxProps.mr * 8}px`;
  if (sxProps?.mb) style.marginBottom = `${sxProps.mb * 8}px`;
  if (sxProps?.opacity) style.opacity = sxProps.opacity;
  return style;
};

const EmailOutlinedIcon = ({ sx, ...props }) => <MailOutlined style={antIconStyle(sx)} {...props} />;
const FolderOpenOutlinedIcon = ({ sx, ...props }) => <FolderOpenOutlined style={antIconStyle(sx)} {...props} />;
const CheckCircleOutlineIcon = ({ sx, ...props }) => <CheckCircleOutlined style={antIconStyle(sx)} {...props} />;
const PeopleOutlineIcon = ({ sx, ...props }) => <TeamOutlined style={antIconStyle(sx)} {...props} />;
const TrendingUpIcon = ({ sx, ...props }) => <RiseOutlined style={antIconStyle(sx)} {...props} />;
const TrendingDownIcon = ({ sx, ...props }) => <FallOutlined style={antIconStyle(sx)} {...props} />;
const PersonIcon = ({ sx, ...props }) => <UserOutlined style={antIconStyle(sx)} {...props} />;
const AssignmentIcon = ({ sx, ...props }) => <FileTextOutlined style={antIconStyle(sx)} {...props} />;

export default function DashboardDefault() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Vérifier la validité du token au montage
    const checkAuth = async () => {
      const isValid = await authService.verifyToken();
      if (!isValid) {
        console.warn('⚠️ Token invalide - redirection vers login');
        navigate('/login');
        return;
      }
      // Token valide, charger les stats
      loadStats();
    };
    
    checkAuth();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      console.log('🔄 Chargement des stats du dashboard...');
      console.log('📍 API URL:', import.meta.env.VITE_API_URL || 'http://localhost:5000');
      
      const token = localStorage.getItem('token');
      console.log('🔑 Token présent:', !!token);
      if (token) {
        console.log('🔑 Token:', token.substring(0, 20) + '...');
      }
      
      const result = await statsService.getDashboard();
      console.log('✅ Stats reçues:', result);
      
      setStats(result.data);
    } catch (error) {
      console.error('❌ Erreur chargement stats:', error);
      console.error('❌ Message:', error.message);
      
      // Si c'est une erreur d'authentification, l'utilisateur sera automatiquement redirigé
      // Sinon, afficher un message d'erreur
      if (!error.message.includes('Session expirée')) {
        alert(`Erreur de chargement des statistiques: ${error.message}\nVeuillez actualiser la page.`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 4 }}>
        <Typography variant="h5" gutterBottom>Chargement du tableau de bord...</Typography>
        <LinearProgress />
      </Box>
    );
  }

  if (!stats) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h5">Erreur de chargement des statistiques</Typography>
      </Box>
    );
  }

  const { overview, recent } = stats;

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* En-tête avec titre et période */}
      <Grid size={{ xs: 12 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Tableau de bord VoisiLab
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Vue d'ensemble de l'activité de votre FabLab
          </Typography>
        </Box>
      </Grid>

      {/* Statistiques principales - Design modernisé */}
      <Grid size={{ xs: 12, sm: 6, md: 6, lg: 3 }}>
        <Card 
          sx={{ 
            position: 'relative',
            overflow: 'visible',
            '&:hover': {
              boxShadow: 4,
              transform: 'translateY(-4px)',
              transition: 'all 0.3s ease-in-out'
            }
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h3" fontWeight={700} color="primary.main">
                  {overview.contacts.total}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Messages de Contact
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1.5 }}>
                  {overview.contacts.trend >= 0 ? (
                    <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
                  ) : (
                    <TrendingDownIcon sx={{ fontSize: 16, color: 'error.main', mr: 0.5 }} />
                  )}
                  <Typography 
                    variant="caption" 
                    color={overview.contacts.trend >= 0 ? 'success.main' : 'error.main'}
                    fontWeight={600}
                  >
                    {overview.contacts.trend >= 0 ? '+' : ''}{overview.contacts.trend}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                    vs semaine dernière
                  </Typography>
                </Box>
              </Box>
              <Avatar
                sx={{
                  bgcolor: alpha('#1976d2', 0.1),
                  color: 'primary.main',
                  width: 64,
                  height: 64
                }}
              >
                <EmailOutlinedIcon sx={{ fontSize: 32 }} />
              </Avatar>
            </Box>
            {overview.contacts.unread > 0 && (
              <Chip
                label={`${overview.contacts.unread} non lus`}
                size="small"
                color="warning"
                sx={{ mt: 2, fontSize: '0.75rem' }}
              />
            )}
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 6, lg: 3 }}>
        <Card 
          sx={{ 
            position: 'relative',
            overflow: 'visible',
            '&:hover': {
              boxShadow: 4,
              transform: 'translateY(-4px)',
              transition: 'all 0.3s ease-in-out'
            }
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h3" fontWeight={700} color="warning.main">
                  {overview.projects.total}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Soumissions de Projet
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1.5 }}>
                  {overview.projects.trend >= 0 ? (
                    <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
                  ) : (
                    <TrendingDownIcon sx={{ fontSize: 16, color: 'error.main', mr: 0.5 }} />
                  )}
                  <Typography 
                    variant="caption" 
                    color={overview.projects.trend >= 0 ? 'success.main' : 'error.main'}
                    fontWeight={600}
                  >
                    {overview.projects.trend >= 0 ? '+' : ''}{overview.projects.trend}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                    vs semaine dernière
                  </Typography>
                </Box>
              </Box>
              <Avatar
                sx={{
                  bgcolor: alpha('#ed6c02', 0.1),
                  color: 'warning.main',
                  width: 64,
                  height: 64
                }}
              >
                <FolderOpenOutlinedIcon sx={{ fontSize: 32 }} />
              </Avatar>
            </Box>
            {overview.projects.pending > 0 && (
              <Chip
                label={`${overview.projects.pending} en attente`}
                size="small"
                color="warning"
                sx={{ mt: 2, fontSize: '0.75rem' }}
              />
            )}
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 6, lg: 3 }}>
        <Card 
          sx={{ 
            position: 'relative',
            overflow: 'visible',
            '&:hover': {
              boxShadow: 4,
              transform: 'translateY(-4px)',
              transition: 'all 0.3s ease-in-out'
            }
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h3" fontWeight={700} color="success.main">
                  {overview.projects.approved}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Projets Approuvés
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    {overview.projects.reviewing} en cours de revue
                  </Typography>
                </Box>
              </Box>
              <Avatar
                sx={{
                  bgcolor: alpha('#2e7d32', 0.1),
                  color: 'success.main',
                  width: 64,
                  height: 64
                }}
              >
                <CheckCircleOutlineIcon sx={{ fontSize: 32 }} />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 6, lg: 3 }}>
        <Card 
          sx={{ 
            position: 'relative',
            overflow: 'visible',
            '&:hover': {
              boxShadow: 4,
              transform: 'translateY(-4px)',
              transition: 'all 0.3s ease-in-out'
            }
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h3" fontWeight={700} color="info.main">
                  {overview.team.active}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Membres de l'Équipe
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    {overview.team.total} membres au total
                  </Typography>
                </Box>
              </Box>
              <Avatar
                sx={{
                  bgcolor: alpha('#0288d1', 0.1),
                  color: 'info.main',
                  width: 64,
                  height: 64
                }}
              >
                <PeopleOutlineIcon sx={{ fontSize: 32 }} />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Activité de la semaine - Design épuré */}
      <Grid size={{ xs: 12 }}>
        <Card sx={{ bgcolor: 'background.paper' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Activité de cette semaine
            </Typography>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Box sx={{ textAlign: 'center', p: 2, borderRadius: 2, bgcolor: alpha('#1976d2', 0.05) }}>
                  <EmailOutlinedIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h3" color="primary.main" fontWeight={700}>
                    {overview.contacts.thisWeek}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Messages reçus
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Box sx={{ textAlign: 'center', p: 2, borderRadius: 2, bgcolor: alpha('#ed6c02', 0.05) }}>
                  <FolderOpenOutlinedIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                  <Typography variant="h3" color="warning.main" fontWeight={700}>
                    {overview.projects.thisWeek}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Projets soumis
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Box sx={{ textAlign: 'center', p: 2, borderRadius: 2, bgcolor: alpha('#2e7d32', 0.05) }}>
                  <EmailOutlinedIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                  <Typography variant="h3" color="success.main" fontWeight={700}>
                    {overview.contacts.today}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Messages aujourd'hui
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Box sx={{ textAlign: 'center', p: 2, borderRadius: 2, bgcolor: alpha('#0288d1', 0.05) }}>
                  <FolderOpenOutlinedIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                  <Typography variant="h3" color="info.main" fontWeight={700}>
                    {overview.projects.today}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Projets aujourd'hui
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Messages récents - Design amélioré */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Card sx={{ height: '100%' }}>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h5" fontWeight={600}>
                  Messages Récents
                </Typography>
                <Chip 
                  label={`${overview.contacts.total} total`} 
                  size="small" 
                  color="primary"
                  variant="outlined"
                />
              </Box>
            </Box>
            <List sx={{ p: 0 }}>
              {recent.contacts.length === 0 ? (
                <ListItem sx={{ py: 4 }}>
                  <Box sx={{ textAlign: 'center', width: '100%' }}>
                    <EmailOutlinedIcon sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.5, mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      Aucun message récent
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Les nouveaux messages apparaîtront ici
                    </Typography>
                  </Box>
                </ListItem>
              ) : (
                recent.contacts.slice(0, 5).map((contact, index) => (
                  <ListItem
                    key={contact.id}
                    divider={index !== recent.contacts.length - 1}
                    sx={{
                      cursor: 'pointer',
                      py: 2,
                      px: 3,
                      '&:hover': { 
                        bgcolor: 'action.hover',
                        '& .MuiAvatar-root': {
                          transform: 'scale(1.1)',
                          transition: 'transform 0.2s'
                        }
                      }
                    }}
                    onClick={() => navigate('/voisilab/contacts')}
                  >
                    <Avatar
                      sx={{
                        bgcolor: contact.status === 'unread' ? 'error.main' : 'primary.main',
                        mr: 2,
                        width: 44,
                        height: 44
                      }}
                    >
                      <PersonIcon />
                    </Avatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                          <Typography 
                            variant="subtitle1" 
                            fontWeight={contact.status === 'unread' ? 600 : 400}
                          >
                            {contact.firstname} {contact.lastname}
                          </Typography>
                          <Chip
                            label={
                              contact.status === 'unread' ? 'Non lu' : 
                              contact.status === 'read' ? 'Lu' : 
                              contact.status === 'replied' ? 'Répondu' : 'Archivé'
                            }
                            size="small"
                            color={
                              contact.status === 'unread' ? 'error' : 
                              contact.status === 'replied' ? 'success' : 'default'
                            }
                            sx={{ fontSize: '0.7rem', height: 22 }}
                          />
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography 
                            variant="body2" 
                            component="span" 
                            display="block"
                            sx={{ 
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              mb: 0.5
                            }}
                          >
                            {contact.subject}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(contact.created_at).toLocaleString('fr-FR', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))
              )}
            </List>
          </CardContent>
        </Card>
      </Grid>

      {/* Projets récents - Design amélioré */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Card sx={{ height: '100%' }}>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h5" fontWeight={600}>
                  Projets Récents
                </Typography>
                <Chip 
                  label={`${overview.projects.total} total`} 
                  size="small" 
                  color="warning"
                  variant="outlined"
                />
              </Box>
            </Box>
            <List sx={{ p: 0 }}>
              {recent.projects.length === 0 ? (
                <ListItem sx={{ py: 4 }}>
                  <Box sx={{ textAlign: 'center', width: '100%' }}>
                    <FolderOpenOutlinedIcon sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.5, mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      Aucune soumission récente
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Les nouvelles soumissions apparaîtront ici
                    </Typography>
                  </Box>
                </ListItem>
              ) : (
                recent.projects.slice(0, 5).map((project, index) => (
                  <ListItem
                    key={project.id}
                    divider={index !== recent.projects.length - 1}
                    sx={{
                      cursor: 'pointer',
                      py: 2,
                      px: 3,
                      '&:hover': { 
                        bgcolor: 'action.hover',
                        '& .MuiAvatar-root': {
                          transform: 'scale(1.1)',
                          transition: 'transform 0.2s'
                        }
                      }
                    }}
                    onClick={() => navigate('/voisilab/contacts')}
                  >
                    <Avatar
                      sx={{
                        bgcolor: 
                          project.status === 'pending' ? 'warning.main' :
                          project.status === 'reviewing' ? 'info.main' :
                          project.status === 'approved' ? 'success.main' :
                          project.status === 'rejected' ? 'error.main' : 'default',
                        mr: 2,
                        width: 44,
                        height: 44
                      }}
                    >
                      <AssignmentIcon />
                    </Avatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                          <Typography 
                            variant="subtitle1" 
                            fontWeight={project.status === 'pending' ? 600 : 400}
                          >
                            {project.name}
                          </Typography>
                          <Chip
                            label={
                              project.status === 'pending' ? 'En attente' :
                              project.status === 'reviewing' ? 'En cours' :
                              project.status === 'approved' ? 'Approuvé' :
                              project.status === 'rejected' ? 'Rejeté' : 'Archivé'
                            }
                            size="small"
                            color={
                              project.status === 'pending' ? 'warning' :
                              project.status === 'reviewing' ? 'info' :
                              project.status === 'approved' ? 'success' :
                              project.status === 'rejected' ? 'error' : 'default'
                            }
                            sx={{ fontSize: '0.7rem', height: 22 }}
                          />
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography 
                            variant="body2" 
                            component="span" 
                            display="block"
                            sx={{ mb: 0.5 }}
                          >
                            Type: {project.project_type}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(project.created_at).toLocaleString('fr-FR', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))
              )}
            </List>
          </CardContent>
        </Card>
      </Grid>

      {/* Actions rapides - Design modernisé */}
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
              Actions Rapides
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Box
                  sx={{
                    p: 3,
                    border: '2px solid',
                    borderColor: overview.contacts.unread > 0 ? 'primary.main' : 'divider',
                    borderRadius: 3,
                    cursor: 'pointer',
                    textAlign: 'center',
                    bgcolor: overview.contacts.unread > 0 ? alpha('#1976d2', 0.05) : 'background.paper',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      borderColor: 'primary.main',
                      bgcolor: alpha('#1976d2', 0.1),
                      transform: 'translateY(-8px)',
                      boxShadow: 4
                    }
                  }}
                  onClick={() => navigate('/voisilab/contacts')}
                >
                  <EmailOutlinedIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h3" color="primary.main" fontWeight={700} gutterBottom>
                    {overview.contacts.unread}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" fontWeight={500}>
                    Messages non lus
                  </Typography>
                </Box>
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Box
                  sx={{
                    p: 3,
                    border: '2px solid',
                    borderColor: overview.projects.pending > 0 ? 'warning.main' : 'divider',
                    borderRadius: 3,
                    cursor: 'pointer',
                    textAlign: 'center',
                    bgcolor: overview.projects.pending > 0 ? alpha('#ed6c02', 0.05) : 'background.paper',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      borderColor: 'warning.main',
                      bgcolor: alpha('#ed6c02', 0.1),
                      transform: 'translateY(-8px)',
                      boxShadow: 4
                    }
                  }}
                  onClick={() => navigate('/voisilab/contacts')}
                >
                  <FolderOpenOutlinedIcon sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
                  <Typography variant="h3" color="warning.main" fontWeight={700} gutterBottom>
                    {overview.projects.pending}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" fontWeight={500}>
                    Projets en attente
                  </Typography>
                </Box>
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Box
                  sx={{
                    p: 3,
                    border: '2px solid',
                    borderColor: overview.projects.reviewing > 0 ? 'info.main' : 'divider',
                    borderRadius: 3,
                    cursor: 'pointer',
                    textAlign: 'center',
                    bgcolor: overview.projects.reviewing > 0 ? alpha('#0288d1', 0.05) : 'background.paper',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      borderColor: 'info.main',
                      bgcolor: alpha('#0288d1', 0.1),
                      transform: 'translateY(-8px)',
                      boxShadow: 4
                    }
                  }}
                  onClick={() => navigate('/voisilab/contacts')}
                >
                  <AssignmentIcon sx={{ fontSize: 48, color: 'info.main', mb: 2 }} />
                  <Typography variant="h3" color="info.main" fontWeight={700} gutterBottom>
                    {overview.projects.reviewing}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" fontWeight={500}>
                    Projets en revue
                  </Typography>
                </Box>
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Box
                  sx={{
                    p: 3,
                    border: '2px solid',
                    borderColor: 'divider',
                    borderRadius: 3,
                    cursor: 'pointer',
                    textAlign: 'center',
                    bgcolor: 'background.paper',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      borderColor: 'success.main',
                      bgcolor: alpha('#2e7d32', 0.1),
                      transform: 'translateY(-8px)',
                      boxShadow: 4
                    }
                  }}
                  onClick={() => navigate('/voisilab/team')}
                >
                  <PeopleOutlineIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
                  <Typography variant="h3" color="success.main" fontWeight={700} gutterBottom>
                    {overview.team.active}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" fontWeight={500}>
                    Membres actifs
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Bannière d'information */}
      <Grid size={{ xs: 12 }}>
        <Card 
          sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                <CheckCircleOutlineIcon sx={{ fontSize: 32, color: 'white' }} />
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight={600} gutterBottom sx={{ color: 'white' }}>
                  Bienvenue sur le tableau de bord VoisiLab
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                  Gérez efficacement votre FabLab : messages de contact, soumissions de projet, équipe et plus encore.
                  Utilisez le menu latéral pour accéder aux différentes sections.
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
