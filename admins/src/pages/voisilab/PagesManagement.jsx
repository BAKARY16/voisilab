import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Paper, Tabs, Tab, Box } from '@mui/material';
import { EditOutlined, DeleteOutlined, PlusOutlined, FileOutlined } from '@ant-design/icons';
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
    if (!window.confirm('Supprimer cette section?')) return;
    try {
      await pagesService.delete(id);
      loadPages();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const filteredPages = pages.filter(p => p.page_name === selectedPage);

  return (
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
  );
}
