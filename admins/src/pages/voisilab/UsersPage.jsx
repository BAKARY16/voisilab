import { useState, useEffect } from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, IconButton, Chip, Paper, Grid, TextField, FormControl, InputLabel,
  Select, MenuItem, Switch, FormControlLabel, Typography, Avatar, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions, Stack, Divider,
  Tabs, Tab, Tooltip, InputAdornment, List, ListItem,
  ListItemIcon, ListItemText
} from '@mui/material';
import {
  EditOutlined, DeleteOutlined, PlusOutlined, UserOutlined,
  StarOutlined, SafetyCertificateOutlined, LockOutlined,
  EyeOutlined, EyeInvisibleOutlined, MailOutlined, PhoneOutlined,
  BankOutlined, CheckCircleOutlined, CloseCircleOutlined, InfoCircleOutlined,
  TeamOutlined, KeyOutlined, FileTextOutlined, IdcardOutlined
} from '@ant-design/icons';
import MainCard from 'components/MainCard';
import { usersService, authService } from 'api/voisilab';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3500';

// ─── Définition des rôles et leurs privilèges ────────────────────────────────

const ROLES = [
  {
    value: 'superadmin',
    label: 'Super Administrateur',
    color: 'default',
    icon: <StarOutlined />,
    description: 'Accès total à toutes les fonctionnalités, y compris la gestion des administrateurs.',
    privileges: [
      { label: 'Tableau de bord complet', granted: true },
      { label: 'Gestion des utilisateurs & admins', granted: true },
      { label: 'Création de comptes administrateurs', granted: true },
      { label: 'Blog / Actualités (CRUD)', granted: true },
      { label: 'Innovations (CRUD)', granted: true },
      { label: 'Services (CRUD)', granted: true },
      { label: 'Ateliers (CRUD)', granted: true },
      { label: 'Équipements (CRUD)', granted: true },
      { label: 'Équipe (CRUD)', granted: true },
      { label: 'Contacts & messages', granted: true },
      { label: 'Soumissions de projets', granted: true },
      { label: 'PPN (points de présence)', granted: true },
      { label: 'Notifications', granted: true },
      { label: 'Paramètres système', granted: true },
      { label: 'Gestion des médias', granted: true },
    ]
  },
  {
    value: 'admin',
    label: 'Administrateur',
    color: 'default',
    icon: <SafetyCertificateOutlined />,
    description: 'Gestion complète du contenu et des opérations, sans accès à la gestion des utilisateurs.',
    privileges: [
      { label: 'Tableau de bord complet', granted: true },
      { label: 'Gestion des utilisateurs & admins', granted: false },
      { label: 'Création de comptes administrateurs', granted: false },
      { label: 'Blog / Actualités (CRUD)', granted: true },
      { label: 'Innovations (CRUD)', granted: true },
      { label: 'Services (CRUD)', granted: true },
      { label: 'Ateliers (CRUD)', granted: true },
      { label: 'Équipements (CRUD)', granted: true },
      { label: 'Équipe (CRUD)', granted: true },
      { label: 'Contacts & messages', granted: true },
      { label: 'Soumissions de projets', granted: true },
      { label: 'PPN (points de présence)', granted: true },
      { label: 'Notifications', granted: true },
      { label: 'Paramètres système', granted: false },
      { label: 'Gestion des médias', granted: true },
    ]
  },
  {
    value: 'editor',
    label: 'Éditeur',
    color: 'default',
    icon: <FileTextOutlined />,
    description: 'Peut créer et modifier le contenu mais ne peut pas supprimer ni gérer les utilisateurs.',
    privileges: [
      { label: 'Tableau de bord (lecture)', granted: true },
      { label: 'Gestion des utilisateurs & admins', granted: false },
      { label: 'Création de comptes administrateurs', granted: false },
      { label: 'Blog / Actualités (créer & modifier)', granted: true },
      { label: 'Blog / Actualités (supprimer)', granted: false },
      { label: 'Innovations (créer & modifier)', granted: true },
      { label: 'Services (créer & modifier)', granted: true },
      { label: 'Ateliers (créer & modifier)', granted: true },
      { label: 'Équipements (lecture seule)', granted: true },
      { label: 'Équipe (lecture seule)', granted: true },
      { label: 'Contacts & messages (lecture)', granted: true },
      { label: 'Soumissions de projets (lecture)', granted: true },
      { label: 'Notifications', granted: true },
      { label: 'Paramètres système', granted: false },
      { label: 'Gestion des médias', granted: true },
    ]
  },
  {
    value: 'viewer',
    label: 'Observateur',
    color: 'default',
    icon: <EyeOutlined />,
    description: 'Accès en lecture seule à tout le back-office. Aucune modification possible.',
    privileges: [
      { label: 'Tableau de bord (lecture)', granted: true },
      { label: 'Gestion des utilisateurs', granted: false },
      { label: 'Blog / Actualités (lecture)', granted: true },
      { label: 'Blog / Actualités (modifier / supprimer)', granted: false },
      { label: 'Innovations (lecture)', granted: true },
      { label: 'Services (lecture)', granted: true },
      { label: 'Ateliers (lecture)', granted: true },
      { label: 'Équipements (lecture)', granted: true },
      { label: 'Contacts & messages (lecture)', granted: true },
      { label: 'Soumissions de projets (lecture)', granted: true },
      { label: 'Notifications (lecture)', granted: true },
      { label: 'Paramètres système', granted: false },
      { label: 'Gestion des médias', granted: false },
    ]
  }
];

