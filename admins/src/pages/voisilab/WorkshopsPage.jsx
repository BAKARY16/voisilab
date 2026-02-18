import { useState, useEffect } from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  IconButton, Chip, Paper, Select, MenuItem, FormControl, InputLabel,
  Typography, Menu, Divider, Switch, CircularProgress,
  Stack, Grid, Avatar, LinearProgress
} from '@mui/material';
import {
  EditOutlined, DeleteOutlined, PlusOutlined, MoreOutlined,
  CloseOutlined, CheckOutlined, ReloadOutlined,
  CalendarOutlined, EnvironmentOutlined, UserOutlined,
  TeamOutlined, DollarOutlined, ClockCircleOutlined
} from '@ant-design/icons';
import MainCard from 'components/MainCard';
import { workshopsService } from 'api/voisilab';

// ─── Constantes ───────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  upcoming:  { label: 'À venir',  color: 'primary' },
  ongoing:   { label: 'En cours', color: 'warning'  },
  completed: { label: 'Terminé',  color: 'success'  },
  cancelled: { label: 'Annulé',   color: 'error'    }
};

// level DB ENUM : 'debutant' | 'intermediaire' | 'avance'
const LEVEL_OPTIONS = [
  { value: 'debutant',      label: 'Débutant'      },
  { value: 'intermediaire', label: 'Intermédiaire'  },
  { value: 'avance',        label: 'Avancé'         },
];
const LEVEL_LABELS = { debutant: 'Débutant', intermediaire: 'Intermédiaire', avance: 'Avancé' };

const defaultFormData = {
  title:       '',
  description: '',
  date:        '',
  location:    '',
  capacity:    20,
  level:       'debutant',
  price:       0,
  instructor:  '',
  category:    '',
  status:      'upcoming',
  active:      false
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
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '-';
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch { return '-'; }
};

// ─── Composant titre de section ───────────────────────────────────────────────

function SectionLabel({ icon, children }) {
  return (
    <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600, letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 0.75, mb: 1.5 }}>
      {icon}{children}
    </Typography>
  );
}

// ─── Dialog création / édition ────────────────────────────────────────────────

