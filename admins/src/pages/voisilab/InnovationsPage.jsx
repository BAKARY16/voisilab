import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Chip,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Card,
  CardMedia,
  Grid,
  InputAdornment,
  Tabs,
  Tab,
  CircularProgress,
  Backdrop,
  Divider,
  Switch,
  FormControlLabel,
  Tooltip,
  Avatar,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  EditOutlined, 
  DeleteOutlined, 
  PlusOutlined, 
  SearchOutlined, 
  EyeOutlined, 
  SaveOutlined, 
  CloseOutlined,
  StarOutlined,
  StarFilled,
  CloudUploadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined
} from '@ant-design/icons';
import MainCard from 'components/MainCard';
import RichTextField from 'components/RichTextField';
import { innovationsService, API_URL } from 'api/voisilab';

const CATEGORIES = [
  'Santé',
  'Robotique',
  'Design',
  'IoT',
  'Agriculture',
  'Tech',
  'Éducation',
  'Mobilier',
  'Énergie',
  'Environnement',
  'Autre'
];

const STATUS_OPTIONS = [
  { value: 'pending', label: 'En attente', color: 'warning' },
  { value: 'approved', label: 'Approuvé', color: 'success' },
  { value: 'rejected', label: 'Rejeté', color: 'error' }
];