const getRoleInfo = (value) => ROLES.find(r => r.value === value) || ROLES[1];

const defaultFormData = {
  full_name: '',
  email: '',
  password: '',
  role: 'admin',
  phone: '',
  organization: '',
  bio: '',
  active: true
};

// ─── Panneau de privilèges ────────────────────────────────────────────────────

function PrivilegesPanel({ role }) {
  const info = getRoleInfo(role);
  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 1.5, borderColor: 'divider' }}>
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
        <Avatar sx={{ bgcolor: 'grey.100', color: 'text.primary', width: 32, height: 32, fontSize: 14 }}>
          {info.icon}
        </Avatar>
        <Box>
          <Typography variant="subtitle2" fontWeight={600}>{info.label}</Typography>
          <Typography variant="caption" color="text.secondary">{info.description}</Typography>
        </Box>
      </Stack>
      <Divider sx={{ my: 1.5 }} />
      <List dense disablePadding>
        {info.privileges.map((p, i) => (
          <ListItem key={i} disableGutters sx={{ py: 0.25 }}>
            <ListItemIcon sx={{ minWidth: 26 }}>
              {p.granted
                ? <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 13 }} />
                : <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: 13 }} />}
            </ListItemIcon>
            <ListItemText
              primary={p.label}
              primaryTypographyProps={{
                variant: 'caption',
                color: p.granted ? 'text.primary' : 'text.disabled'
              }}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState(defaultFormData);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [filterRole, setFilterRole] = useState('all');
  const [stats, setStats] = useState(null);
  const [resetDialog, setResetDialog] = useState({ open: false, userId: null, userName: '' });
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    loadCurrentUser();
    loadUsers();
    loadStats();
  }, []);

  const loadCurrentUser = async () => {
    // D'abord on lit depuis le sessionStorage (synchrone, toujours disponible)
    const stored = authService.getCurrentUser();
    if (stored) {
      setCurrentUser(stored);
      return;
    }
    // Fallback : appel réseau si le sessionStorage est vide
    try {
      const res = await authService.getProfile();
      setCurrentUser(res?.data || res);
    } catch (e) { console.error(e); }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const result = await usersService.getAll({ limit: 100 });
      setUsers(result.data || []);
    } catch (e) {
      console.error('Erreur chargement utilisateurs:', e);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const r = await fetch(`${API_URL}/api/users/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const d = await r.json();
      setStats(d.data);
    } catch (e) { /* silencieux */ }
  };

  const isSuperAdmin = () => currentUser?.role === 'superadmin';
  const filteredUsers = filterRole === 'all' ? users : users.filter(u => u.role === filterRole);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData(defaultFormData);
    setError('');
    setTabValue(0);
    setShowPassword(false);
    setOpen(true);
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setFormData({
      full_name: user.full_name || '',
      email: user.email || '',
      password: '',
      role: user.role || 'admin',
      phone: user.phone || '',
      organization: user.organization || '',
      bio: user.bio || '',
      active: user.active !== false
    });
    setError('');
    setTabValue(0);
    setShowPassword(false);
    setOpen(true);
  };

  const handleSave = async () => {
    setError('');
    if (!formData.full_name.trim()) return setError('Le nom complet est requis');
    if (!formData.email.trim()) return setError("L'email est requis");
    if (!editingId && !formData.password) return setError('Le mot de passe est requis');
    if (!editingId && formData.password.length < 6) return setError('Le mot de passe doit contenir au moins 6 caractères');

    setSaving(true);
    try {
      const dataToSend = {
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        role: formData.role,
        phone: formData.phone?.trim() || null,
        organization: formData.organization?.trim() || null,
        bio: formData.bio?.trim() || null,
        active: formData.active
      };
      if (!editingId) dataToSend.password = formData.password;

      if (editingId) {
        await usersService.update(editingId, dataToSend);
      } else {
        await usersService.create(dataToSend);
      }

      setOpen(false);
      loadUsers();
      loadStats();
    } catch (e) {
      setError(e.message || "Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (user) => {
    if (user.id === currentUser?.id) return;
    if (!window.confirm(`Supprimer "${user.full_name || user.email}" ?`)) return;
    try {
      await usersService.delete(user.id);
      loadUsers();
      loadStats();
    } catch (e) {
      alert(e.message || 'Erreur lors de la suppression');
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      const token = sessionStorage.getItem('token');
      await fetch(`${API_URL}/api/users/${userId}/toggle-status`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      loadUsers();
    } catch (e) { console.error(e); }
  };

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) return;
    try {
      const token = sessionStorage.getItem('token');
      const r = await fetch(`${API_URL}/api/users/${resetDialog.userId}/reset-password`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ new_password: newPassword })
      });
      if (!r.ok) throw new Error((await r.json()).message);
      setResetDialog({ open: false, userId: null, userName: '' });
      setNewPassword('');
    } catch (e) {
      alert(e.message || 'Erreur réinitialisation');
    }
  };

  const RoleBadge = ({ role }) => {
    const info = getRoleInfo(role);
    return <Chip label={info.label} variant="outlined" size="small" sx={{ fontWeight: 500, fontSize: '0.72rem' }} />;
  };

  return (
    <MainCard title={
      <Stack direction="row" alignItems="center" spacing={1}>
        <TeamOutlined style={{ fontSize: 22 }} />
        <Typography variant="h4">Gestion des utilisateurs</Typography>
      </Stack>
    }>

      {/* Alerte lecture seule */}
      {!isSuperAdmin() && (
        <Alert severity="info" sx={{ mb: 2 }} icon={<InfoCircleOutlined />}>
          Consultation uniquement. Seuls les <strong>Super Administrateurs</strong> peuvent créer et modifier des comptes.
        </Alert>
      )}

      {/* Statistiques */}
      {stats && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {[
            { label: 'Total utilisateurs', value: stats.total },
            { label: 'Admins', value: Number(stats.admins || 0) },
            { label: 'Comptes actifs', value: stats.active_users },
            { label: 'Nouveaux ce mois', value: stats.new_last_month }
          ].map(s => (
            <Grid item xs={6} sm={3} key={s.label}>
              <Paper variant="outlined" sx={{ p: 1.5, textAlign: 'center', borderRadius: 1.5 }}>
                <Typography variant="h4" fontWeight={700} color="text.primary">{s.value ?? 0}</Typography>
                <Typography variant="caption" color="text.secondary">{s.label}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Barre filtres + bouton créer */}
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} spacing={1} sx={{ mb: 2 }}>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {['all', 'superadmin', 'admin', 'editor', 'viewer'].map(role => (
            <Chip
              key={role}
              label={role === 'all' ? `Tous (${users.length})` : `${getRoleInfo(role).label} (${users.filter(u => u.role === role).length})`}
              variant={filterRole === role ? 'filled' : 'outlined'}
              color={filterRole === role ? 'primary' : 'default'}
              size="small"
              onClick={() => setFilterRole(role)}
              sx={{ cursor: 'pointer' }}
            />
          ))}
        </Stack>
        {isSuperAdmin() && (
          <Button variant="contained" startIcon={<PlusOutlined />} onClick={handleOpenCreate} size="small">
            Nouvel utilisateur
          </Button>
        )}
      </Stack>

      {/* Tableau */}
      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell sx={{ fontWeight: 600 }}>Utilisateur</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 600, display: { xs: 'none', md: 'table-cell' } }}>Organisation</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Rôle</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>Statut</TableCell>
              <TableCell sx={{ fontWeight: 600, display: { xs: 'none', sm: 'table-cell' } }}>Créé le</TableCell>
              {isSuperAdmin() && <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>Chargement...</TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">Aucun utilisateur trouvé</Typography>
                </TableCell>
              </TableRow>
            ) : filteredUsers.map(user => (
              <TableRow key={user.id} hover>
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Avatar
                      src={user.avatar_url
                        ? (user.avatar_url.startsWith('http') ? user.avatar_url : `${API_URL}${user.avatar_url}`)
                        : undefined}
                      sx={{ width: 34, height: 34, bgcolor: 'primary.lighter', color: 'primary.main', fontSize: 14 }}
                    >
                      {(user.full_name || user.email)?.[0]?.toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight={600} lineHeight={1.2}>
                        {user.full_name || '—'}
                        {user.id === currentUser?.id && (
                          <Chip label="Vous" size="small" sx={{ ml: 0.5, height: 16, fontSize: 10 }} />
                        )}
                      </Typography>
                      {user.phone && (
                        <Typography variant="caption" color="text.secondary">{user.phone}</Typography>
                      )}
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{user.email}</Typography>
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                  <Typography variant="body2" color="text.secondary">{user.organization || '—'}</Typography>
                </TableCell>
                <TableCell>
                  <RoleBadge role={user.role} />
                </TableCell>
                <TableCell align="center">
                  {isSuperAdmin() && user.id !== currentUser?.id ? (
                    <Tooltip title={user.active ? 'Cliquer pour désactiver' : 'Cliquer pour activer'}>
                      <Chip
                        label={user.active ? 'Actif' : 'Inactif'}
                        variant={user.active ? 'filled' : 'outlined'}
                        color={user.active ? 'success' : 'default'}
                        size="small"
                        onClick={() => handleToggleStatus(user.id)}
                        sx={{ cursor: 'pointer', fontSize: '0.72rem' }}
                      />
                    </Tooltip>
                  ) : (
                    <Chip
                      label={user.active ? 'Actif' : 'Inactif'}
                      variant={user.active ? 'filled' : 'outlined'}
                      color={user.active ? 'success' : 'default'}
                      size="small"
                      sx={{ fontSize: '0.72rem' }}
                    />
                  )}
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                  <Typography variant="caption" color="text.secondary">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR') : '—'}
                  </Typography>
                </TableCell>
                {isSuperAdmin() && (
                  <TableCell align="right">
                    <Stack direction="row" justifyContent="flex-end" spacing={0.5}>
                      <Tooltip title="Modifier">
                        <IconButton size="small" color="primary" onClick={() => handleEdit(user)}>
                          <EditOutlined />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Réinitialiser le mot de passe">
                        <IconButton
                          size="small"
                          color="warning"
                          onClick={() => {
                            setResetDialog({ open: true, userId: user.id, userName: user.full_name || user.email });
                            setNewPassword('');
                            setShowNewPassword(false);
                          }}
                        >
                          <KeyOutlined />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={user.role === 'superadmin' && user.id !== currentUser?.id ? 'Impossible de supprimer un superadmin' : 'Supprimer'}>
                        <span>
                          <IconButton
                            size="small"
                            color="error"
                            disabled={user.role === 'superadmin' && user.id !== currentUser?.id}
                            onClick={() => handleDelete(user)}
                          >
                            <DeleteOutlined />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ── Dialog Création / Édition ─────────────────────────────────────────────── */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
        <DialogTitle sx={{ borderBottom: '1px solid', borderColor: 'divider', pb: 1.5 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            {editingId ? <EditOutlined /> : <PlusOutlined />}
            <Typography variant="h6">
              {editingId ? "Modifier l'utilisateur" : 'Créer un utilisateur'}
            </Typography>
          </Stack>
        </DialogTitle>

        <DialogContent sx={{ pt: 2, pb: 1 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>
          )}

          <Tabs
            value={tabValue}
            onChange={(_, v) => setTabValue(v)}
            sx={{ mb: 2.5, borderBottom: '1px solid', borderColor: 'divider' }}
          >
            <Tab icon={<IdcardOutlined />} label="Informations" iconPosition="start" sx={{ minHeight: 40, py: 0.5, fontSize: '0.8rem' }} />
            <Tab icon={<KeyOutlined />} label="Rôle & Privilèges" iconPosition="start" sx={{ minHeight: 40, py: 0.5, fontSize: '0.8rem' }} />
          </Tabs>

          {/* ── Onglet Informations ── */}
          {tabValue === 0 && (
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth required size="small"
                  label="Nom complet"
                  value={formData.full_name}
                  onChange={e => setFormData(p => ({ ...p, full_name: e.target.value }))}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><UserOutlined style={{ color: '#bbb' }} /></InputAdornment>
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth required size="small" type="email"
                  label="Adresse email"
                  value={formData.email}
                  onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><MailOutlined style={{ color: '#bbb' }} /></InputAdornment>
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth size="small"
                  label="Téléphone"
                  placeholder="+225 07 00 00 00 00"
                  value={formData.phone}
                  onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><PhoneOutlined style={{ color: '#bbb' }} /></InputAdornment>
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth size="small"
                  label="Organisation / Structure"
                  placeholder="Ex: FabLab UVCI"
                  value={formData.organization}
                  onChange={e => setFormData(p => ({ ...p, organization: e.target.value }))}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><BankOutlined style={{ color: '#bbb' }} /></InputAdornment>
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth size="small"
                  label={editingId ? 'Nouveau mot de passe (laisser vide pour ne pas changer)' : 'Mot de passe *'}
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={e => setFormData(p => ({ ...p, password: e.target.value }))}
                  helperText="Minimum 6 caractères"
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><LockOutlined style={{ color: '#bbb' }} /></InputAdornment>,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setShowPassword(p => !p)} edge="end">
                          {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth size="small" multiline rows={3}
                  label="Biographie / Notes"
                  placeholder="Description courte de l'utilisateur..."
                  value={formData.bio}
                  onChange={e => setFormData(p => ({ ...p, bio: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.active}
                      onChange={e => setFormData(p => ({ ...p, active: e.target.checked }))}
                      color="success"
                    />
                  }
                  label={
                    <Typography variant="body2">
                      Compte&nbsp;
                      {formData.active
                        ? <strong style={{ color: '#52c41a' }}>actif</strong>
                        : <strong style={{ color: '#999' }}>inactif</strong>}
                    </Typography>
                  }
                />
              </Grid>
            </Grid>
          )}

          {/* ── Onglet Rôle & Privilèges ── */}
          {tabValue === 1 && (
            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
                  Sélectionner le rôle
                </Typography>
                <Grid container spacing={1.5}>
                  {ROLES.map(r => (
                    <Grid item xs={12} sm={6} key={r.value}>
                      <Paper
                        variant="outlined"
                        onClick={() => setFormData(p => ({ ...p, role: r.value }))}
                        sx={{
                          p: 1.5,
                          cursor: 'pointer',
                          borderRadius: 1.5,
                          borderColor: formData.role === r.value ? 'primary.main' : 'divider',
                          borderWidth: formData.role === r.value ? 2 : 1,
                          bgcolor: formData.role === r.value ? 'primary.lighter' : 'background.paper',
                          transition: 'border-color 0.15s',
                          '&:hover': { borderColor: 'grey.400' }
                        }}
                      >
                        <Stack direction="row" alignItems="flex-start" spacing={1}>
                          <Avatar sx={{ bgcolor: 'grey.100', color: 'text.secondary', width: 28, height: 28, fontSize: 13, flexShrink: 0, mt: 0.25 }}>
                            {r.icon}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={600}>{r.label}</Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.3 }}>
                              {r.description}
                            </Typography>
                          </Box>
                        </Stack>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                  Accès détaillés du rôle sélectionné
                </Typography>
                <PrivilegesPanel role={formData.role} />
              </Grid>
            </Grid>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button onClick={() => setOpen(false)} color="inherit">Annuler</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving || !formData.full_name.trim() || !formData.email.trim()}
          >
            {saving ? 'Enregistrement...' : editingId ? 'Mettre à jour' : 'Créer le compte'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Dialog Réinitialisation mot de passe ──────────────────────────────────── */}
      <Dialog
        open={resetDialog.open}
        onClose={() => setResetDialog({ open: false, userId: null, userName: '' })}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid', borderColor: 'divider', pb: 1.5 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <KeyOutlined style={{ color: '#faad14', fontSize: 18 }} />
            <Typography variant="h6">Réinitialiser le mot de passe</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ pt: 2.5 }}>
          <Alert severity="warning" sx={{ mb: 2.5 }}>
            Vous allez changer le mot de passe de&nbsp;<strong>{resetDialog.userName}</strong>.
          </Alert>
          <TextField
            fullWidth size="small"
            label="Nouveau mot de passe"
            type={showNewPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            helperText="Minimum 6 caractères"
            InputProps={{
              startAdornment: <InputAdornment position="start"><LockOutlined style={{ color: '#bbb' }} /></InputAdornment>,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setShowNewPassword(p => !p)} edge="end">
                    {showNewPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setResetDialog({ open: false, userId: null, userName: '' })} color="inherit">
            Annuler
          </Button>
          <Button
            variant="contained"
            color="warning"
            onClick={handleResetPassword}
            disabled={!newPassword || newPassword.length < 6}
          >
            Réinitialiser
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
}