function WorkshopDialog({ open, onClose, onSave, editingId, formData, setFormData }) {
  const [saving, setSaving] = useState(false);
  const isEdit = Boolean(editingId);

  const update = (field) => (e) => setFormData(prev => ({ ...prev, [field]: e.target.value }));

  const handleSave = async () => {
    if (!formData.title.trim()) return;
    setSaving(true);
    try { await onSave(); }
    catch (err) { console.error(err); alert("Erreur lors de l'enregistrement"); }
    finally { setSaving(false); }
  };

  const initials = formData.title
    ? formData.title.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
    : '+';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>

      {/* En-tête */}
      <DialogTitle sx={{ p: 0 }}>
        <Box sx={{ px: 3, py: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.lighter', color: 'primary.main', fontWeight: 700, fontSize: '0.85rem' }}>
              {initials}
            </Avatar>
            <Box>
              <Typography variant="h6" lineHeight={1.2}>
                {isEdit ? "Modifier l'atelier" : 'Nouvel atelier'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {isEdit ? `Édition — ID #${editingId}` : 'Renseignez les informations ci-dessous'}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} size="small"><CloseOutlined /></IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>

        {/* ── Section 1 : Informations générales ── */}
        <Box sx={{ px: 3, py: 2.5 }}>
          <SectionLabel><span>ℹ️</span> Informations générales</SectionLabel>
          <Stack spacing={2}>
            <TextField
              fullWidth label="Titre de l'atelier *"
              value={formData.title} onChange={update('title')}
              size="small" placeholder="Ex : Introduction à l'impression 3D"
            />
            <TextField
              fullWidth label="Description"
              value={formData.description} onChange={update('description')}
              multiline rows={3} size="small"
              placeholder="Contenu, objectifs, prérequis..."
            />
            <TextField
              fullWidth label="Catégorie"
              value={formData.category} onChange={update('category')}
              size="small" placeholder="Ex : Fabrication numérique"
            />
          </Stack>
        </Box>

        <Divider />

        {/* ── Section 2 : Date & lieu ── */}
        <Box sx={{ px: 3, py: 2.5, bgcolor: 'grey.50' }}>
          <SectionLabel icon={<CalendarOutlined />}>Date & lieu</SectionLabel>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth label="Date et heure"
                value={formData.date} onChange={update('date')}
                type="datetime-local" InputLabelProps={{ shrink: true }}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth label="Lieu"
                value={formData.location} onChange={update('location')}
                size="small" placeholder="Ex : Salle de fab, Bâtiment B"
                InputProps={{ startAdornment: <EnvironmentOutlined style={{ marginRight: 8, color: '#aaa' }} /> }}
              />
            </Grid>
          </Grid>
        </Box>

        <Divider />

        {/* ── Section 3 : Participants & Tarif ── */}
        <Box sx={{ px: 3, py: 2.5 }}>
          <SectionLabel icon={<TeamOutlined />}>Participants & Tarif</SectionLabel>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <TextField
                fullWidth label="Places max"
                value={formData.capacity} onChange={update('capacity')}
                type="number" size="small" inputProps={{ min: 1 }}
                InputProps={{ startAdornment: <TeamOutlined style={{ marginRight: 8, color: '#aaa' }} /> }}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                fullWidth label="Prix (FCFA)"
                value={formData.price} onChange={update('price')}
                type="number" size="small" inputProps={{ min: 0 }}
                InputProps={{ startAdornment: <DollarOutlined style={{ marginRight: 8, color: '#aaa' }} /> }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Niveau</InputLabel>
                <Select value={formData.level} label="Niveau" onChange={update('level')}>
                  {LEVEL_OPTIONS.map(l => <MenuItem key={l.value} value={l.value}>{l.label}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth label="Formateur / Intervenant"
                value={formData.instructor} onChange={update('instructor')}
                size="small" placeholder="Nom du formateur"
                InputProps={{ startAdornment: <UserOutlined style={{ marginRight: 8, color: '#aaa' }} /> }}
              />
            </Grid>
          </Grid>
        </Box>

        <Divider />

        {/* ── Section 4 : Statut & Publication ── */}
        <Box sx={{ px: 3, py: 2.5, bgcolor: 'grey.50' }}>
          <SectionLabel><span>⚙️</span> Statut & Publication</SectionLabel>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Statut</InputLabel>
                <Select value={formData.status} label="Statut" onChange={update('status')}>
                  <MenuItem value="upcoming">À venir</MenuItem>
                  <MenuItem value="ongoing">En cours</MenuItem>
                  <MenuItem value="completed">Terminé</MenuItem>
                  <MenuItem value="cancelled">Annulé</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                px: 2, py: 1.25, border: '1px solid', borderColor: 'divider', borderRadius: 1,
                bgcolor: formData.active ? 'success.lighter' : 'background.paper',
                transition: 'background-color 0.2s'
              }}>
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    {formData.active ? 'Publié' : 'Brouillon'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formData.active ? 'Visible sur le site public' : 'Non visible publiquement'}
                  </Typography>
                </Box>
                <Switch
                  checked={formData.active}
                  onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                  color="success"
                />
              </Box>
            </Grid>
          </Grid>
        </Box>

      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Button onClick={onClose} variant="outlined" size="small">Annuler</Button>
        <Button
          variant="contained" disableElevation size="small"
          onClick={handleSave}
          disabled={saving || !formData.title.trim()}
        >
          {saving ? 'Enregistrement...' : isEdit ? 'Mettre à jour' : "Créer l'atelier"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── Page principale ───────────────────────────────────────────────────────────

export default function WorkshopsPage() {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [open, setOpen]           = useState(false);
  const [formData, setFormData]   = useState(defaultFormData);
  const [editingId, setEditingId] = useState(null);
  const [anchorEl, setAnchorEl]   = useState(null);
  const [menuItem, setMenuItem]   = useState(null);

  useEffect(() => { loadWorkshops(); }, []);

  const loadWorkshops = async () => {
    try {
      setLoading(true);
      const result = await workshopsService.getAll();
      setWorkshops(result.data || []);
    } catch (error) { console.error('Erreur:', error); }
    finally { setLoading(false); }
  };

  const handleMenuOpen  = (e, w) => { setAnchorEl(e.currentTarget); setMenuItem(w); };
  const handleMenuClose = ()     => { setAnchorEl(null); setMenuItem(null); };

  const handleEdit = (workshop) => {
    handleMenuClose();
    setEditingId(workshop.id);
    setFormData({
      title:       workshop.title || '',
      description: workshop.description || '',
      date:        formatDateForInput(workshop.date),
      location:    workshop.location || '',
      capacity:    workshop.capacity || 20,
      level:       workshop.level || 'debutant',
      price:       workshop.price || 0,
      instructor:  workshop.instructor || '',
      category:    workshop.category || '',
      status:      workshop.status || 'upcoming',
      active:      Boolean(workshop.active)
    });
    setOpen(true);
  };

  const handleCreate = () => { setEditingId(null); setFormData(defaultFormData); setOpen(true); };

  const handleSave = async () => {
    const dataToSend = {
      ...formData,
      date:     formData.date ? new Date(formData.date).toISOString() : null,
      capacity: Number(formData.capacity) || 20,
      price:    Number(formData.price)    || 0
    };
    if (editingId) {
      await workshopsService.update(editingId, dataToSend);
    } else {
      await workshopsService.create(dataToSend);
    }
    setOpen(false);
    setEditingId(null);
    setFormData(defaultFormData);
    loadWorkshops();
  };

  const handleDelete = async (id) => {
    handleMenuClose();
    if (!window.confirm('Supprimer cet atelier ?')) return;
    try { await workshopsService.delete(id); loadWorkshops(); }
    catch (error) { console.error('Erreur:', error); }
  };

  const handleTogglePublish = async (workshop) => {
    handleMenuClose();
    try {
      await workshopsService.update(workshop.id, { active: !workshop.active });
      loadWorkshops();
    } catch (error) { console.error('Erreur:', error); }
  };

  // Stats rapides
  const stats = {
    total:     workshops.length,
    published: workshops.filter(w => w.active).length,
    upcoming:  workshops.filter(w => w.status === 'upcoming').length,
    ongoing:   workshops.filter(w => w.status === 'ongoing').length,
  };

  return (
    <>
      <MainCard
        title="Ateliers & Formations"
        secondary={
          <Stack direction="row" spacing={1}>
            <Button size="small" variant="outlined" startIcon={<ReloadOutlined />} onClick={loadWorkshops} disabled={loading}>
              Actualiser
            </Button>
            <Button variant="contained" size="small" startIcon={<PlusOutlined />} onClick={handleCreate} disableElevation>
              Nouvel atelier
            </Button>
          </Stack>
        }
      >
        {/* Statistiques */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {[
            { label: 'Total',    value: stats.total,     color: 'text.primary'  },
            { label: 'Publiés',  value: stats.published, color: 'success.main'  },
            { label: 'À venir',  value: stats.upcoming,  color: 'primary.main'  },
            { label: 'En cours', value: stats.ongoing,   color: 'warning.main'  },
          ].map(s => (
            <Grid item xs={6} sm={3} key={s.label}>
              <Paper variant="outlined" sx={{ px: 2, py: 1.5, textAlign: 'center' }}>
                <Typography variant="h4" color={s.color}>{s.value}</Typography>
                <Typography variant="caption" color="text.secondary">{s.label}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Tableau */}
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell>Atelier</TableCell>
                <TableCell>Niveau</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Formateur</TableCell>
                <TableCell>Lieu</TableCell>
                <TableCell>Inscrits</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} sx={{ p: 0 }}>
                    <LinearProgress />
                  </TableCell>
                </TableRow>
              ) : workshops.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <Typography variant="body2" color="text.secondary">Aucun atelier</Typography>
                    <Button size="small" startIcon={<PlusOutlined />} onClick={handleCreate} sx={{ mt: 1 }}>
                      Créer le premier
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                workshops.map((w) => {
                  const sCfg = STATUS_CONFIG[w.status] || { label: w.status, color: 'default' };

                  return (
                    <TableRow key={w.id} hover>
                      {/* Titre */}
                      <TableCell sx={{ maxWidth: 200 }}>
                        <Typography variant="body2" fontWeight={500} noWrap>{w.title}</Typography>
                        {w.category && (
                          <Typography variant="caption" color="text.secondary">{w.category}</Typography>
                        )}
                      </TableCell>

                      {/* Niveau */}
                      <TableCell>
                        <Chip label={LEVEL_LABELS[w.level] || w.level || '—'} size="small" variant="outlined" />
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

                      {/* Lieu */}
                      <TableCell>
                        <Typography variant="body2">{w.location || '—'}</Typography>
                      </TableCell>

                      {/* Inscrits avec barre */}
                      <TableCell sx={{ minWidth: 90 }}>
                        <Typography variant="body2">{w.registered || 0} / {w.capacity || '—'}</Typography>
                        {w.capacity > 0 && (
                          <LinearProgress
                            variant="determinate"
                            value={Math.min(100, Math.round(((w.registered || 0) / w.capacity) * 100))}
                            sx={{ mt: 0.5, height: 3, borderRadius: 1 }}
                            color={((w.registered || 0) / w.capacity) >= 0.9 ? 'error' : ((w.registered || 0) / w.capacity) >= 0.6 ? 'warning' : 'primary'}
                          />
                        )}
                      </TableCell>

                      {/* Statut */}
                      <TableCell>
                        <Stack spacing={0.5}>
                          <Chip label={sCfg.label} color={sCfg.color} size="small" variant="outlined" />
                          {w.active
                            ? <Chip label="Publié"   size="small" color="success" />
                            : <Chip label="Brouillon" size="small" variant="outlined" />
                          }
                        </Stack>
                      </TableCell>

                      {/* Actions */}
                      <TableCell align="right">
                        <IconButton size="small" onClick={(e) => handleMenuOpen(e, w)}>
                          <MoreOutlined />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </MainCard>

      {/* Menu contextuel */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => handleEdit(menuItem)}>
          <EditOutlined style={{ marginRight: 8 }} /> Modifier
        </MenuItem>
        <MenuItem onClick={() => handleTogglePublish(menuItem)}>
          {menuItem?.active
            ? <><CloseOutlined style={{ marginRight: 8 }} /> Dépublier</>
            : <><CheckOutlined  style={{ marginRight: 8 }} /> Publier</>
          }
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleDelete(menuItem?.id)} sx={{ color: 'error.main' }}>
          <DeleteOutlined style={{ marginRight: 8 }} /> Supprimer
        </MenuItem>
      </Menu>

      {/* Dialog */}
      <WorkshopDialog
        open={open}
        onClose={() => setOpen(false)}
        onSave={handleSave}
        editingId={editingId}
        formData={formData}
        setFormData={setFormData}
      />
    </>
  );
}
