import { useState, useEffect } from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  IconButton, Chip, Paper, Select, MenuItem, FormControl, InputLabel,
  Typography, Menu, Divider, Switch, FormControlLabel, CircularProgress
} from '@mui/material';
import { EditOutlined, DeleteOutlined, PlusOutlined, MoreOutlined, EyeOutlined, CloseOutlined, CheckOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';
import { workshopsService } from 'api/voisilab';

const STATUS_LABELS = {
  upcoming: 'À venir',
  ongoing: 'En cours',
  completed: 'Terminé',
  cancelled: 'Annulé'
};

const TYPE_LABELS = {
  formation: 'Formation',
  atelier: 'Atelier',
  evenement: 'Événement'
};

// Formater une date pour input datetime-local (YYYY-MM-DDTHH:mm)
const formatDateForInput = (dateStr) => {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().slice(0, 16);
  } catch {
    return '';
  }
};

// Formater une date pour affichage
const formatDateDisplay = (dateStr) => {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '-';
    return date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return '-';
  }
};

const defaultFormData = {
  title: '',
  description: '',
  type: 'formation',
  date: '',
  time: '',
  duration: '',
  location: '',
  max_participants: 10,
  level: 'Débutant',
  price: 0,
  instructor: '',
  category: '',
  status: 'upcoming',
  is_published: false
};

