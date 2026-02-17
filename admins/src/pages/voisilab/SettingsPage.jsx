import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Paper, Chip } from '@mui/material';
import { EditOutlined, DeleteOutlined, PlusOutlined, SettingOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';
import { settingsService } from 'api/voisilab';

export default function SettingsPage() {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    key: '',
    value: '',
    description: '',
    category: 'general'
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { loadSettings(); }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const result = await settingsService.getAll();
      setSettings(result.data || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const dataToSave = {
        ...formData,
        value: typeof formData.value === 'string' ? formData.value : JSON.stringify(formData.value)
      };

      if (editingId) {
        await settingsService.update(editingId, dataToSave);
      } else {
        await settingsService.create(dataToSave);
      }
      setOpen(false);
      loadSettings();
      setFormData({ key: '', value: '', description: '', category: 'general' });
      setEditingId(null);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce paramètre?')) return;
    try {
      await settingsService.delete(id);
      loadSettings();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      general: 'primary',
      email: 'info',
      social: 'success',
      seo: 'warning',
      advanced: 'error'
    };
    return colors[category] || 'default';
  };

  return (
    <MainCard title="Paramètres du site">
      <Button variant="contained" startIcon={<PlusOutlined />} onClick={() => setOpen(true)} sx={{ mb: 2 }}>Nouveau paramètre</Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Clé</TableCell>
              <TableCell>Valeur</TableCell>
              <TableCell>Catégorie</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? <TableRow><TableCell colSpan={5} align="center">Chargement...</TableCell></TableRow> : settings.map((setting) => (
              <TableRow key={setting.id}>
                <TableCell>
                  <div style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <SettingOutlined />
                    {setting.key}
                  </div>
                </TableCell>
                <TableCell>
                  <div style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {typeof setting.value === 'object' ? JSON.stringify(setting.value) : setting.value}
                  </div>
                </TableCell>
                <TableCell>
                  <Chip label={setting.category || 'general'} color={getCategoryColor(setting.category)} size="small" />
                </TableCell>
                <TableCell>
                  <div style={{ fontSize: '0.875rem', color: '#666', maxWidth: 250 }}>
                    {setting.description || '-'}
                  </div>
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => {
                    setEditingId(setting.id);
                    setFormData({
                      ...setting,
                      value: typeof setting.value === 'object' ? JSON.stringify(setting.value, null, 2) : setting.value
                    });
                    setOpen(true);
                  }} size="small"><EditOutlined /></IconButton>
                  <IconButton onClick={() => handleDelete(setting.id)} color="error" size="small"><DeleteOutlined /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingId ? 'Modifier le paramètre' : 'Créer un paramètre'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Clé"
            value={formData.key}
            onChange={(e) => setFormData({ ...formData, key: e.target.value })}
            margin="normal"
            required
            disabled={!!editingId}
            helperText="Identifiant unique du paramètre (ex: site_name, contact_email)"
          />
          <TextField
            fullWidth
            label="Valeur"
            value={formData.value}
            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
            margin="normal"
            multiline
            rows={4}
            required
            helperText="Valeur du paramètre (peut être du texte ou du JSON)"
          />
          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            margin="normal"
            multiline
            rows={2}
          />
          <TextField
            fullWidth
            label="Catégorie"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            margin="normal"
            helperText="Ex: general, email, social, seo, advanced"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Annuler</Button>
          <Button variant="contained" onClick={handleSave}>Enregistrer</Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
}
