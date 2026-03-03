import { useState, useEffect } from 'react';
import { Grid, Card, CardMedia, CardContent, CardActions, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Typography, Box, Snackbar, Alert } from '@mui/material';
import { DeleteOutlined, PlusOutlined, EyeOutlined, WarningOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';
import { mediaService } from 'api/voisilab';

export default function MediaPage() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    file_url: '',
    file_type: 'image'
  });
  const [alert, setAlert] = useState({ open: false, title: '', message: '', severity: 'info' });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', message: '', onConfirm: null, onCancel: null });

  const showAlert = (title, message = '', ok = false) => setAlert({ open: true, title, message, severity: ok ? 'success' : 'error' });
  const askConfirm = (title, message) => new Promise(resolve => {
    setConfirmDialog({ open: true, title, message,
      onConfirm: () => { setConfirmDialog(d => ({ ...d, open: false })); resolve(true); },
      onCancel:  () => { setConfirmDialog(d => ({ ...d, open: false })); resolve(false); }
    });
  });

  useEffect(() => { loadMedia(); }, []);

  const loadMedia = async () => {
    try {
      setLoading(true);
      const result = await mediaService.getAll();
      setMedia(result.data || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await mediaService.create(formData);
      setOpen(false);
      loadMedia();
      setFormData({ title: '', description: '', file_url: '', file_type: 'image' });
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleDelete = async (id) => {
    const ok = await askConfirm('Supprimer le média', 'Cette action est irréversible.');
    if (!ok) return;
    try {
      await mediaService.delete(id);
      loadMedia();
      showAlert('Média supprimé', '', true);
    } catch (error) {
      showAlert('Erreur', error.message || 'Erreur lors de la suppression');
    }
  };

  const handlePreview = (item) => {
    setSelectedMedia(item);
    setPreviewOpen(true);
  };

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
      <MainCard title="Médiathèque">
      <Button variant="contained" startIcon={<PlusOutlined />} onClick={() => setOpen(true)} sx={{ mb: 2 }}>Nouveau média</Button>

      {loading ? (
        <Typography align="center">Chargement...</Typography>
      ) : (
        <Grid container spacing={2}>
          {media.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="180"
                  image={item.file_url || '/placeholder.png'}
                  alt={item.title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography variant="h6" noWrap>{item.title}</Typography>
                  {item.description && (
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {item.description}
                    </Typography>
                  )}
                </CardContent>
                <CardActions>
                  <IconButton size="small" onClick={() => handlePreview(item)}><EyeOutlined /></IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDelete(item.id)}><DeleteOutlined /></IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Ajouter un média</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Titre" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} margin="normal" required />
          <TextField fullWidth label="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} margin="normal" multiline rows={2} />
          <TextField fullWidth label="URL du fichier" value={formData.file_url} onChange={(e) => setFormData({ ...formData, file_url: e.target.value })} margin="normal" required helperText="URL ou chemin du fichier" />
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Note: Upload de fichiers à implémenter avec Supabase Storage
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Annuler</Button>
          <Button variant="contained" onClick={handleSave}>Enregistrer</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{selectedMedia?.title}</DialogTitle>
        <DialogContent>
          {selectedMedia && (
            <>
              <img src={selectedMedia.file_url} alt={selectedMedia.title} style={{ width: '100%', height: 'auto' }} />
              {selectedMedia.description && (
                <Typography variant="body2" sx={{ mt: 2 }}>{selectedMedia.description}</Typography>
              )}
              <TextField fullWidth label="URL" value={selectedMedia.file_url} margin="normal" InputProps={{ readOnly: true }} />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Fermer</Button>
        </DialogActions>
      </Dialog>
    </MainCard>
    </>
  );
}