export default function WorkshopsPage() {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [editingId, setEditingId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuItem, setMenuItem] = useState(null);

  useEffect(() => { loadWorkshops(); }, []);

  const loadWorkshops = async () => {
    try {
      setLoading(true);
      const result = await workshopsService.getAll();
      setWorkshops(result.data || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event, workshop) => {
    setAnchorEl(event.currentTarget);
    setMenuItem(workshop);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuItem(null);
  };

  const handleEdit = (workshop) => {
    handleMenuClose();
    setEditingId(workshop.id);
    setFormData({
      title: workshop.title || '',
      description: workshop.description || '',
      type: workshop.type || 'formation',
      date: formatDateForInput(workshop.date),
      time: workshop.time || '',
      duration: workshop.duration || '',
      location: workshop.location || '',
      max_participants: workshop.max_participants || workshop.capacity || 10,
      level: workshop.level || 'Débutant',
      price: workshop.price || 0,
      instructor: workshop.instructor || '',
      category: workshop.category || '',
      status: workshop.status || 'upcoming',
      is_published: Boolean(workshop.is_published)
    });
    setOpen(true);
  };

  const handleCreate = () => {
    setEditingId(null);
    setFormData(defaultFormData);
    setOpen(true);
  };

  const handleSave = async () => {
    try {
      const dataToSend = {
        ...formData,
        date: formData.date ? new Date(formData.date).toISOString() : null,
        max_participants: Number(formData.max_participants) || 10,
        price: Number(formData.price) || 0
      };
      
      if (editingId) {
        await workshopsService.update(editingId, dataToSend);
      } else {
        await workshopsService.create(dataToSend);
      }
      setOpen(false);
      loadWorkshops();
      setFormData(defaultFormData);
      setEditingId(null);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'enregistrement');
    }
  };

  const handleDelete = async (id) => {
    handleMenuClose();
    if (!window.confirm('Supprimer cet atelier ?')) return;
    try {
      await workshopsService.delete(id);
      loadWorkshops();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleTogglePublish = async (workshop) => {
    handleMenuClose();
    try {
      await workshopsService.update(workshop.id, { is_published: !workshop.is_published });
      loadWorkshops();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <MainCard
      title="Ateliers & Formations"
      secondary={
        <Button variant="contained" size="small" startIcon={<PlusOutlined />} onClick={handleCreate} disableElevation>
          Nouvel atelier
        </Button>
      }
    >
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Titre</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Lieu</TableCell>
              <TableCell>Places</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  <CircularProgress size={20} />
                </TableCell>
              </TableRow>
            ) : workshops.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                  Aucun atelier
                </TableCell>
              </TableRow>
            ) : (
              workshops.map((workshop) => (
                <TableRow key={workshop.id} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">{workshop.title}</Typography>
                      {workshop.category && (
                        <Typography variant="caption" color="text.secondary">{workshop.category}</Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={TYPE_LABELS[workshop.type] || workshop.type} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{formatDateDisplay(workshop.date)}</Typography>
                  </TableCell>
                  <TableCell>{workshop.location || '-'}</TableCell>
                  <TableCell>
                    {workshop.current_participants || 0}/{workshop.max_participants || workshop.capacity || '-'}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                      <Chip
                        label={STATUS_LABELS[workshop.status] || workshop.status}
                        size="small"
                        variant="outlined"
                      />
                      {workshop.is_published ? (
                        <Chip label="Publié" size="small" color="success" variant="outlined" />
                      ) : (
                        <Chip label="Brouillon" size="small" variant="outlined" />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={(e) => handleMenuOpen(e, workshop)}>
                      <MoreOutlined />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Menu contextuel */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => handleEdit(menuItem)}>
          <EditOutlined style={{ marginRight: 8 }} /> Modifier
        </MenuItem>
        <MenuItem onClick={() => handleTogglePublish(menuItem)}>
          {menuItem?.is_published ? (
            <><CloseOutlined style={{ marginRight: 8 }} /> Dépublier</>
          ) : (
            <><CheckOutlined style={{ marginRight: 8 }} /> Publier</>
          )}
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleDelete(menuItem?.id)} sx={{ color: 'error.main' }}>
          <DeleteOutlined style={{ marginRight: 8 }} /> Supprimer
        </MenuItem>
      </Menu>

      {/* Dialog d'édition */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? "Modifier l'atelier" : 'Nouvel atelier'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Titre"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            margin="normal"
            required
            size="small"
          />
          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            margin="normal"
            multiline
            rows={3}
            size="small"
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl fullWidth margin="normal" size="small">
              <InputLabel>Type</InputLabel>
              <Select
                value={formData.type}
                label="Type"
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <MenuItem value="formation">Formation</MenuItem>
                <MenuItem value="atelier">Atelier</MenuItem>
                <MenuItem value="evenement">Événement</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal" size="small">
              <InputLabel>Niveau</InputLabel>
              <Select
                value={formData.level}
                label="Niveau"
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
              >
                <MenuItem value="Débutant">Débutant</MenuItem>
                <MenuItem value="Intermédiaire">Intermédiaire</MenuItem>
                <MenuItem value="Avancé">Avancé</MenuItem>
                <MenuItem value="Tous niveaux">Tous niveaux</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <TextField
            fullWidth
            label="Date et heure"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            margin="normal"
            type="datetime-local"
            InputLabelProps={{ shrink: true }}
            required
            size="small"
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              label="Durée (ex: 2h)"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              margin="normal"
              size="small"
            />
            <TextField
              fullWidth
              label="Lieu"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              margin="normal"
              size="small"
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              label="Places max"
              value={formData.max_participants}
              onChange={(e) => setFormData({ ...formData, max_participants: e.target.value })}
              margin="normal"
              type="number"
              size="small"
            />
            <TextField
              fullWidth
              label="Prix (FCFA)"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              margin="normal"
              type="number"
              size="small"
            />
          </Box>
          <TextField
            fullWidth
            label="Formateur"
            value={formData.instructor}
            onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
            margin="normal"
            size="small"
          />
          <TextField
            fullWidth
            label="Catégorie"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            margin="normal"
            size="small"
          />
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <FormControl fullWidth margin="normal" size="small">
              <InputLabel>Statut</InputLabel>
              <Select
                value={formData.status}
                label="Statut"
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <MenuItem value="upcoming">À venir</MenuItem>
                <MenuItem value="ongoing">En cours</MenuItem>
                <MenuItem value="completed">Terminé</MenuItem>
                <MenuItem value="cancelled">Annulé</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_published}
                  onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                />
              }
              label="Publié"
              sx={{ mt: 1 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Annuler</Button>
          <Button variant="contained" onClick={handleSave} disableElevation>Enregistrer</Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
}
