import { useState, useEffect, useRef } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, 
  IconButton, Chip, Paper, Select, MenuItem, FormControl, InputLabel,
  Switch, FormControlLabel, Grid, Typography, Menu, Box, Alert, Avatar,
  Card, CardMedia, Tabs, Tab, Divider, Stack, Tooltip
} from '@mui/material';
import { 
  EditOutlined, DeleteOutlined, PlusOutlined, ToolOutlined, MoreOutlined,
  UploadOutlined, LinkOutlined, PictureOutlined, CloseOutlined
} from '@ant-design/icons';
import MainCard from 'components/MainCard';
import { equipmentService } from 'api/voisilab';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3500';

const defaultFormData = {
  name: '',
  description: '',
  category: '',
  image_url: '',
  count_info: '',
  status: 'available',
  order_index: 0,
  active: true
};

const CATEGORIES = [
  'Impression 3D',
  'Création',
  'Découpe Laser',
  'Électronique',
  'Couture',
  'Bois',
  'Métal',
  'CNC',
  'Scanner 3D',
  'Autre'
];

const STATUS_CONFIG = {
  available: { label: 'Disponible', color: 'success' },
  maintenance: { label: 'Maintenance', color: 'warning' },
  unavailable: { label: 'Indisponible', color: 'error' }
};

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [imageTab, setImageTab] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => { loadEquipment(); }, []);

  const loadEquipment = async () => {
    try {
      setLoading(true);
      const result = await equipmentService.getAll();
      setEquipment(result.data || []);
    } catch (err) {
      console.error('Erreur chargement:', err);
      setError('Erreur lors du chargement des équipements');
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${API_URL}${url}`;
  };

  const handleOpenMenu = (event, item) => {
    setMenuAnchor(event.currentTarget);
    setSelectedItem(item);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
    setSelectedItem(null);
  };

  const handleEdit = () => {
    if (selectedItem) {
      setEditingId(selectedItem.id);
      setFormData({
        name: selectedItem.name || '',
        description: selectedItem.description || '',
        category: selectedItem.category || '',
        image_url: selectedItem.image_url || '',
        count_info: selectedItem.count_info || '',
        status: selectedItem.status || 'available',
        order_index: selectedItem.order_index || 0,
        active: selectedItem.active !== false
      });
      setPreviewImage(selectedItem.image_url ? getImageUrl(selectedItem.image_url) : '');
      setImageTab(selectedItem.image_url?.startsWith('http') ? 1 : 0);
      setOpen(true);
    }
    handleCloseMenu();
  };

  const handleDelete = async () => {
    if (!selectedItem || !window.confirm(`Supprimer "${selectedItem.name}" ?`)) {
      handleCloseMenu();
      return;
    }
    try {
      await equipmentService.delete(selectedItem.id);
      loadEquipment();
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

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/upload/equipment`, {
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

  const handleSave = async () => {
    setError('');
    
    if (!formData.name.trim()) {
      setError('Le nom est requis');
      return;
    }
    if (!formData.category.trim()) {
      setError('La catégorie est requise');
      return;
    }

    try {
      const dataToSend = {
        name: formData.name.trim(),
        category: formData.category.trim(),
        description: formData.description?.trim() || '',
        image_url: formData.image_url?.trim() || '',
        count_info: formData.count_info?.trim() || '',
        status: formData.status || 'available',
        order_index: parseInt(formData.order_index) || 0,
        active: formData.active !== false
      };

      if (editingId) {
        await equipmentService.update(editingId, dataToSend);
      } else {
        await equipmentService.create(dataToSend);
      }
      
      handleCloseDialog();
      loadEquipment();
    } catch (err) {
      console.error('Erreur sauvegarde:', err);
      setError(err.message || 'Erreur lors de l\'enregistrement');
    }
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setFormData(defaultFormData);
    setEditingId(null);
    setPreviewImage('');
    setError('');
    setImageTab(0);
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData(defaultFormData);
    setPreviewImage('');
    setError('');
    setImageTab(0);
    setOpen(true);
  };

  return (
    <MainCard title="Gestion des Équipements">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button 
          variant="contained" 
          startIcon={<PlusOutlined />} 
          onClick={handleOpenCreate}
          size="large"
        >
          Nouvel équipement
        </Button>
        <Chip label={`${equipment.length} équipement(s)`} variant="outlined" />
      </Box>

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell width={80}>Image</TableCell>
              <TableCell>Équipement</TableCell>
              <TableCell>Catégorie</TableCell>
              <TableCell>Quantité</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell align="center">Actif</TableCell>
              <TableCell align="right" width={60}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>Chargement...</TableCell>
              </TableRow>
            ) : equipment.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">Aucun équipement</Typography>
                </TableCell>
              </TableRow>
            ) : equipment.map((item) => (
              <TableRow key={item.id} hover>
                <TableCell>
                  <Avatar
                    variant="rounded"
                    src={item.image_url ? getImageUrl(item.image_url) : undefined}
                    sx={{ width: 56, height: 56, bgcolor: 'grey.100' }}
                  >
                    <ToolOutlined style={{ fontSize: 24, color: '#999' }} />
                  </Avatar>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>{item.name}</Typography>
                  {item.description && (
                    <Typography 
                      variant="caption" 
                      color="text.secondary" 
                      sx={{ 
                        display: 'block', 
                        maxWidth: 280, 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        whiteSpace: 'nowrap' 
                      }}
                    >
                      {item.description}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Chip label={item.category} size="small" variant="outlined" />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{item.count_info || '-'}</Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={STATUS_CONFIG[item.status]?.label || item.status}
                    color={STATUS_CONFIG[item.status]?.color || 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <Chip 
                    label={item.active ? 'Oui' : 'Non'} 
                    color={item.active ? 'success' : 'default'} 
                    size="small" 
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={(e) => handleOpenMenu(e, item)}>
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

      {/* Dialog formulaire redesigné */}
      <Dialog open={open} onClose={handleCloseDialog} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
        <DialogTitle sx={{ pb: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <ToolOutlined style={{ fontSize: 20 }} />
            <Typography variant="h6">
              {editingId ? "Modifier l'équipement" : 'Nouvel équipement'}
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
                  <PictureOutlined /> Image de l'équipement
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
                      <img 
                        src={previewImage} 
                        alt="Preview" 
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
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
                      <PictureOutlined style={{ fontSize: 40, color: '#bbb' }} />
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
                      Max 5 Mo (JPG, PNG, GIF, WebP)
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
                {/* Nom et Catégorie */}
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>Informations principales</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={7}>
                      <TextField 
                        fullWidth 
                        label="Nom de l'équipement" 
                        value={formData.name} 
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                        size="small"
                        required
                        placeholder="Ex: Imprimante 3D Prusa MK3S+"
                      />
                    </Grid>
                    <Grid item xs={12} md={5}>
                      <FormControl fullWidth size="small" required>
                        <InputLabel>Catégorie</InputLabel>
                        <Select 
                          value={formData.category} 
                          label="Catégorie"
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                          {CATEGORIES.map(cat => (
                            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
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
                        placeholder="Décrivez cet équipement..."
                      />
                    </Grid>
                  </Grid>
                </Paper>

                {/* Détails supplémentaires */}
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>Détails</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField 
                        fullWidth 
                        label="Quantité / Info" 
                        value={formData.count_info} 
                        onChange={(e) => setFormData({ ...formData, count_info: e.target.value })} 
                        size="small"
                        placeholder="Ex: 3 machines disponibles"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
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
                  </Grid>
                </Paper>

                {/* Statut */}
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>État</Typography>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Statut</InputLabel>
                        <Select 
                          value={formData.status} 
                          label="Statut"
                          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        >
                          <MenuItem value="available">
                            <Chip label="Disponible" color="success" size="small" sx={{ mr: 1 }} />
                          </MenuItem>
                          <MenuItem value="maintenance">
                            <Chip label="En maintenance" color="warning" size="small" sx={{ mr: 1 }} />
                          </MenuItem>
                          <MenuItem value="unavailable">
                            <Chip label="Indisponible" color="error" size="small" sx={{ mr: 1 }} />
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
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
                            Actif <Typography component="span" variant="caption" color="text.secondary">(visible sur le site)</Typography>
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
            disabled={!formData.name.trim() || !formData.category.trim()}
          >
            {editingId ? 'Mettre à jour' : 'Créer l\'équipement'}
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
}
