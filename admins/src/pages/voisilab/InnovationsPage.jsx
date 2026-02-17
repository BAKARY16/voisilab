import { useState, useEffect, useCallback } from 'react';
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
  Avatar
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
  HeartOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import MainCard from 'components/MainCard';
import { innovationsService, mediaService } from 'api/voisilab';

const API_URL = 'http://localhost:3500';

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
  const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', message: '', type: '', action: null });
  const [tagInput, setTagInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    loadInnovations();
    
    const interval = setInterval(() => {
      innovationsService.getAll()
        .then(result => setInnovations(result.data || result || []))
        .catch(() => {});
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const loadInnovations = async () => {
    try {
      setLoading(true);
      const result = await innovationsService.getAll();
      setInnovations(result.data || result || []);
    } catch (error) {
      console.error('Erreur:', error);
      showConfirmDialog('Erreur', 'Erreur lors du chargement: ' + (error.message || 'Erreur inconnue'), 'error');
      setInnovations([]);
    } finally {
      setLoading(false);
    }
  };

  const showConfirmDialog = (title, message, type, action = null) => {
    setConfirmDialog({ open: true, title, message, type, action });
  };

  const handleConfirmDialogClose = () => {
    setConfirmDialog({ ...confirmDialog, open: false });
  };

  const handleConfirmAction = async () => {
    if (confirmDialog.action) {
      await confirmDialog.action();
    }
    handleConfirmDialogClose();
  };

  const handleSave = async () => {
    try {
      if (!formData.title || !formData.description) {
        showConfirmDialog('Erreur', 'Le titre et la description sont requis', 'error');
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
        showConfirmDialog('Succès', 'Innovation modifiée avec succès !', 'success');
      } else {
        await innovationsService.create(dataToSend);
        showConfirmDialog('Succès', 'Innovation créée avec succès !', 'success');
      }
      
      await loadInnovations();
      resetForm();
      setActiveTab(0);
    } catch (error) {
      console.error('Erreur complète:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Erreur inconnue';
      showConfirmDialog('Erreur', `Erreur lors de l'enregistrement: ${errorMessage}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    showConfirmDialog(
      'Confirmer la suppression',
      'Êtes-vous sûr de vouloir supprimer cette innovation ? Cette action est irréversible.',
      'warning',
      async () => {
        try {
          setSaving(true);
          await innovationsService.delete(id);
          showConfirmDialog('Succès', 'Innovation supprimée avec succès !', 'success');
          await loadInnovations();
        } catch (error) {
          console.error('Erreur:', error);
          showConfirmDialog('Erreur', 'Erreur lors de la suppression: ' + (error.message || 'Erreur inconnue'), 'error');
        } finally {
          setSaving(false);
        }
      }
    );
  };

  const handleTogglePublish = async (id) => {
    try {
      setSaving(true);
      await innovationsService.togglePublish(id);
      await loadInnovations();
    } catch (error) {
      console.error('Erreur:', error);
      showConfirmDialog('Erreur', 'Erreur lors de la mise à jour: ' + (error.message || 'Erreur inconnue'), 'error');
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
      showConfirmDialog('Erreur', 'Erreur lors de la mise à jour: ' + (error.message || 'Erreur inconnue'), 'error');
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
      showConfirmDialog('Erreur', 'Veuillez sélectionner une image valide', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showConfirmDialog('Erreur', 'L\'image ne doit pas dépasser 5MB', 'error');
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
      
      setFormData({ ...formData, image_url: imageUrl });
      setPreviewImage(imageUrl.startsWith('http') ? imageUrl : `${API_URL}${imageUrl}`);
      
    } catch (error) {
      console.error('Upload error:', error);
      showConfirmDialog('Erreur', 'Erreur lors de l\'upload de l\'image: ' + error.message, 'error');
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
    <MainCard title="Gestion des Innovations">
      {/* Loading Backdrop */}
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={saving}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onClose={handleConfirmDialogClose}>
        <DialogTitle>{confirmDialog.title}</DialogTitle>
        <DialogContent>
          <Typography>{confirmDialog.message}</Typography>
        </DialogContent>
        <DialogActions>
          {confirmDialog.type === 'warning' && confirmDialog.action ? (
            <>
              <Button onClick={handleConfirmDialogClose}>Annuler</Button>
              <Button onClick={handleConfirmAction} color="error" variant="contained">
                Confirmer
              </Button>
            </>
          ) : (
            <Button onClick={handleConfirmDialogClose} variant="contained">
              OK
            </Button>
          )}
        </DialogActions>
      </Dialog>

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
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Image</TableCell>
                    <TableCell>Titre</TableCell>
                    <TableCell>Catégorie</TableCell>
                    <TableCell>Créateur</TableCell>
                    <TableCell>Statut</TableCell>
                    <TableCell align="center">Publié</TableCell>
                    <TableCell align="center">En vedette</TableCell>
                    <TableCell align="center">Stats</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredInnovations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} align="center">
                        <Typography color="textSecondary" sx={{ py: 4 }}>
                          Aucune innovation trouvée
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredInnovations.map((innovation) => (
                      <TableRow key={innovation.id} hover>
                        <TableCell>
                          <Avatar
                            variant="rounded"
                            src={innovation.image_url?.startsWith('http') 
                              ? innovation.image_url 
                              : `${API_URL}${innovation.image_url}`}
                            sx={{ width: 60, height: 60 }}
                          >
                            {innovation.title?.charAt(0)}
                          </Avatar>
                        </TableCell>
                        <TableCell>
                          <Typography fontWeight="medium">{innovation.title}</Typography>
                          <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
                            {innovation.description?.substring(0, 50)}...
                          </Typography>
                          <Box sx={{ mt: 0.5 }}>
                            {parseTags(innovation.tags).slice(0, 3).map((tag, i) => (
                              <Chip key={i} label={tag} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                            ))}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip label={innovation.category || 'Non catégorisé'} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{innovation.creator_name || '-'}</Typography>
                          <Typography variant="caption" color="textSecondary">
                            {innovation.creator_email || ''}
                          </Typography>
                        </TableCell>
                        <TableCell>{getStatusChip(innovation.status)}</TableCell>
                        <TableCell align="center">
                          <Tooltip title={innovation.is_published ? 'Cliquer pour dépublier' : 'Cliquer pour publier'}>
                            <IconButton
                              color={innovation.is_published ? 'success' : 'default'}
                              onClick={() => handleTogglePublish(innovation.id)}
                            >
                              {innovation.is_published ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title={innovation.is_featured ? 'Retirer de la une' : 'Mettre en vedette'}>
                            <IconButton
                              color={innovation.is_featured ? 'warning' : 'default'}
                              onClick={() => handleToggleFeatured(innovation.id)}
                            >
                              {innovation.is_featured ? <StarFilled /> : <StarOutlined />}
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                            <Tooltip title="Likes">
                              <Chip 
                                icon={<HeartOutlined />} 
                                label={innovation.likes || 0} 
                                size="small" 
                                variant="outlined"
                              />
                            </Tooltip>
                            <Tooltip title="Vues">
                              <Chip 
                                icon={<EyeOutlined />} 
                                label={innovation.views || 0} 
                                size="small" 
                                variant="outlined"
                              />
                            </Tooltip>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Modifier">
                            <IconButton onClick={() => handleEdit(innovation)} color="primary">
                              <EditOutlined />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Supprimer">
                            <IconButton onClick={() => handleDelete(innovation.id)} color="error">
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
                  <TextField
                    fullWidth
                    label="Description *"
                    multiline
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Décrivez l'innovation en détail..."
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
                  setFormData({ ...formData, image_url: url });
                  // Définir la prévisualisation seulement si l'URL est valide
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
  );
}
