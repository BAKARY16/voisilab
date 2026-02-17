import { useState, useEffect, useRef } from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, IconButton, Chip, Paper, Grid, TextField, FormControl, InputLabel, Select,
  MenuItem, Switch, FormControlLabel, Typography, Avatar, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions, Menu, Tabs, Tab, Stack
} from '@mui/material';
import { 
  EditOutlined, DeleteOutlined, PlusOutlined, ToolOutlined, UploadOutlined,
  MoreOutlined, CloseOutlined, LinkOutlined, PictureOutlined,
  AppstoreOutlined, DollarOutlined, OrderedListOutlined
} from '@ant-design/icons';
import MainCard from 'components/MainCard';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3500';

const ICONS = [
  'PrinterOutlined', 'CodeOutlined', 'RobotOutlined', 'ThunderboltOutlined',
  'ToolOutlined', 'ExperimentOutlined', 'BulbOutlined', 'RocketOutlined',
  'DesktopOutlined', 'MobileOutlined', 'CloudOutlined', 'DatabaseOutlined',
  'SafetyCertificateOutlined', 'TeamOutlined', 'CustomerServiceOutlined'
];

const defaultFormData = {
  title: '',
  description: '',
  icon: 'ToolOutlined',
  features: [],
  price_info: '',
  image_url: '',
  order_index: 0,
  active: true
};

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [imageTab, setImageTab] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [newFeature, setNewFeature] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => { loadServices(); }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/services`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      setServices(result.data || []);
    } catch (err) {
      console.error('Erreur chargement:', err);
      setError('Erreur lors du chargement des services');
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${API_URL}${url}`;
  };

  const handleOpenMenu = (event, service) => {
    setMenuAnchor(event.currentTarget);
    setSelectedService(service);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
    setSelectedService(null);
  };

  const handleEdit = () => {
    if (selectedService) {
      setEditingId(selectedService.id);
      const features = Array.isArray(selectedService.features) 
        ? selectedService.features 
        : (typeof selectedService.features === 'string' ? JSON.parse(selectedService.features || '[]') : []);
      
      setFormData({
        title: selectedService.title || '',
        description: selectedService.description || '',
        icon: selectedService.icon || 'ToolOutlined',
        features: features,
        price_info: selectedService.price_info || '',
        image_url: selectedService.image_url || '',
        order_index: selectedService.order_index || 0,
        active: selectedService.active !== false
      });
      setPreviewImage(selectedService.image_url ? getImageUrl(selectedService.image_url) : '');
      setImageTab(selectedService.image_url?.startsWith('http') ? 1 : 0);
      setOpen(true);
    }
    handleCloseMenu();
  };

  const handleDelete = async () => {
    if (!selectedService || !window.confirm(`Supprimer le service "${selectedService.title}" ?`)) {
      handleCloseMenu();
      return;
    }
    try {
      const token = sessionStorage.getItem('token');
      await fetch(`${API_URL}/api/services/${selectedService.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      loadServices();
    } catch (err) {
      console.error('Erreur suppression:', err);
      setError('Erreur lors de la suppression');
    }
    handleCloseMenu();
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Veuillez sélectionner une image');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('L\'image ne doit pas dépasser 5 Mo');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const token = sessionStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/upload/services`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: uploadFormData
      });

      if (!response.ok) throw new Error('Erreur upload');

      const result = await response.json();
      setFormData(prev => ({ ...prev, image_url: result.url }));
      setPreviewImage(getImageUrl(result.url));
    } catch (err) {
      console.error('Erreur upload:', err);
      setError('Erreur lors de l\'upload de l\'image');
    } finally {
      setUploading(false);
    }
  };

  const handleUrlChange = (url) => {
    setFormData(prev => ({ ...prev, image_url: url }));
    setPreviewImage(url);
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image_url: '' }));
    setPreviewImage('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({ 
        ...prev, 
        features: [...prev.features, newFeature.trim()] 
      }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    setError('');
    
    if (!formData.title.trim()) {
      setError('Le titre est requis');
      return;
    }

    try {
      const token = sessionStorage.getItem('token');
      const dataToSend = {
        title: formData.title.trim(),
        description: formData.description?.trim() || '',
        icon: formData.icon || 'ToolOutlined',
        features: formData.features,
        price_info: formData.price_info?.trim() || '',
        image_url: formData.image_url?.trim() || '',
        order_index: parseInt(formData.order_index) || 0,
        active: formData.active !== false
      };

      const url = editingId 
        ? `${API_URL}/api/services/${editingId}`
        : `${API_URL}/api/services`;
      
      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Erreur serveur');
      }
      
      handleCloseDialog();
      loadServices();
    } catch (err) {
      console.error('Erreur sauvegarde:', err);
      setError(err.message || 'Erreur lors de l\'enregistrement');
    }
  };

  const handleToggleActive = async (service) => {
    try {
      const token = sessionStorage.getItem('token');
      await fetch(`${API_URL}/api/services/${service.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ active: !service.active })
      });
      loadServices();
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setFormData(defaultFormData);
    setEditingId(null);
    setPreviewImage('');
    setError('');
    setImageTab(0);
    setNewFeature('');
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData(defaultFormData);
    setPreviewImage('');
    setError('');
    setImageTab(0);
    setNewFeature('');
    setOpen(true);
  };

  const parseFeatures = (features) => {
    if (Array.isArray(features)) return features;
    if (typeof features === 'string') {
      try { return JSON.parse(features); } catch { return []; }
    }
    return [];
  };

  return (
    <MainCard title="Gestion des Services">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button 
          variant="contained" 
          startIcon={<PlusOutlined />} 
          onClick={handleOpenCreate}
          size="large"
        >
          Nouveau service
        </Button>
        <Chip label={`${services.length} service(s)`} variant="outlined" />
      </Box>

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell width={80}>Image</TableCell>
              <TableCell>Service</TableCell>
              <TableCell>Caractéristiques</TableCell>
              <TableCell>Tarif</TableCell>
              <TableCell align="center">Ordre</TableCell>
              <TableCell align="center">Statut</TableCell>
              <TableCell align="right" width={60}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>Chargement...</TableCell>
              </TableRow>
            ) : services.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <ToolOutlined style={{ fontSize: 40, color: '#ccc' }} />
                  <Typography color="text.secondary" sx={{ mt: 1 }}>Aucun service</Typography>
                </TableCell>
              </TableRow>
            ) : services.map((service) => (
              <TableRow key={service.id} hover>
                <TableCell>
                  <Avatar
                    src={service.image_url ? getImageUrl(service.image_url) : undefined}
                    variant="rounded"
                    sx={{ width: 56, height: 56, bgcolor: 'primary.main' }}
                  >
                    <ToolOutlined />
                  </Avatar>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>{service.title}</Typography>
                  {service.description && (
                    <Typography 
                      variant="caption" 
                      color="text.secondary" 
                      sx={{ 
                        display: 'block', 
                        maxWidth: 250, 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        whiteSpace: 'nowrap' 
                      }}
                    >
                      {service.description}
                    </Typography>
                  )}
                  {service.icon && (
                    <Chip label={service.icon} size="small" variant="outlined" sx={{ mt: 0.5 }} />
                  )}
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
                    {parseFeatures(service.features).slice(0, 3).map((feat, idx) => (
                      <Chip key={idx} label={feat} size="small" color="primary" variant="outlined" />
                    ))}
                    {parseFeatures(service.features).length > 3 && (
                      <Chip label={`+${parseFeatures(service.features).length - 3}`} size="small" />
                    )}
                  </Stack>
                </TableCell>
                <TableCell>
                  {service.price_info ? (
                    <Typography variant="body2" color="success.main" fontWeight={500}>
                      {service.price_info}
                    </Typography>
                  ) : (
                    <Typography variant="caption" color="text.secondary">-</Typography>
                  )}
                </TableCell>
                <TableCell align="center">
                  <Chip label={service.order_index} size="small" />
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={service.active ? 'Actif' : 'Inactif'}
                    color={service.active ? 'success' : 'default'}
                    size="small"
                    onClick={() => handleToggleActive(service)}
                    sx={{ cursor: 'pointer' }}
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={(e) => handleOpenMenu(e, service)}>
                    <MoreOutlined />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Menu contextuel */}
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleCloseMenu}>
        <MenuItem onClick={handleEdit}>
          <EditOutlined style={{ marginRight: 8 }} /> Modifier
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <DeleteOutlined style={{ marginRight: 8 }} /> Supprimer
        </MenuItem>
      </Menu>

      {/* Dialog formulaire */}
      <Dialog open={open} onClose={handleCloseDialog} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
        <DialogTitle sx={{ pb: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <ToolOutlined style={{ fontSize: 20 }} />
            <Typography variant="h6">
              {editingId ? 'Modifier le service' : 'Nouveau service'}
            </Typography>
          </Stack>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 3 }}>
          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
          
          <Grid container spacing={3}>
            {/* Section Image */}
            <Grid item xs={12} md={4}>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, height: '100%' }}>
                <Typography variant="subtitle2" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PictureOutlined /> Image du service
                </Typography>
                
                {/* Preview */}
                <Box 
                  sx={{ 
                    width: '100%', 
                    height: 180, 
                    bgcolor: 'grey.100', 
                    borderRadius: 2, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    mb: 2,
                    overflow: 'hidden',
                    position: 'relative'
                  }}
                >
                  {previewImage ? (
                    <>
                      <Box 
                        component="img"
                        src={previewImage} 
                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={() => setPreviewImage('')}
                      />
                      <IconButton
                        size="small"
                        onClick={handleRemoveImage}
                        sx={{ 
                          position: 'absolute', 
                          top: 4, 
                          right: 4, 
                          bgcolor: 'rgba(0,0,0,0.5)',
                          color: 'white',
                          '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
                        }}
                      >
                        <CloseOutlined />
                      </IconButton>
                    </>
                  ) : (
                    <Stack alignItems="center" spacing={1}>
                      <PictureOutlined style={{ fontSize: 50, color: '#bbb' }} />
                      <Typography variant="caption" color="text.secondary">Aucune image</Typography>
                    </Stack>
                  )}
                </Box>

                {/* Tabs Upload / URL */}
                <Tabs 
                  value={imageTab} 
                  onChange={(e, v) => setImageTab(v)} 
                  variant="fullWidth" 
                  sx={{ mb: 2, minHeight: 36 }}
                >
                  <Tab 
                    icon={<UploadOutlined />} 
                    label="Upload" 
                    sx={{ minHeight: 36, py: 0.5, fontSize: '0.75rem' }} 
                  />
                  <Tab 
                    icon={<LinkOutlined />} 
                    label="URL" 
                    sx={{ minHeight: 36, py: 0.5, fontSize: '0.75rem' }} 
                  />
                </Tabs>

                {imageTab === 0 ? (
                  <Box>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleFileUpload}
                      style={{ display: 'none' }}
                    />
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<UploadOutlined />}
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                    >
                      {uploading ? 'Upload...' : 'Choisir une image'}
                    </Button>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, textAlign: 'center' }}>
                      Max 5 Mo (JPG, PNG, WebP)
                    </Typography>
                  </Box>
                ) : (
                  <TextField
                    fullWidth
                    size="small"
                    label="URL de l'image"
                    placeholder="https://..."
                    value={formData.image_url?.startsWith('http') ? formData.image_url : ''}
                    onChange={(e) => handleUrlChange(e.target.value)}
                  />
                )}
              </Paper>
            </Grid>

            {/* Section Informations */}
            <Grid item xs={12} md={8}>
              <Stack spacing={2.5}>
                {/* Informations principales */}
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>Informations principales</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={8}>
                      <TextField 
                        fullWidth 
                        label="Titre du service" 
                        value={formData.title} 
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                        size="small"
                        required
                        placeholder="Ex: Impression 3D"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Icône</InputLabel>
                        <Select 
                          value={formData.icon} 
                          label="Icône"
                          onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                        >
                          {ICONS.map(icon => (
                            <MenuItem key={icon} value={icon}>{icon.replace('Outlined', '')}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField 
                        fullWidth 
                        label="Description" 
                        value={formData.description} 
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                        multiline 
                        rows={3}
                        size="small"
                        placeholder="Décrivez le service..."
                      />
                    </Grid>
                  </Grid>
                </Paper>

                {/* Caractéristiques */}
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AppstoreOutlined /> Caractéristiques
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Ajouter une caractéristique"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                      placeholder="Ex: Prototypage rapide"
                    />
                    <Button variant="outlined" onClick={handleAddFeature} disabled={!newFeature.trim()}>
                      <PlusOutlined />
                    </Button>
                  </Stack>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {formData.features.map((feat, idx) => (
                      <Chip
                        key={idx}
                        label={feat}
                        onDelete={() => handleRemoveFeature(idx)}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                    {formData.features.length === 0 && (
                      <Typography variant="caption" color="text.secondary">
                        Aucune caractéristique ajoutée
                      </Typography>
                    )}
                  </Box>
                </Paper>

                {/* Tarif & Paramètres */}
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DollarOutlined /> Tarif & Paramètres
                  </Typography>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={5}>
                      <TextField 
                        fullWidth 
                        label="Information tarifaire" 
                        value={formData.price_info} 
                        onChange={(e) => setFormData({ ...formData, price_info: e.target.value })} 
                        size="small"
                        placeholder="Ex: À partir de 5€"
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField 
                        fullWidth 
                        label="Ordre d'affichage" 
                        type="number"
                        value={formData.order_index} 
                        onChange={(e) => setFormData({ ...formData, order_index: e.target.value })} 
                        size="small"
                        InputProps={{ inputProps: { min: 0 } }}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormControlLabel
                        control={
                          <Switch 
                            checked={formData.active} 
                            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                            color="success"
                          />
                        }
                        label={
                          <Typography variant="body2">
                            Actif <Typography component="span" variant="caption" color="text.secondary">(visible)</Typography>
                          </Typography>
                        }
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Stack>
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button onClick={handleCloseDialog} color="inherit">Annuler</Button>
          <Button 
            variant="contained" 
            onClick={handleSave}
            disabled={!formData.title.trim()}
          >
            {editingId ? 'Mettre à jour' : 'Créer le service'}
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
}
