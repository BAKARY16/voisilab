import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Paper, Tabs, Tab, Box, Snackbar, Alert, Typography } from '@mui/material';
import { EditOutlined, DeleteOutlined, PlusOutlined, FileOutlined, WarningOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';
import { pagesService } from 'api/voisilab';

export default function PagesManagement() {
  const [pages, setPages] = useState([]);
const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    page_name: '',
    section_key: '',
    section_type: 'text',
    content: '{}',
    order_index: 0,
    active: true
  });
  const [editingId, setEditingId] = useState(null);
  const [selectedPage, setSelectedPage] = useState('home');
  const [alert, setAlert] = useState({ open: false, title: '', message: '', severity: 'info' });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', message: '', onConfirm: null, onCancel: null });

  const showAlert = (title, message = '', ok = false) => setAlert({ open: true, title, message, severity: ok ? 'success' : 'error' });
  const askConfirm = (title, message) => new Promise(resolve => {
    setConfirmDialog({ open: true, title, message,
      onConfirm: () => { setConfirmDialog(d => ({ ...d, open: false })); resolve(true); },
      onCancel:  () => { setConfirmDialog(d => ({ ...d, open: false })); resolve(false); }
    });
  });

  const pageNames = ['home', 'about', 'services', 'workshops', 'projects', 'ppn', 'contact'];

  useEffect(() => { loadPages(); }, []);

  const loadPages = async () => {
    try {
      setLoading(true);
      const result = await pagesService.getAll();
      setPages(result.data || []);
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
        content: typeof formData.content === 'string' ? formData.content : JSON.stringify(formData.content)
      };

      if (editingId) {
        await pagesService.update(editingId, dataToSave);
      } else {
        await pagesService.create(dataToSave);
      }
      setOpen(false);
      loadPages();
      setFormData({ page_name: '', section_key: '', section_type: 'text', content: '{}', order_index: 0, active: true });
      setEditingId(null);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleDelete = async (id) => {
    const ok = await askConfirm('Supprimer la section', 'Cette action est irréversible.');
    if (!ok) return;
    try {
      await pagesService.delete(id);
      loadPages();
      showAlert('Section supprimée', '', true);
    } catch (error) {
      showAlert('Erreur', error.message || 'Erreur lors de la suppression');
    }
  };

  const filteredPages = pages.filter(p => p.page_name === selectedPage);

  return (
    <>
      <Snackbar open={alert.open} autoHideDuration={4000} onClose={() => setAlert(p => ({ ...p, open: false }))} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert onClose={() => setAlert(p => ({ ...p, open: false }))} severity={alert.severity} variant="filled" sx={{ minWidth: 280 }}>
          <strong>{alert.title}</strong>{alert.message ? ' — ' + alert.message : ''}
        </Alert>
      </Snackbar>
      <Dialog open={confirmDialog.open} onClose={() => confirmDialog.onCancel?.()} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3, overflow: 'hidden' } }}>
        <Box sx={{ height: 6, bgcolor: 'error.main' }} />
        <DialogContent sx={{ pt: 4, pb: 2, textAlign: 'center' }}>
          <Box sx={{ width: 60, height: 60, borderRadius: '50%', mx: 'auto', mb: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#fef2f2' }}>
            <WarningOutlined style={{ fontSize: 28, color: '#ef4444' }} />
          </Box>
          <Typography variant="h6" fontWeight={700} gutterBottom>{confirmDialog.title}</Typography>
          <Typography variant="body2" color="text.secondary">{confirmDialog.message}</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1, justifyContent: 'center' }}>
          <Button variant="outlined" onClick={() => confirmDialog.onCancel?.()} sx={{ minWidth: 110, borderRadius: 2 }}>Annuler</Button>
          <Button variant="contained" color="error" onClick={() => confirmDialog.onConfirm?.()} disableElevation sx={{ minWidth: 110, borderRadius: 2 }}>Supprimer</Button>
        </DialogActions>
      </Dialog>
      <MainCard title="Gestion des pages">
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={selectedPage} onChange={(e, newValue) => setSelectedPage(newValue)}>
          {pageNames.map(name => (
            <Tab key={name} label={name.charAt(0).toUpperCase() + name.slice(1)} value={name} />
          ))}
        </Tabs>
      </Box>

      <Button variant="contained" startIcon={<PlusOutlined />} onClick={() => { setFormData({ ...formData, page_name: selectedPage }); setOpen(true); }} sx={{ mb: 2 }}>
        Nouvelle section
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Clé de section</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Ordre</TableCell>
              <TableCell>Actif</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} align="center">Chargement...</TableCell></TableRow>
            ) : filteredPages.length === 0 ? (
              <TableRow><TableCell colSpan={5} align="center">Aucune section pour cette page</TableCell></TableRow>
            ) : (
              filteredPages.map((page) => (
                <TableRow key={page.id}>
                  <TableCell>
                    <div style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <FileOutlined />
                      {page.section_key}
                    </div>
                  </TableCell>
                  <TableCell>{page.section_type}</TableCell>
                  <TableCell>{page.order_index}</TableCell>
                  <TableCell>{page.active ? '✓' : '✗'}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => { setEditingId(page.id); setFormData(page); setOpen(true); }} size="small"><EditOutlined /></IconButton>
                    <IconButton onClick={() => handleDelete(page.id)} color="error" size="small"><DeleteOutlined /></IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingId ? 'Modifier la section' : 'Créer une section'}</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Page" value={formData.page_name} onChange={(e) => setFormData({ ...formData, page_name: e.target.value })} margin="normal" required disabled={!!editingId} />
          <TextField fullWidth label="Clé de section" value={formData.section_key} onChange={(e) => setFormData({ ...formData, section_key: e.target.value })} margin="normal" required />
          <TextField fullWidth label="Type de section" value={formData.section_type} onChange={(e) => setFormData({ ...formData, section_type: e.target.value })} margin="normal" required helperText="Ex: hero, text, cards, gallery" />
          <TextField fullWidth label="Contenu (JSON)" value={typeof formData.content === 'string' ? formData.content : JSON.stringify(formData.content, null, 2)} onChange={(e) => setFormData({ ...formData, content: e.target.value })} margin="normal" multiline rows={6} required />
          <TextField fullWidth label="Ordre" value={formData.order_index} onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })} margin="normal" type="number" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Annuler</Button>
          <Button variant="contained" onClick={handleSave}>Enregistrer</Button>
        </DialogActions>
      </Dialog>
    </MainCard>
    </>
  );
}