export default function InnovationsPage() {
  const [innovations, setInnovations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    creator_name: '',
    creator_email: '',
    image_url: '',
    tags: [],
    status: 'pending',
    is_published: false,
    is_featured: false
  });
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [alertSnack, setAlertSnack] = useState({ open: false, title: '', message: '', severity: 'info' });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', message: '', onConfirm: null, onCancel: null });
  const [tagInput, setTagInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    loadInnovations();
    
    const interval = setInterval(() => {
      innovationsService.getAll({ limit: 200 })
        .then(result => setInnovations(result.data || result || []))
        .catch(() => {});
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const loadInnovations = async () => {
    try {
      setLoading(true);
      const result = await innovationsService.getAll({ limit: 200 });
      setInnovations(result.data || result || []);
    } catch (error) {
      console.error('Erreur:', error);
      showAlert('Erreur', 'Erreur lors du chargement: ' + (error.message || 'Erreur inconnue'));
      setInnovations([]);
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (title, message = '', ok = false) => setAlertSnack({ open: true, title, message, severity: ok ? 'success' : 'error' });
  const askConfirm = (title, message) => new Promise(resolve => {
    setConfirmDialog({ open: true, title, message,
      onConfirm: () => { setConfirmDialog(d => ({ ...d, open: false })); resolve(true); },
      onCancel:  () => { setConfirmDialog(d => ({ ...d, open: false })); resolve(false); }
    });
  });

  const handleSave = async () => {
    try {
      if (!formData.title || !formData.description) {
        showAlert('Erreur', 'Le titre et la description sont requis');
        return;
      }

      setSaving(true);

      const dataToSend = {
        title: formData.title,
        description: formData.description,
        category: formData.category || null,
        creator_name: formData.creator_name || null,
        creator_email: formData.creator_email || null,
        image_url: formData.image_url || null,
        tags: formData.tags || [],
        status: formData.status || 'pending',
        is_published: formData.is_published,
        is_featured: formData.is_featured
      };

      console.log('Sending data:', dataToSend);

      if (editingId) {
        await innovationsService.update(editingId, dataToSend);
        showAlert('Succès', 'Innovation modifiée avec succès !', true);
      } else {
        await innovationsService.create(dataToSend);
        showAlert('Succès', 'Innovation créée avec succès !', true);
      }
      
      await loadInnovations();
      resetForm();
      setActiveTab(0);
    } catch (error) {
      console.error('Erreur complète:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Erreur inconnue';
      showAlert('Erreur', `Erreur lors de l'enregistrement: ${errorMessage}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const ok = await askConfirm(
      'Supprimer l\'innovation',
      'Êtes-vous sûr de vouloir supprimer cette innovation ?', 
      'Cette action est irréversible.');
    if (!ok) return;
    try {
      setSaving(true);
      await innovationsService.delete(id);
      showAlert('Succès', 'Innovation supprimée avec succès !', true);
      await loadInnovations();
    } catch (error) {
      console.error('Erreur:', error);
      showAlert('Erreur', 'Erreur lors de la suppression: ' + (error.message || 'Erreur inconnue'));
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async (id) => {
    try {
      setSaving(true);
      await innovationsService.togglePublish(id);
      await loadInnovations();
    } catch (error) {
      console.error('Erreur:', error);
      showAlert('Erreur', 'Erreur lors de la mise à jour: ' + (error.message || 'Erreur inconnue'));
    } finally {
      setSaving(false);
    }
  };

  const handleToggleFeatured = async (id) => {
    try {
      setSaving(true);
      await innovationsService.toggleFeatured(id);
      await loadInnovations();
    } catch (error) {
      console.error('Erreur:', error);
      showAlert('Erreur', 'Erreur lors de la mise à jour: ' + (error.message || 'Erreur inconnue'));
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      creator_name: '',
      creator_email: '',
      image_url: '',
      tags: [],
      status: 'pending',
      is_published: false,
      is_featured: false
    });
    setEditingId(null);
    setPreviewImage(null);
    setTagInput('');
  };

  const handleEdit = (innovation) => {
    let tags = innovation.tags || [];
    if (typeof tags === 'string') {
      try {
        tags = JSON.parse(tags);
      } catch {
        tags = [];
      }
    }
    
    // Construire l'URL de l'image correctement
    let imageUrl = innovation.image_url || '';
    let previewUrl = null;
    if (imageUrl) {
      previewUrl = imageUrl.startsWith('http') ? imageUrl : `${API_URL}${imageUrl}`;
    }
    
    setFormData({
      title: innovation.title || '',
      description: innovation.description || '',
      category: innovation.category || '',
      creator_name: innovation.creator_name || '',
      creator_email: innovation.creator_email || '',
      image_url: imageUrl,
      tags: tags,
      status: innovation.status || 'pending',
      is_published: Boolean(innovation.is_published),
      is_featured: Boolean(innovation.is_featured)
    });
    setEditingId(innovation.id);
    setPreviewImage(previewUrl);
    setActiveTab(1);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showAlert('Erreur', 'Veuillez sélectionner une image valide');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showAlert('Erreur', 'L\'image ne doit pas dépasser 5MB');
      return;
    }

    try {
      setUploading(true);
      
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('folder', 'innovations');

      const response = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
        body: formDataUpload
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'upload');
      }

      const result = await response.json();
      const imageUrl = result.url || result.path || result.filename;
      
      setFormData(prev => ({ ...prev, image_url: imageUrl }));
      setPreviewImage(imageUrl.startsWith('http') ? imageUrl : `${API_URL}${imageUrl}`);
      
    } catch (error) {
      console.error('Upload error:', error);
      showAlert('Erreur', 'Erreur lors de l\'upload de l\'image: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const filteredInnovations = innovations.filter(innovation => {
    const matchesSearch = !searchQuery || 
      innovation.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      innovation.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      innovation.creator_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || innovation.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || innovation.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusChip = (status) => {
    const statusConfig = STATUS_OPTIONS.find(s => s.value === status) || STATUS_OPTIONS[0];
    return <Chip label={statusConfig.label} color={statusConfig.color} size="small" />;
  };

  const parseTags = (tags) => {
    if (!tags) return [];
    if (Array.isArray(tags)) return tags;
    try {
      return JSON.parse(tags);
    } catch {
      return [];
    }
  };

  return (
    <>
      <Snackbar open={alertSnack.open} autoHideDuration={4000} onClose={() => setAlertSnack(a => ({ ...a, open: false }))} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert onClose={() => setAlertSnack(a => ({ ...a, open: false }))} severity={alertSnack.severity} variant="filled" sx={{ minWidth: 280 }}>
          <strong>{alertSnack.title}</strong>{alertSnack.message ? ` — ${alertSnack.message}` : ''}
        </Alert>
      </Snackbar>
      <Dialog open={confirmDialog.open} onClose={() => confirmDialog.onCancel?.()} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ p: 0 }}>
          <Box sx={{ bgcolor: 'error.main', px: 3, py: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <WarningOutlined style={{ color: '#fff', fontSize: 22 }} />
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>{confirmDialog.title}</Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 2.5 }}><Typography>{confirmDialog.message}</Typography></DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button variant="outlined" onClick={() => confirmDialog.onCancel?.()}>Annuler</Button>
          <Button variant="contained" color="error" onClick={() => confirmDialog.onConfirm?.()}>Supprimer</Button>
        </DialogActions>
      </Dialog>
      <MainCard title="Gestion des Innovations">
      {/* Loading Backdrop */}
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={saving}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
          <Tab label="Liste des innovations" />
          <Tab label={editingId ? "Modifier l'innovation" : "Nouvelle innovation"} />
        </Tabs>
      </Box>

      {/* Tab 0: List */}
      {activeTab === 0 && (
        <>
          {/* Filters */}
          <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              size="small"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlined />
                  </InputAdornment>
                )
              }}
              sx={{ minWidth: 250 }}
            />
            
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Statut</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                label="Statut"
              >
                <MenuItem value="all">Tous</MenuItem>
                {STATUS_OPTIONS.map(opt => (
                  <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Catégorie</InputLabel>
              <Select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                label="Catégorie"
              >
                <MenuItem value="all">Toutes</MenuItem>
                {CATEGORIES.map(cat => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ flexGrow: 1 }} />

            <Button
              variant="contained"
              startIcon={<PlusOutlined />}
              onClick={() => { resetForm(); setActiveTab(1); }}
            >
              Nouvelle innovation
            </Button>
          </Box>

          {/* Table */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ minWidth: 220 }}>Titre</TableCell>
                    <TableCell sx={{ minWidth: 130 }}>Catégorie / Statut</TableCell>
                    <TableCell sx={{ minWidth: 140 }}>Créateur</TableCell>
                    <TableCell align="center" sx={{ minWidth: 110 }}>Visibilité</TableCell>
                    <TableCell align="right" sx={{ width: 90 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredInnovations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography color="textSecondary" sx={{ py: 4 }}>
                          Aucune innovation trouvée
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredInnovations.map((innovation) => (
                      <TableRow key={innovation.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium" noWrap sx={{ maxWidth: 220 }}>
                            {innovation.title}
                          </Typography>
                          <Typography variant="caption" color="textSecondary" noWrap sx={{ display: 'block', maxWidth: 220 }}>
                            {innovation.description?.substring(0, 60)}…
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={innovation.category || '—'} size="small" variant="outlined" sx={{ mb: 0.5 }} />
                          <Box>{getStatusChip(innovation.status)}</Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" noWrap sx={{ maxWidth: 140 }}>
                            {innovation.creator_name || '—'}
                          </Typography>
                          <Typography variant="caption" color="textSecondary" noWrap sx={{ display: 'block', maxWidth: 140 }}>
                            {innovation.creator_email || ''}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title={innovation.is_published ? 'Dépublier' : 'Publier'}>
                            <IconButton
                              size="small"
                              color={innovation.is_published ? 'success' : 'default'}
                              onClick={() => handleTogglePublish(innovation.id)}
                            >
                              {innovation.is_published ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={innovation.is_featured ? 'Retirer de la une' : 'Mettre en vedette'}>
                            <IconButton
                              size="small"
                              color={innovation.is_featured ? 'warning' : 'default'}
                              onClick={() => handleToggleFeatured(innovation.id)}
                            >
                              {innovation.is_featured ? <StarFilled /> : <StarOutlined />}
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Modifier">
                            <IconButton size="small" onClick={() => handleEdit(innovation)} color="primary">
                              <EditOutlined />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Supprimer">
                            <IconButton size="small" onClick={() => handleDelete(innovation.id)} color="error">
                              <DeleteOutlined />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}

      {/* Tab 1: Form */}
      {activeTab === 1 && (
        <Grid container spacing={3}>
          {/* Left Column - Form */}
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                {editingId ? 'Modifier l\'innovation' : 'Nouvelle innovation'}
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Titre *"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Entrez le titre de l'innovation"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Catégorie</InputLabel>
                    <Select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      label="Catégorie"
                    >
                      <MenuItem value="">Aucune</MenuItem>
                      {CATEGORIES.map(cat => (
                        <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Statut</InputLabel>
                    <Select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      label="Statut"
                    >
                      {STATUS_OPTIONS.map(opt => (
                        <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Nom du créateur"
                    value={formData.creator_name}
                    onChange={(e) => setFormData({ ...formData, creator_name: e.target.value })}
                    placeholder="Nom du créateur du projet"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email du créateur"
                    type="email"
                    value={formData.creator_email}
                    onChange={(e) => setFormData({ ...formData, creator_email: e.target.value })}
                    placeholder="email@exemple.com"
                  />
                </Grid>

                <Grid item xs={12}>
                  <RichTextField
                    label="Description"
                    value={formData.description}
                    onChange={(val) => setFormData({ ...formData, description: val })}
                    rows={4}
                    required
                    placeholder="Décrivez l'innovation en détail..."
                    helperText="Utilisez Gras et les icônes pour enrichir la description."
                  />
                </Grid>

                {/* Tags */}
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>Tags</Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <TextField
                      size="small"
                      placeholder="Ajouter un tag"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      sx={{ flexGrow: 1 }}
                    />
                    <Button variant="outlined" onClick={handleAddTag}>
                      Ajouter
                    </Button>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {formData.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        onDelete={() => handleRemoveTag(tag)}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Grid>

                {/* Switches */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', gap: 3 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.is_published}
                          onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                        />
                      }
                      label="Publié"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.is_featured}
                          onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                        />
                      }
                      label="En vedette"
                    />
                  </Box>
                </Grid>
              </Grid>
            </Card>
          </Grid>

          {/* Right Column - Image */}
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Image de l'innovation</Typography>
              <Divider sx={{ mb: 3 }} />

              {/* Preview */}
              <Box
                sx={{
                  width: '100%',
                  height: 200,
                  border: '2px dashed',
                  borderColor: 'divider',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                  overflow: 'hidden',
                  backgroundColor: 'grey.50'
                }}
              >
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <Typography color="textSecondary">Aucune image</Typography>
                )}
              </Box>

              {/* Upload Button */}
              <Button
                variant="outlined"
                component="label"
                fullWidth
                startIcon={uploading ? <CircularProgress size={20} /> : <CloudUploadOutlined />}
                disabled={uploading}
              >
                {uploading ? 'Upload en cours...' : 'Télécharger une image'}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </Button>

              {/* URL manuelle */}
              <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 2, mb: 1 }}>
                Ou entrez une URL d'image :
              </Typography>
              <TextField
                size="small"
                fullWidth
                placeholder="https://exemple.com/image.jpg"
                value={formData.image_url}
                onChange={(e) => {
                  const url = e.target.value;
                  setFormData(prev => ({ ...prev, image_url: url }));
                  if (url && url.startsWith('http')) {
                    setPreviewImage(url);
                  } else if (url) {
                    setPreviewImage(`${API_URL}${url}`);
                  } else {
                    setPreviewImage(null);
                  }
                }}
              />
            </Card>

            {/* Actions */}
            <Card sx={{ p: 3, mt: 2 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveOutlined />}
                  onClick={handleSave}
                  disabled={saving}
                  fullWidth
                >
                  {editingId ? 'Mettre à jour' : 'Créer'}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<CloseOutlined />}
                  onClick={() => { resetForm(); setActiveTab(0); }}
                  fullWidth
                >
                  Annuler
                </Button>
              </Box>
            </Card>
          </Grid>
        </Grid>
      )}
    </MainCard>
    </>
  );
}
