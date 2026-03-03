import { useState, useEffect, useRef } from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, TextField, IconButton, Chip, Paper, Select, MenuItem,
  FormControl, InputLabel, Typography, Switch, CircularProgress,
  Stack, Grid, Avatar, LinearProgress, Tabs, Tab, Backdrop, CardMedia,
  InputAdornment, Tooltip, Menu, Snackbar, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions, Divider
} from '@mui/material';
import {
  EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined,
  CloseOutlined, SaveOutlined, ReloadOutlined, UploadOutlined,
  CalendarOutlined, EnvironmentOutlined, UserOutlined,
  TeamOutlined, DollarOutlined, ToolOutlined,
  ReadOutlined, AppstoreOutlined, MoreOutlined, LinkOutlined,
  EyeOutlined, PhoneOutlined, MailOutlined, WarningOutlined, CheckCircleOutlined
} from '@ant-design/icons';
import MainCard from 'components/MainCard';
import RichTextField from 'components/RichTextField';
import { workshopsService, API_URL } from 'api/voisilab';

// ─── Constantes ───────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  upcoming:  { label: 'À venir',  color: 'primary' },
  ongoing:   { label: 'En cours', color: 'warning'  },
  completed: { label: 'Terminé',  color: 'success'  },
  cancelled: { label: 'Annulé',   color: 'error'    }
};

const TYPE_OPTIONS = [
  { value: 'atelier',   label: 'Atelier',    icon: <ToolOutlined />,      color: '#3b82f6', bg: '#eff6ff' },
  { value: 'evenement', label: 'Événement',  icon: <CalendarOutlined />,  color: '#8b5cf6', bg: '#f5f3ff' },
  { value: 'formation', label: 'Formation',  icon: <ReadOutlined />,      color: '#10b981', bg: '#ecfdf5' },
  { value: 'ceremonie', label: 'Cérémonie',  icon: <AppstoreOutlined />,  color: '#f59e0b', bg: '#fffbeb' },
  { value: 'autre',     label: 'Autre',      icon: <AppstoreOutlined />,  color: '#64748b', bg: '#f8fafc' }
];

const LEVEL_OPTIONS = [
  { value: 'debutant',      label: 'Débutant'      },
  { value: 'intermediaire', label: 'Intermédiaire'  },
  { value: 'avance',        label: 'Avancé'         }
];

const defaultFormData = {
  title:       '',
  description: '',
  date:        '',
  location:    '',
  capacity:    20,
  price:       0,
  instructor:  '',
  category:    '',
  type:        'atelier',
  status:      'upcoming',
  active:      false,
  image:       '',
  cta_label:   '',
  cta_url:     ''
};

// ─── Utilitaires ──────────────────────────────────────────────────────────────

const formatDateForInput = (dateStr) => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 16);
  } catch { return ''; }
};

const formatDateDisplay = (dateStr) => {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch { return '—'; }
};

const getTypeInfo = (type) => TYPE_OPTIONS.find(t => t.value === type) || TYPE_OPTIONS[3];

// ─── Page principale ──────────────────────────────────────────────────────────

