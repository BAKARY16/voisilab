import { useState, useEffect } from 'react';
import { Grid, Card, CardMedia, CardContent, CardActions, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Typography, Box } from '@mui/material';
import { DeleteOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
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
    if (!window.confirm('Supprimer ce média?')) return;
    try {
      await mediaService.delete(id);
      loadMedia();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handlePreview = (item) => {
    setSelectedMedia(item);
    setPreviewOpen(true);
  };

  return (
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
  );
}
