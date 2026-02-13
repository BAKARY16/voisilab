import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Chip, Paper, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { EditOutlined, DeleteOutlined, PlusOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';
import { projectsService } from 'api/voisilab';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', category: '', status: 'pending' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { loadProjects(); }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const result = await projectsService.getAll();
      setProjects(result.data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await projectsService.update(editingId, formData);
      } else {
        await projectsService.create(formData);
      }
      setOpen(false);
      loadProjects();
      setFormData({ title: '', description: '', category: '', status: 'pending' });
      setEditingId(null);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await projectsService.updateStatus(id, status);
      loadProjects();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer?')) return;
    try {
      await projectsService.delete(id);
      loadProjects();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <MainCard title="Projets">
      <Button variant="contained" startIcon={<PlusOutlined />} onClick={() => setOpen(true)} sx={{ mb: 2 }}>Nouveau projet</Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Titre</TableCell>
              <TableCell>Catégorie</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? <TableRow><TableCell colSpan={5} align="center">Chargement...</TableCell></TableRow> : projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>{project.title}</TableCell>
                <TableCell>{project.category}</TableCell>
                <TableCell>
                  <Chip 
                    label={project.status === 'approved' ? 'Approuvé' : project.status === 'rejected' ? 'Rejeté' : 'En attente'} 
                    color={project.status === 'approved' ? 'success' : project.status === 'rejected' ? 'error' : 'warning'} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>{new Date(project.created_at).toLocaleDateString('fr-FR')}</TableCell>
                <TableCell>
                  {project.status === 'pending' && (
                    <>
                      <IconButton onClick={() => handleUpdateStatus(project.id, 'approved')} color="success" size="small"><CheckOutlined /></IconButton>
                      <IconButton onClick={() => handleUpdateStatus(project.id, 'rejected')} color="error" size="small"><CloseOutlined /></IconButton>
                    </>
                  )}
                  <IconButton onClick={() => { setEditingId(project.id); setFormData(project); setOpen(true); }} size="small"><EditOutlined /></IconButton>
                  <IconButton onClick={() => handleDelete(project.id)} color="error" size="small"><DeleteOutlined /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingId ? 'Modifier' : 'Créer'}</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Titre" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} margin="normal" required />
          <TextField fullWidth label="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} margin="normal" multiline rows={4} required />
          <TextField fullWidth label="Catégorie" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} margin="normal" required />
          <FormControl fullWidth margin="normal">
            <InputLabel>Statut</InputLabel>
            <Select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
              <MenuItem value="pending">En attente</MenuItem>
              <MenuItem value="approved">Approuvé</MenuItem>
              <MenuItem value="rejected">Rejeté</MenuItem>
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
