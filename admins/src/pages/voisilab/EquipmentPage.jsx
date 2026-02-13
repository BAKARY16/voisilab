import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Chip, Paper, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { EditOutlined, DeleteOutlined, PlusOutlined, ToolOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';
import { equipmentService } from 'api/voisilab';

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    location: '',
    status: 'available'
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { loadEquipment(); }, []);

  const loadEquipment = async () => {
    try {
      setLoading(true);
      const result = await equipmentService.getAll();
      setEquipment(result.data || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await equipmentService.update(editingId, formData);
      } else {
        await equipmentService.create(formData);
      }
      setOpen(false);
      loadEquipment();
      setFormData({ name: '', description: '', category: '', location: '', status: 'available' });
      setEditingId(null);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet équipement?')) return;
    try {
      await equipmentService.delete(id);
      loadEquipment();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <MainCard title="Équipements">
      <Button variant="contained" startIcon={<PlusOutlined />} onClick={() => setOpen(true)} sx={{ mb: 2 }}>Nouvel équipement</Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Catégorie</TableCell>
              <TableCell>Lieu</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? <TableRow><TableCell colSpan={5} align="center">Chargement...</TableCell></TableRow> : equipment.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <ToolOutlined style={{ color: '#fa8c16' }} />
                    {item.name}
                  </div>
                </TableCell>
                <TableCell>{item.category || '-'}</TableCell>
                <TableCell>{item.location || '-'}</TableCell>
                <TableCell>
                  <Chip
                    label={
                      item.status === 'available' ? 'Disponible' :
                      item.status === 'in_use' ? 'En utilisation' :
                      item.status === 'maintenance' ? 'Maintenance' : 'Indisponible'
                    }
                    color={
                      item.status === 'available' ? 'success' :
                      item.status === 'in_use' ? 'info' :
                      item.status === 'maintenance' ? 'warning' : 'error'
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => { setEditingId(item.id); setFormData(item); setOpen(true); }} size="small"><EditOutlined /></IconButton>
                  <IconButton onClick={() => handleDelete(item.id)} color="error" size="small"><DeleteOutlined /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingId ? "Modifier l'équipement" : 'Créer un équipement'}</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Nom" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} margin="normal" required />
          <TextField fullWidth label="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} margin="normal" multiline rows={3} />
          <TextField fullWidth label="Catégorie" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} margin="normal" />
          <TextField fullWidth label="Lieu" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} margin="normal" />
          <FormControl fullWidth margin="normal">
            <InputLabel>Statut</InputLabel>
            <Select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
              <MenuItem value="available">Disponible</MenuItem>
              <MenuItem value="in_use">En utilisation</MenuItem>
              <MenuItem value="maintenance">Maintenance</MenuItem>
              <MenuItem value="unavailable">Indisponible</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Annuler</Button>
          <Button variant="contained" onClick={handleSave}>Enregistrer</Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
}
