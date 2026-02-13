import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Chip, Paper, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { EditOutlined, DeleteOutlined, PlusOutlined, BookOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';
import { workshopsService } from 'api/voisilab';

export default function WorkshopsPage() {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    capacity: '',
    price: '',
    instructor: '',
    category: '',
    status: 'upcoming'
  });
  const [editingId, setEditingId] = useState(null);

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

  const handleSave = async () => {
    try {
      if (editingId) {
        await workshopsService.update(editingId, formData);
      } else {
        await workshopsService.create(formData);
      }
      setOpen(false);
      loadWorkshops();
      setFormData({ title: '', description: '', date: '', location: '', capacity: '', price: '', instructor: '', category: '', status: 'upcoming' });
      setEditingId(null);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet atelier?')) return;
    try {
      await workshopsService.delete(id);
      loadWorkshops();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <MainCard title="Ateliers">
      <Button variant="contained" startIcon={<PlusOutlined />} onClick={() => setOpen(true)} sx={{ mb: 2 }}>Nouvel atelier</Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Titre</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Lieu</TableCell>
              <TableCell>Places</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? <TableRow><TableCell colSpan={6} align="center">Chargement...</TableCell></TableRow> : workshops.map((workshop) => (
              <TableRow key={workshop.id}>
                <TableCell>
                  <div style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <BookOutlined style={{ color: '#52c41a' }} />
                    {workshop.title}
                  </div>
                  {workshop.category && <div style={{ fontSize: '0.75rem', color: '#999' }}>{workshop.category}</div>}
                </TableCell>
                <TableCell>{workshop.date ? new Date(workshop.date).toLocaleDateString('fr-FR') : '-'}</TableCell>
                <TableCell>{workshop.location || '-'}</TableCell>
                <TableCell>{workshop.capacity || '-'}</TableCell>
                <TableCell>
                  <Chip
                    label={
                      workshop.status === 'upcoming' ? 'À venir' :
                      workshop.status === 'ongoing' ? 'En cours' :
                      workshop.status === 'completed' ? 'Terminé' : 'Annulé'
                    }
                    color={
                      workshop.status === 'upcoming' ? 'info' :
                      workshop.status === 'ongoing' ? 'success' :
                      workshop.status === 'completed' ? 'default' : 'error'
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => { setEditingId(workshop.id); setFormData(workshop); setOpen(true); }} size="small"><EditOutlined /></IconButton>
                  <IconButton onClick={() => handleDelete(workshop.id)} color="error" size="small"><DeleteOutlined /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingId ? "Modifier l'atelier" : 'Créer un atelier'}</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Titre" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} margin="normal" required />
          <TextField fullWidth label="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} margin="normal" multiline rows={3} />
          <TextField fullWidth label="Date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} margin="normal" type="datetime-local" InputLabelProps={{ shrink: true }} required />
          <TextField fullWidth label="Lieu" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} margin="normal" />
          <TextField fullWidth label="Capacité" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: e.target.value })} margin="normal" type="number" />
          <TextField fullWidth label="Prix" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} margin="normal" type="number" />
          <TextField fullWidth label="Formateur" value={formData.instructor} onChange={(e) => setFormData({ ...formData, instructor: e.target.value })} margin="normal" />
          <TextField fullWidth label="Catégorie" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} margin="normal" />
          <FormControl fullWidth margin="normal">
            <InputLabel>Statut</InputLabel>
            <Select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
              <MenuItem value="upcoming">À venir</MenuItem>
              <MenuItem value="ongoing">En cours</MenuItem>
              <MenuItem value="completed">Terminé</MenuItem>
              <MenuItem value="cancelled">Annulé</MenuItem>
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
