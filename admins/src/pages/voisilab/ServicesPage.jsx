import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Chip, Paper } from '@mui/material';
import { EditOutlined, DeleteOutlined, PlusOutlined, CustomerServiceOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';
import { servicesService } from 'api/voisilab';

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '',
    price_info: '',
    order_index: 0,
    active: true
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { loadServices(); }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const result = await servicesService.getAll();
      setServices(result.data || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await servicesService.update(editingId, formData);
      } else {
        await servicesService.create(formData);
      }
      setOpen(false);
      loadServices();
      setFormData({ title: '', description: '', icon: '', price_info: '', order_index: 0, active: true });
      setEditingId(null);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce service?')) return;
    try {
      await servicesService.delete(id);
      loadServices();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <MainCard title="Services">
      <Button variant="contained" startIcon={<PlusOutlined />} onClick={() => setOpen(true)} sx={{ mb: 2 }}>Nouveau service</Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Titre</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Ordre</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? <TableRow><TableCell colSpan={5} align="center">Chargement...</TableCell></TableRow> : services.map((service) => (
              <TableRow key={service.id}>
                <TableCell>
                  <div style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CustomerServiceOutlined style={{ color: '#722ed1' }} />
                    {service.title}
                  </div>
                </TableCell>
                <TableCell>
                  <div style={{ fontSize: '0.875rem', color: '#666', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {service.description || '-'}
                  </div>
                </TableCell>
                <TableCell>{service.order_index}</TableCell>
                <TableCell>
                  <Chip label={service.active ? 'Actif' : 'Inactif'} color={service.active ? 'success' : 'default'} size="small" />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => { setEditingId(service.id); setFormData(service); setOpen(true); }} size="small"><EditOutlined /></IconButton>
                  <IconButton onClick={() => handleDelete(service.id)} color="error" size="small"><DeleteOutlined /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingId ? 'Modifier le service' : 'Créer un service'}</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Titre" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} margin="normal" required />
          <TextField fullWidth label="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} margin="normal" multiline rows={3} required />
          <TextField fullWidth label="Icône" value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} margin="normal" helperText="Nom de l'icône Ant Design (ex: ToolOutlined)" />
          <TextField fullWidth label="Info prix" value={formData.price_info} onChange={(e) => setFormData({ ...formData, price_info: e.target.value })} margin="normal" helperText="Ex: Gratuit, 50€/h, Sur devis" />
          <TextField fullWidth label="Ordre" value={formData.order_index} onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })} margin="normal" type="number" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Annuler</Button>
          <Button variant="contained" onClick={handleSave}>Enregistrer</Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
}