export default function WorkshopsPage() {
  const [workshops, setWorkshops]     = useState([]);
  const [loading, setLoading]         = useState(true);
  const [saving, setSaving]           = useState(false);
  const [uploadingImage, setUploading]= useState(false);
  const [activeTab, setActiveTab]     = useState(0);
  const [formData, setFormData]       = useState(defaultFormData);
  const [editingId, setEditingId]     = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType]   = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [alert, setAlert]             = useState({ open: false, title: '', message: '', severity: 'info' });
  const [menuAnchor, setMenuAnchor]   = useState(null);
  const [menuWorkshop, setMenuWorkshop] = useState(null);
  // ── Onglet Inscriptions ──
  const [registrations, setRegistrations]           = useState([]);
  const [loadingReg, setLoadingReg]                 = useState(false);
  const [selectedWorkshopId, setSelectedWorkshopId] = useState(null);
  const [regSearchQuery, setRegSearchQuery]         = useState('');
  const [regStatusFilter, setRegStatusFilter]       = useState('all');
  // ── Dialogs ──
  const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', message: '', onConfirm: null, danger: true });
  const [detailReg, setDetailReg]         = useState(null); // inscrit sélectionné pour détail
  const imageFileRef = useRef(null);

  // Ouvre une dialog de confirmation et retourne une Promise
  const askConfirm = (title, message, danger = true) => new Promise(resolve => {
    setConfirmDialog({
      open: true, title, message, danger,
      onConfirm: () => { setConfirmDialog(d => ({ ...d, open: false })); resolve(true); },
      onCancel:  () => { setConfirmDialog(d => ({ ...d, open: false })); resolve(false); }
    });
  });
  const closeConfirm = () => setConfirmDialog(d => ({ ...d, open: false, onCancel: null, onConfirm: null }));

  useEffect(() => { loadWorkshops(); }, []);

  // Recharger les inscriptions quand on arrive sur l'onglet 2
  useEffect(() => {
    if (activeTab === 2) loadAllRegistrations();
  }, [activeTab]);

  const loadWorkshops = async () => {
    try {
      setLoading(true);
      const result = await workshopsService.getAll();
      setWorkshops(result.data || []);
    } catch (err) { console.error('Erreur:', err); }
    finally { setLoading(false); }
  };

  const loadAllRegistrations = async () => {
    try {
      setLoadingReg(true);
      const result = await workshopsService.getAllRegistrations();
      setRegistrations(result.data || []);
    } catch (err) { console.error('Erreur inscriptions:', err); }
    finally { setLoadingReg(false); }
  };

  const handleRegistrationStatus = async (regId, status) => {
    try {
      await workshopsService.updateRegistrationStatus(regId, status);
      setRegistrations(prev => prev.map(r => r.id === regId ? { ...r, status } : r));
      showAlert('Statut mis à jour', '', true);
    } catch (err) { showAlert('Erreur', err.message); }
  };

  const handleDeleteRegistration = async (reg) => {
    const ok = await askConfirm(
      `Supprimer l'inscription`,
      `Vous êtes sur le point de supprimer l'inscription de "${reg.name}" à l'atelier "${reg.workshop_title || reg.workshop_id}". Cette action est irréversible.`
    );
    if (!ok) return;
    try {
      await workshopsService.deleteRegistration(reg.id);
      setRegistrations(prev => prev.filter(r => r.id !== reg.id));
      // Mettre à jour le compteur local dans workshops
      setWorkshops(prev => prev.map(w =>
        w.id === reg.workshop_id ? { ...w, registered: Math.max((w.registered || 0) - 1, 0) } : w
      ));
      showAlert('Inscription supprimée', '', true);
    } catch (err) { showAlert('Erreur', err.message); }
  };

  // ── Helpers ──────────────────────────────────────────────────────────────

  const showAlert = (title, message, ok = false) =>
    setAlert({ open: true, title, message, severity: ok ? 'success' : 'error' });

  const update = (field) => (e) =>
    setFormData(prev => ({ ...prev, [field]: e.target.value }));

  const resetForm = () => {
    setFormData(defaultFormData);
    setEditingId(null);
  };

  const handleNewWorkshop = () => { resetForm(); setActiveTab(1); };

  const handleEdit = (workshop) => {
    setEditingId(workshop.id);
    setFormData({
      title:       workshop.title       || '',
      description: workshop.description || '',
      date:        formatDateForInput(workshop.date),
      location:    workshop.location    || '',
      capacity:    workshop.capacity    || 20,
      price:       workshop.price       || 0,
      instructor:  workshop.instructor  || '',
      category:    workshop.category    || '',
      type:        workshop.type        || 'atelier',
      status:      workshop.status      || 'upcoming',
      active:      Boolean(workshop.active),
      image:       workshop.image       || '',
      cta_label:   workshop.cta_label   || '',
      cta_url:     workshop.cta_url     || ''
    });
    setActiveTab(1);
  };

  // ── Upload image ──────────────────────────────────────────────────────────

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showAlert('Erreur', 'Veuillez sélectionner une image (JPG, PNG, WebP...)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showAlert('Erreur', "L'image ne doit pas dépasser 5 MB");
      return;
    }
    try {
      setUploading(true);
      const fd = new FormData();
      fd.append('file', file);
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/upload/workshops`, {
        method: 'POST',
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: fd
      });
      if (!response.ok) throw new Error("Erreur lors de l'upload");
      const data = await response.json();
      const imageUrl = data.url?.startsWith('http') ? data.url : `${API_URL}${data.url}`;
      setFormData(prev => ({ ...prev, image: imageUrl }));
    } catch (err) {
      showAlert('Erreur', "Impossible de télécharger l'image : " + (err.message || 'Erreur inconnue'));
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  // ── Sauvegarde ────────────────────────────────────────────────────────────

  const handleSave = async () => {
    if (!formData.title.trim()) {
      showAlert('Erreur', 'Le titre est requis');
      return;
    }
    try {
      setSaving(true);

      // Envoi direct de cta_label et cta_url (colonnes dédiées en base)
      const { cta_label, cta_url, date: rawDate, ...rest } = formData;
      const formattedDate = rawDate ? new Date(rawDate).toISOString() : null;

      const dataToSend = {
        ...rest,
        cta_label: cta_label.trim() || null,
        cta_url:   cta_url.trim()   || null,
        // Pour un UPDATE, ne pas envoyer date:null (viole NOT NULL en base).
        // Pour un CREATE, null est accepté (le serveur utilise la date courante).
        ...(formattedDate
          ? { date: formattedDate }
          : (!editingId ? { date: null } : {})
        ),
        capacity: Number(formData.capacity) || 20,
        price:    Number(formData.price)    || 0
      };

      if (editingId) {
        await workshopsService.update(editingId, dataToSend);
        showAlert('Succès', 'Atelier modifié avec succès !', true);
      } else {
        await workshopsService.create(dataToSend);
        showAlert('Succès', 'Atelier créé avec succès !', true);
      }
      resetForm();
      setActiveTab(0);
      loadWorkshops();
    } catch (err) {
      showAlert('Erreur', "Erreur lors de l'enregistrement : " + (err.message || 'Erreur inconnue'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (w) => {
    const ok = await askConfirm(
      `Supprimer l'activité`,
      `Vous êtes sur le point de supprimer définitivement "${w.title}". Toutes les inscriptions associées seront également supprimées.`
    );
    if (!ok) return;
    try { await workshopsService.delete(w.id); loadWorkshops(); }
    catch (err) { console.error('Erreur:', err); }
  };

  const handleTogglePublish = async (w) => {
    try {
      await workshopsService.update(w.id, { active: !w.active });
      loadWorkshops();
    } catch (err) { console.error('Erreur:', err); }
  };

  // ── Filtres ───────────────────────────────────────────────────────────────

  const filtered = workshops.filter(w => {
    const matchSearch = !searchQuery ||
      w.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.instructor?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType   = filterType   === 'all' || w.type   === filterType;
    const matchStatus = filterStatus === 'all' || w.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  // ── Stats ─────────────────────────────────────────────────────────────────

  const stats = {
    total:     workshops.length,
    published: workshops.filter(w => w.active).length,
    upcoming:  workshops.filter(w => w.status === 'upcoming').length,
    ongoing:   workshops.filter(w => w.status === 'ongoing').length
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Rendu
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Snackbar pour les alertes succès / erreur */}
      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={() => setAlert(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setAlert(prev => ({ ...prev, open: false }))}
          severity={alert.severity}
          variant="filled"
          sx={{ minWidth: 280 }}
        >
          <strong>{alert.title}</strong>{alert.message && alert.title ? ' — ' : ''}{alert.message}
        </Alert>
      </Snackbar>

      {/* Backdrop saving */}
      <Backdrop open={saving || uploadingImage} sx={{ color: '#fff', zIndex: (t) => t.zIndex.drawer + 1 }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress color="inherit" size={52} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            {uploadingImage ? 'Téléchargement...' : 'Enregistrement...'}
          </Typography>
        </Box>
      </Backdrop>

      <MainCard title="Ateliers & Événements">

        {/* ── Tabs ── */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
            <Tab label={`Liste (${workshops.length})`} />
            <Tab
              label={editingId ? "Modifier l'activité" : 'Nouvelle activité'}
              icon={editingId ? <EditOutlined /> : <PlusOutlined />}
              iconPosition="start"
            />
            <Tab
              label={`Inscriptions (${registrations.length})`}
              icon={<TeamOutlined />}
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {/* ═══════════════════════════════════════════════════════════════
            TAB 0 — LISTE
        ═══════════════════════════════════════════════════════════════ */}
        {activeTab === 0 && (
          <>
            {/* Stats */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {[
                { label: 'Total',    value: stats.total,     color: 'text.primary' },
                { label: 'Publiés',  value: stats.published, color: 'success.main' },
                { label: 'À venir',  value: stats.upcoming,  color: 'primary.main' },
                { label: 'En cours', value: stats.ongoing,   color: 'warning.main' }
              ].map(s => (
                <Grid item xs={6} sm={3} key={s.label}>
                  <Paper variant="outlined" sx={{ px: 2, py: 1.5, textAlign: 'center' }}>
                    <Typography variant="h4" color={s.color}>{s.value}</Typography>
                    <Typography variant="caption" color="text.secondary">{s.label}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            {/* Filtres */}
            <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth size="small" placeholder="Rechercher..."
                  value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{ startAdornment: <InputAdornment position="start"><SearchOutlined /></InputAdornment> }}
                />
              </Grid>
              <Grid item xs={6} md={2.5}>
                <FormControl fullWidth size="small">
                  <InputLabel>Type</InputLabel>
                  <Select value={filterType} onChange={(e) => setFilterType(e.target.value)} label="Type">
                    <MenuItem value="all">Tous les types</MenuItem>
                    {TYPE_OPTIONS.map(t => <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} md={2.5}>
                <FormControl fullWidth size="small">
                  <InputLabel>Statut</InputLabel>
                  <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} label="Statut">
                    <MenuItem value="all">Tous les statuts</MenuItem>
                    {Object.entries(STATUS_CONFIG).map(([v, c]) => (
                      <MenuItem key={v} value={v}>{c.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md="auto" sx={{ ml: { md: 'auto' } }}>
                <Stack direction="row" spacing={1}>
                  <Button size="small" variant="outlined" startIcon={<ReloadOutlined />} onClick={loadWorkshops} disabled={loading}>
                    Actualiser
                  </Button>
                  <Button variant="contained" size="small" startIcon={<PlusOutlined />} onClick={handleNewWorkshop} disableElevation>
                    Nouvelle activité
                  </Button>
                </Stack>
              </Grid>
            </Grid>

            {/* Table */}
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Image</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Titre</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Formateur</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Places</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Statut</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} sx={{ p: 0 }}>
                        <LinearProgress />
                      </TableCell>
                    </TableRow>
                  ) : filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                        <Typography variant="body2" color="text.secondary">
                          {workshops.length === 0 ? 'Aucune activité' : 'Aucun résultat'}
                        </Typography>
                        {workshops.length === 0 && (
                          <Button size="small" startIcon={<PlusOutlined />} onClick={handleNewWorkshop} sx={{ mt: 1 }}>
                            Créer la première
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ) : filtered.map((w) => {
                    const sCfg = STATUS_CONFIG[w.status] || { label: w.status, color: 'default' };
                    const tInfo = getTypeInfo(w.type);

                    return (
                      <TableRow key={w.id} hover>
                        {/* Image */}
                        <TableCell>
                          {w.image ? (
                            <Box
                              component="img"
                              src={w.image}
                              alt={w.title}
                              sx={{ width: 52, height: 40, objectFit: 'cover', borderRadius: 1, display: 'block' }}
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          ) : (
                            <Box sx={{ width: 52, height: 40, borderRadius: 1, bgcolor: 'grey.100', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <CalendarOutlined style={{ color: '#94a3b8', fontSize: 18 }} />
                            </Box>
                          )}
                        </TableCell>

                        {/* Titre */}
                        <TableCell sx={{ maxWidth: 200 }}>
                          <Typography variant="body2" fontWeight={500} noWrap>{w.title}</Typography>
                          {w.category && (
                            <Typography variant="caption" color="text.secondary">{w.category}</Typography>
                          )}
                        </TableCell>

                        {/* Type */}
                        <TableCell>
                          <Chip
                            icon={<span style={{ fontSize: 12 }}>{tInfo.icon}</span>}
                            label={tInfo.label}
                            size="small"
                            sx={{ bgcolor: tInfo.bg, color: tInfo.color, border: 'none', fontWeight: 500 }}
                          />
                        </TableCell>

                        {/* Date */}
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                          <Typography variant="body2">{formatDateDisplay(w.date)}</Typography>
                        </TableCell>

                        {/* Formateur */}
                        <TableCell>
                          {w.instructor ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                              <Avatar sx={{ width: 22, height: 22, fontSize: '0.65rem', bgcolor: 'grey.200', color: 'text.primary' }}>
                                {w.instructor[0]?.toUpperCase()}
                              </Avatar>
                              <Typography variant="body2">{w.instructor}</Typography>
                            </Box>
                          ) : (
                            <Typography variant="body2" color="text.disabled">—</Typography>
                          )}
                        </TableCell>

                        {/* Places */}
                        <TableCell sx={{ minWidth: 90 }}>
                          <Typography variant="body2">{w.registered || 0} / {w.capacity || '—'}</Typography>
                          {w.capacity > 0 && (
                            <LinearProgress
                              variant="determinate"
                              value={Math.min(100, Math.round(((w.registered || 0) / w.capacity) * 100))}
                              sx={{ mt: 0.5, height: 3, borderRadius: 1 }}
                              color={((w.registered || 0) / w.capacity) >= 0.9 ? 'error' : 'primary'}
                            />
                          )}
                        </TableCell>

                        {/* Statut */}
                        <TableCell>
                          <Stack spacing={0.5}>
                            <Chip label={sCfg.label} color={sCfg.color} size="small" variant="outlined" />
                            {w.active
                              ? <Chip label="Publié"    size="small" color="success" />
                              : <Chip label="Brouillon" size="small" variant="outlined" />
                            }
                          </Stack>
                        </TableCell>

                        {/* Actions */}
                        <TableCell align="right">
                          <Tooltip title="Actions">
                            <IconButton
                              size="small"
                              onClick={(e) => { setMenuAnchor(e.currentTarget); setMenuWorkshop(w); }}
                            >
                              <MoreOutlined />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            {/* ── Menu kebab ── */}
            <Menu
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor)}
              onClose={() => { setMenuAnchor(null); setMenuWorkshop(null); }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={() => { handleEdit(menuWorkshop); setMenuAnchor(null); setMenuWorkshop(null); }}>
                <EditOutlined style={{ marginRight: 8 }} /> Modifier
              </MenuItem>
              <MenuItem onClick={() => { handleTogglePublish(menuWorkshop); setMenuAnchor(null); setMenuWorkshop(null); }}>
                {menuWorkshop?.active
                  ? <><CloseOutlined style={{ marginRight: 8, color: '#94a3b8' }} /> Dépublier</>
                  : <><span style={{ marginRight: 8, color: '#22c55e' }}>✓</span> Publier</>
                }
              </MenuItem>
              <MenuItem
                onClick={() => { handleDelete(menuWorkshop); setMenuAnchor(null); setMenuWorkshop(null); }}
                sx={{ color: 'error.main' }}
              >
                <DeleteOutlined style={{ marginRight: 8 }} /> Supprimer
              </MenuItem>
            </Menu>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            TAB 1 — FORMULAIRE
        ═══════════════════════════════════════════════════════════════ */}
        {activeTab === 1 && (
          <Box sx={{ pb: 4 }}>
            {/* En-tête */}
            <Box sx={{ mb: 4, pb: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                {editingId ? "Modifier l'activité" : 'Nouvelle activité'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Complétez les informations ci-dessous pour {editingId ? 'modifier' : 'créer'} cette activité
              </Typography>
            </Box>

            {/* Hidden file input */}
            <input
              ref={imageFileRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageUpload}
            />

            <Grid container spacing={3}>

              {/* ── Ligne 1 : Informations principales | Type d'activité ── */}
              <Grid item xs={12} md={6}>
                <Paper elevation={0} variant="outlined" sx={{ p: 3, height: '100%' }}>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2.5 }}>
                    Informations principales
                  </Typography>
                  <Grid container spacing={2.5}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth size="small" label="Titre de l'activité *"
                        value={formData.title} onChange={update('title')}
                        placeholder="Ex : Initiation à l'impression 3D"
                        helperText="Ce titre sera affiché publiquement"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth size="small" label="Catégorie"
                        value={formData.category} onChange={update('category')}
                        placeholder="Ex : Fabrication numérique"
                        helperText=" "
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper elevation={0} variant="outlined" sx={{ p: 3, height: '100%' }}>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                    Type d'activité
                  </Typography>
                  <Stack spacing={1.25}>
                    {TYPE_OPTIONS.map(t => {
                      const isSelected = formData.type === t.value;
                      return (
                        <Box
                          key={t.value}
                          role="button"
                          tabIndex={0}
                          onClick={() => setFormData(prev => ({ ...prev, type: t.value }))}
                          onKeyDown={(e) => e.key === 'Enter' && setFormData(prev => ({ ...prev, type: t.value }))}
                          sx={{
                            display: 'flex', alignItems: 'center', gap: 1.5,
                            px: 2, py: 1.25, borderRadius: 1.5, cursor: 'pointer',
                            border: '2px solid',
                            borderColor: isSelected ? t.color : 'divider',
                            bgcolor: isSelected ? t.bg : 'background.paper',
                            transition: 'all 0.15s ease',
                            userSelect: 'none', outline: 'none',
                            '& *': { pointerEvents: 'none' },
                            '&:hover': { borderColor: t.color, bgcolor: t.bg }
                          }}
                        >
                          <Box sx={{ color: t.color, fontSize: 16, display: 'flex' }}>{t.icon}</Box>
                          <Typography variant="body2" fontWeight={isSelected ? 600 : 400} sx={{ color: isSelected ? t.color : 'text.primary' }}>
                            {t.label}
                          </Typography>
                          {isSelected && (
                            <Box sx={{ ml: 'auto', width: 8, height: 8, borderRadius: '50%', bgcolor: t.color }} />
                          )}
                        </Box>
                      );
                    })}
                  </Stack>
                </Paper>
              </Grid>

              {/* ── Ligne 2 : Description (pleine largeur) ── */}
              <Grid item xs={12}>
                <Paper elevation={0} variant="outlined" sx={{ p: 3 }}>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                    <ReadOutlined style={{ marginRight: 8 }} />
                    Description
                  </Typography>
                  <RichTextField
                    label="Contenu de l'activité"
                    value={formData.description}
                    onChange={(val) => setFormData(prev => ({ ...prev, description: val }))}
                    rows={6}
                    placeholder="Contenu, objectifs, prérequis, déroulement..."
                    helperText="Utilisez Gras et les icônes pour enrichir la description. Les sauts de ligne sont préservés."
                  />
                </Paper>
              </Grid>

              {/* ── Ligne 3 : Organisation | Publication ── */}
              <Grid item xs={12} md={6}>
                <Paper elevation={0} variant="outlined" sx={{ p: 3, height: '100%' }}>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2.5 }}>
                    <CalendarOutlined style={{ marginRight: 8 }} />
                    Organisation
                  </Typography>
                  <Grid container spacing={2.5}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth size="small" label="Date et heure"
                        value={formData.date} onChange={update('date')}
                        type="datetime-local"
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth size="small" label="Lieu"
                        value={formData.location} onChange={update('location')}
                        placeholder="Ex : Salle de fab, Bâtiment B"
                        InputProps={{ startAdornment: <InputAdornment position="start"><EnvironmentOutlined /></InputAdornment> }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth size="small" label="Formateur / Intervenant"
                        value={formData.instructor} onChange={update('instructor')}
                        placeholder="Nom du formateur ou intervenant"
                        InputProps={{ startAdornment: <InputAdornment position="start"><UserOutlined /></InputAdornment> }}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper elevation={0} variant="outlined" sx={{ p: 3, height: '100%' }}>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                    Publication
                  </Typography>
                  <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                    <InputLabel>Statut</InputLabel>
                    <Select value={formData.status} label="Statut" onChange={update('status')}>
                      {Object.entries(STATUS_CONFIG).map(([v, c]) => (
                        <MenuItem key={v} value={v}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: v === 'upcoming' ? '#3b82f6' : v === 'ongoing' ? '#f59e0b' : v === 'completed' ? '#22c55e' : '#ef4444' }} />
                            {c.label}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Box sx={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    px: 2, py: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1,
                    bgcolor: formData.active ? '#f0fdf4' : 'background.paper',
                    transition: 'background-color 0.2s'
                  }}>
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        {formData.active ? 'Publié' : 'Brouillon'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formData.active ? 'Visible sur le site' : 'Non visible'}
                      </Typography>
                    </Box>
                    <Switch
                      checked={formData.active}
                      onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                      color="success"
                    />
                  </Box>
                </Paper>
              </Grid>

              {/* ── Ligne 4 : Détails pratiques | Image ── */}
              <Grid item xs={12} md={6}>
                <Paper elevation={0} variant="outlined" sx={{ p: 3, height: '100%' }}>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2.5 }}>
                    <TeamOutlined style={{ marginRight: 8 }} />
                    Détails pratiques
                  </Typography>
                  <Grid container spacing={2.5}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth size="small" label="Places max"
                        value={formData.capacity} onChange={update('capacity')}
                        type="number" inputProps={{ min: 1 }}
                        InputProps={{ startAdornment: <InputAdornment position="start"><TeamOutlined /></InputAdornment> }}
                        helperText=" "
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth size="small" label="Prix (FCFA)"
                        value={formData.price} onChange={update('price')}
                        type="number" inputProps={{ min: 0 }}
                        InputProps={{ startAdornment: <InputAdornment position="start"><DollarOutlined /></InputAdornment> }}
                        helperText="0 = Gratuit"
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper elevation={0} variant="outlined" sx={{ p: 3, height: '100%' }}>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                    Image de l'activité
                  </Typography>
                  <Button
                    variant="outlined" fullWidth
                    startIcon={uploadingImage ? <CircularProgress size={16} /> : <UploadOutlined />}
                    onClick={() => imageFileRef.current?.click()}
                    disabled={uploadingImage}
                    sx={{ mb: 1.5 }}
                  >
                    {uploadingImage ? 'Téléchargement...' : 'Choisir depuis le disque'}
                  </Button>
                  <TextField
                    fullWidth label="Ou coller une URL"
                    value={formData.image}
                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="https://..."
                    size="small"
                    sx={{ mb: 2 }}
                  />
                  <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, overflow: 'hidden', bgcolor: 'grey.50', height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {formData.image ? (
                      <CardMedia
                        component="img"
                        image={formData.image}
                        alt="Prévisualisation"
                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <Typography variant="caption" color="text.disabled">Aperçu de l'image</Typography>
                    )}
                  </Box>
                </Paper>
              </Grid>

              {/* ── Ligne 5 : Bouton personnalisé (pleine largeur) ── */}
              <Grid item xs={12}>
                <Paper elevation={0} variant="outlined" sx={{ p: 3 }}>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 0.5 }}>
                    <LinkOutlined style={{ marginRight: 8 }} />
                    Bouton personnalisé (optionnel)
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                    Ce bouton apparaîtra sur la page de détail de l'activité.
                  </Typography>
                  <Grid container spacing={2.5}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth size="small"
                        label="Texte du bouton"
                        value={formData.cta_label}
                        onChange={update('cta_label')}
                        placeholder="Ex : Rejoindre le groupe WhatsApp"
                        inputProps={{ maxLength: 60 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth size="small"
                        label="Lien URL"
                        value={formData.cta_url}
                        onChange={update('cta_url')}
                        placeholder="https://..."
                        InputProps={{ startAdornment: <InputAdornment position="start"><LinkOutlined /></InputAdornment> }}
                      />
                    </Grid>
                  </Grid>
                  {formData.cta_label.trim() && formData.cta_url.trim() && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                        Aperçu du bouton :
                      </Typography>
                      <Box sx={{
                        display: 'inline-flex', alignItems: 'center', gap: 1,
                        px: 2, py: 1, border: '1px solid', borderColor: 'primary.main',
                        borderRadius: 1, color: 'primary.main', fontSize: 14, fontWeight: 500
                      }}>
                        <LinkOutlined style={{ fontSize: 14 }} />
                        {formData.cta_label}
                      </Box>
                    </Box>
                  )}
                </Paper>
              </Grid>

            </Grid>

            {/* Barre d'actions fixe */}
            <Box sx={{
              position: 'sticky', bottom: 0, mt: 4, pt: 3, pb: 2,
              display: 'flex', gap: 2, justifyContent: 'flex-end', alignItems: 'center',
              borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper'
            }}>
              <Button
                variant="outlined" onClick={() => { resetForm(); setActiveTab(0); }}
                startIcon={<CloseOutlined />} sx={{ minWidth: 120 }}
              >
                Annuler
              </Button>
              <Button
                variant="contained" onClick={handleSave}
                startIcon={<SaveOutlined />}
                disabled={saving || !formData.title.trim()}
                disableElevation sx={{ minWidth: 160 }}
              >
                {editingId ? 'Enregistrer' : 'Créer'}
              </Button>
            </Box>
          </Box>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            TAB 2 — INSCRIPTIONS
        ═══════════════════════════════════════════════════════════════ */}
        {activeTab === 2 && (
          <Box>
            {/* Stats rapides inscriptions */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {[
                { label: 'Total inscrits',   value: registrations.length,                                        color: 'text.primary'  },
                { label: 'Confirmés',        value: registrations.filter(r => r.status === 'confirmed').length,  color: 'success.main'  },
                { label: 'En attente',       value: registrations.filter(r => r.status === 'pending').length,    color: 'warning.main'  },
                { label: 'Annulés',          value: registrations.filter(r => r.status === 'cancelled').length,  color: 'error.main'    }
              ].map(s => (
                <Grid item xs={6} sm={3} key={s.label}>
                  <Paper variant="outlined" sx={{ px: 2, py: 1.5, textAlign: 'center' }}>
                    <Typography variant="h4" color={s.color}>{s.value}</Typography>
                    <Typography variant="caption" color="text.secondary">{s.label}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            {/* Sélection de l'atelier + filtres */}
            <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth size="small" placeholder="Rechercher un inscrit..."
                  value={regSearchQuery} onChange={e => setRegSearchQuery(e.target.value)}
                  InputProps={{ startAdornment: <InputAdornment position="start"><SearchOutlined /></InputAdornment> }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Atelier</InputLabel>
                  <Select
                    value={selectedWorkshopId || 'all'}
                    label="Atelier"
                    onChange={e => setSelectedWorkshopId(e.target.value === 'all' ? null : e.target.value)}
                  >
                    <MenuItem value="all">Tous les ateliers</MenuItem>
                    {workshops.map(w => (
                      <MenuItem key={w.id} value={w.id}>
                        {w.title}
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                          ({w.registered || 0}/{w.capacity || 0})
                        </Typography>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2.5}>
                <FormControl fullWidth size="small">
                  <InputLabel>Statut</InputLabel>
                  <Select value={regStatusFilter} label="Statut" onChange={e => setRegStatusFilter(e.target.value)}>
                    <MenuItem value="all">Tous</MenuItem>
                    <MenuItem value="pending">En attente</MenuItem>
                    <MenuItem value="confirmed">Confirmés</MenuItem>
                    <MenuItem value="cancelled">Annulés</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md="auto" sx={{ ml: { md: 'auto' } }}>
                <Button size="small" variant="outlined" startIcon={<ReloadOutlined />}
                  onClick={loadAllRegistrations} disabled={loadingReg}>
                  Actualiser
                </Button>
              </Grid>
            </Grid>

            {/* ── Vue par atelier (capacité / places) ── */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {workshops
                .filter(w => !selectedWorkshopId || w.id === selectedWorkshopId)
                .map(w => {
                  const regCount = registrations.filter(r => r.workshop_id === w.id).length;
                  const cap = w.capacity || 20;
                  const pct = Math.min(Math.round((regCount / cap) * 100), 100);
                  const tInfo = TYPE_OPTIONS.find(t => t.value === w.type) || TYPE_OPTIONS[0];
                  return (
                    <Grid item xs={12} sm={6} md={4} key={w.id}>
                      <Paper
                        variant="outlined"
                        onClick={() => setSelectedWorkshopId(selectedWorkshopId === w.id ? null : w.id)}
                        sx={{
                          p: 2, cursor: 'pointer', transition: 'all 0.15s',
                          borderColor: selectedWorkshopId === w.id ? tInfo.color : 'divider',
                          bgcolor: selectedWorkshopId === w.id ? tInfo.bg : 'background.paper',
                          '&:hover': { borderColor: tInfo.color, bgcolor: tInfo.bg }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1.5 }}>
                          <Avatar sx={{ width: 36, height: 36, bgcolor: tInfo.bg, color: tInfo.color, fontSize: 16 }}>
                            {tInfo.icon}
                          </Avatar>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="body2" fontWeight={600} noWrap>{w.title}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {regCount} inscrit{regCount !== 1 ? 's' : ''} · {cap} places
                            </Typography>
                          </Box>
                          <Chip
                            label={`${pct}%`}
                            size="small"
                            sx={{ bgcolor: pct >= 100 ? '#fef2f2' : pct >= 75 ? '#fffbeb' : '#f0fdf4',
                                  color:  pct >= 100 ? '#ef4444' : pct >= 75 ? '#f59e0b' : '#22c55e',
                                  fontWeight: 600, fontSize: 11 }}
                          />
                        </Box>
                        <LinearProgress
                          variant="determinate" value={pct}
                          sx={{ height: 6, borderRadius: 3,
                            bgcolor: 'grey.100',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: pct >= 100 ? '#ef4444' : pct >= 75 ? '#f59e0b' : '#22c55e'
                            }
                          }}
                        />
                      </Paper>
                    </Grid>
                  );
                })}
            </Grid>

            {/* ── Tableau des inscrits ── */}
            {loadingReg ? (
              <LinearProgress sx={{ mb: 2 }} />
            ) : (
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'grey.50' }}>
                      <TableCell sx={{ fontWeight: 600 }}>Nom</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Téléphone</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Atelier</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Date inscription</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Statut</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {registrations
                      .filter(r => {
                        const matchSearch = !regSearchQuery ||
                          r.name?.toLowerCase().includes(regSearchQuery.toLowerCase()) ||
                          r.email?.toLowerCase().includes(regSearchQuery.toLowerCase());
                        const matchWorkshop = !selectedWorkshopId || r.workshop_id === selectedWorkshopId;
                        const matchStatus = regStatusFilter === 'all' || r.status === regStatusFilter;
                        return matchSearch && matchWorkshop && matchStatus;
                      })
                      .map(r => (
                        <TableRow
                          key={r.id}
                          hover
                          onClick={() => setDetailReg(r)}
                          sx={{ cursor: 'pointer' }}
                        >
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Avatar sx={{ width: 30, height: 30, fontSize: 12, bgcolor: 'primary.light' }}>
                                {(r.name || '?')[0].toUpperCase()}
                              </Avatar>
                              <Typography variant="body2" fontWeight={500}>{r.name}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">{r.email}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">{r.phone || '—'}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ maxWidth: 160 }} noWrap>
                              {r.workshop_title || '—'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption" color="text.secondary">
                              {r.created_at ? new Date(r.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={r.status || 'pending'}
                              size="small"
                              onClick={e => e.stopPropagation()}
                              onChange={e => { e.stopPropagation(); handleRegistrationStatus(r.id, e.target.value); }}
                              sx={{ minWidth: 120,
                                color: r.status === 'confirmed' ? '#22c55e' : r.status === 'cancelled' ? '#ef4444' : '#f59e0b',
                                fontWeight: 500, fontSize: 12
                              }}
                            >
                              <MenuItem value="pending">En attente</MenuItem>
                              <MenuItem value="confirmed">Confirmé</MenuItem>
                              <MenuItem value="cancelled">Annulé</MenuItem>
                            </Select>
                          </TableCell>
                          <TableCell align="right">
                            <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                              <Tooltip title="Voir le détail">
                                <IconButton
                                  size="small"
                                  onClick={e => { e.stopPropagation(); setDetailReg(r); }}
                                >
                                  <EyeOutlined style={{ fontSize: 16 }} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Supprimer l'inscription">
                                <IconButton
                                  size="small" color="error"
                                  onClick={e => { e.stopPropagation(); handleDeleteRegistration(r); }}
                                >
                                  <DeleteOutlined style={{ fontSize: 16 }} />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    {registrations.filter(r => {
                      const matchSearch = !regSearchQuery ||
                        r.name?.toLowerCase().includes(regSearchQuery.toLowerCase()) ||
                        r.email?.toLowerCase().includes(regSearchQuery.toLowerCase());
                      const matchWorkshop = !selectedWorkshopId || r.workshop_id === selectedWorkshopId;
                      const matchStatus = regStatusFilter === 'all' || r.status === regStatusFilter;
                      return matchSearch && matchWorkshop && matchStatus;
                    }).length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                          <Typography variant="body2" color="text.secondary">
                            Aucune inscription trouvée
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        )}
      </MainCard>

      {/* ═══ DIALOG DE CONFIRMATION ═══ */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => { confirmDialog.onCancel?.(); closeConfirm(); }}
        maxWidth="xs" fullWidth
        PaperProps={{ sx: { borderRadius: 3, overflow: 'hidden' } }}
      >
        {/* Bande de couleur en haut */}
        <Box sx={{ height: 6, bgcolor: confirmDialog.danger ? 'error.main' : 'primary.main' }} />
        <DialogContent sx={{ pt: 4, pb: 2, textAlign: 'center' }}>
          <Box sx={{
            width: 60, height: 60, borderRadius: '50%', mx: 'auto', mb: 2.5,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            bgcolor: confirmDialog.danger ? '#fef2f2' : '#eff6ff'
          }}>
            {confirmDialog.danger
              ? <WarningOutlined style={{ fontSize: 28, color: '#ef4444' }} />
              : <CheckCircleOutlined style={{ fontSize: 28, color: '#3b82f6' }} />
            }
          </Box>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            {confirmDialog.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
            {confirmDialog.message}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1, justifyContent: 'center' }}>
          <Button
            variant="outlined"
            onClick={() => { confirmDialog.onCancel?.(); closeConfirm(); }}
            sx={{ minWidth: 110, borderRadius: 2 }}
          >
            Annuler
          </Button>
          <Button
            variant="contained"
            color={confirmDialog.danger ? 'error' : 'primary'}
            onClick={() => confirmDialog.onConfirm?.()}
            disableElevation
            sx={{ minWidth: 110, borderRadius: 2 }}
          >
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>

      {/* ═══ DIALOG DÉTAIL INSCRIT ═══ */}
      <Dialog
        open={Boolean(detailReg)}
        onClose={() => setDetailReg(null)}
        maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: 3, overflow: 'hidden' } }}
      >
        {detailReg && (() => {
          const tInfo = TYPE_OPTIONS.find(t => t.value === detailReg.type) || TYPE_OPTIONS[0];
          const statusColors = { confirmed: '#22c55e', cancelled: '#ef4444', pending: '#f59e0b' };
          const statusLabels = { confirmed: 'Confirmé', cancelled: 'Annulé', pending: 'En attente' };
          const sColor = statusColors[detailReg.status] || '#94a3b8';
          const sLabel = statusLabels[detailReg.status] || detailReg.status;
          return (
            <>
              {/* Header */}
              <Box sx={{ px: 3, pt: 3.5, pb: 2.5, bgcolor: 'grey.50', borderBottom: '1px solid', borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ width: 52, height: 52, fontSize: 20, bgcolor: 'primary.main', fontWeight: 700 }}>
                    {(detailReg.name || '?')[0].toUpperCase()}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" fontWeight={700}>{detailReg.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Inscrit le {detailReg.created_at ? new Date(detailReg.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) : '—'}
                    </Typography>
                  </Box>
                  <Chip
                    label={sLabel}
                    size="small"
                    sx={{ bgcolor: sColor + '1a', color: sColor, fontWeight: 600, border: `1px solid ${sColor}40` }}
                  />
                </Box>
              </Box>

              <DialogContent sx={{ pt: 3 }}>
                {/* Coordonnées */}
                <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1.2, fontSize: 10 }}>Coordonnées</Typography>
                <Box sx={{ mt: 1, mb: 2.5 }}>
                  <Stack spacing={1.5}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1, px: 1.5, bgcolor: 'grey.50', borderRadius: 1.5 }}>
                      <MailOutlined style={{ color: '#3b82f6', fontSize: 16 }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary">Email</Typography>
                        <Typography variant="body2" fontWeight={500}>{detailReg.email || '—'}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1, px: 1.5, bgcolor: 'grey.50', borderRadius: 1.5 }}>
                      <PhoneOutlined style={{ color: '#10b981', fontSize: 16 }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary">Téléphone</Typography>
                        <Typography variant="body2" fontWeight={500}>{detailReg.phone || '—'}</Typography>
                      </Box>
                    </Box>
                  </Stack>
                </Box>

                <Divider sx={{ mb: 2.5 }} />

                {/* Atelier */}
                <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1.2, fontSize: 10 }}>Atelier concerné</Typography>
                <Box sx={{ mt: 1, mb: 2.5, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                  <Typography variant="body2" fontWeight={600} gutterBottom>
                    {detailReg.workshop_title || '—'}
                  </Typography>
                  {detailReg.workshop_date && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      <CalendarOutlined style={{ fontSize: 13, color: '#94a3b8' }} />
                      <Typography variant="caption" color="text.secondary">
                        {new Date(detailReg.workshop_date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                      </Typography>
                    </Box>
                  )}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <TeamOutlined style={{ fontSize: 13, color: '#94a3b8' }} />
                    <Typography variant="caption" color="text.secondary">
                      {detailReg.registered ?? '?'} / {detailReg.capacity ?? '?'} places occupées
                    </Typography>
                  </Box>
                </Box>

                {/* Message */}
                {detailReg.message && (
                  <>
                    <Divider sx={{ mb: 2.5 }} />
                    <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1.2, fontSize: 10 }}>Message</Typography>
                    <Box sx={{ mt: 1, p: 2, bgcolor: '#fffbeb', border: '1px solid #fef3c7', borderRadius: 1.5 }}>
                      <Typography variant="body2" sx={{ lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                        {detailReg.message}
                      </Typography>
                    </Box>
                  </>
                )}

                {/* Changer le statut */}
                <Divider sx={{ my: 2.5 }} />
                <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1.2, fontSize: 10 }}>Changer le statut</Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                  {[['pending','En attente','#f59e0b'], ['confirmed','Confirmé','#22c55e'], ['cancelled','Annulé','#ef4444']].map(([val, lbl, col]) => (
                    <Button
                      key={val}
                      size="small"
                      variant={detailReg.status === val ? 'contained' : 'outlined'}
                      onClick={() => {
                        handleRegistrationStatus(detailReg.id, val);
                        setDetailReg(prev => ({ ...prev, status: val }));
                      }}
                      sx={{
                        flex: 1,
                        borderColor: col,
                        color: detailReg.status === val ? '#fff' : col,
                        bgcolor: detailReg.status === val ? col : 'transparent',
                        '&:hover': { borderColor: col, bgcolor: col + '22' },
                        fontWeight: 600, fontSize: 12
                      }}
                    >
                      {lbl}
                    </Button>
                  ))}
                </Stack>
              </DialogContent>

              <DialogActions sx={{ px: 3, pb: 3, pt: 0, justifyContent: 'space-between' }}>
                <Button
                  variant="outlined" color="error" size="small"
                  startIcon={<DeleteOutlined />}
                  onClick={() => { setDetailReg(null); handleDeleteRegistration(detailReg); }}
                >
                  Supprimer l'inscription
                </Button>
                <Button variant="contained" onClick={() => setDetailReg(null)} disableElevation sx={{ borderRadius: 2 }}>
                  Fermer
                </Button>
              </DialogActions>
            </>
          );
        })()}
      </Dialog>
    </>
  );
}
