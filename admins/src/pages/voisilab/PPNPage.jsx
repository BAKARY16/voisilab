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
  Grid,
  InputAdornment,
  Tabs,
  Tab,
  CircularProgress,
  Backdrop
} from '@mui/material';
import { 
  EditOutlined, 
  DeleteOutlined, 
  PlusOutlined, 
  SearchOutlined, 
  EyeOutlined,
  SaveOutlined, 
  CloseOutlined 
} from '@ant-design/icons';
import MainCard from 'components/MainCard';
import { ppnService } from 'api/voisilab';

export default function PPNPage() {
  const [ppns, setPpns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState(0); // 0=Liste, 1=Formulaire
  const [formData, setFormData] = useState({
   name: '',
    city: '',
    region: '',
    address: '',
    type: 'Urban',
    latitude: '',
    longitude: '',
    services: '',
    email: '',
    phone: '',
    manager: '',
    opening_year: new Date().getFullYear(),
    status: 'planned',
    image: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', message: '', type: '' });

  const types = ['Urban', 'Rural', 'Mixed'];
  const statuses = [
    { value: 'planned', label: 'Planifié', color: 'default' },
    { value: 'construction', label: 'En construction', color: 'warning' },
    { value: 'active', label: 'Actif', color: 'success' }
  ];

  useEffect(() => {
    loadPpns();
    
    // Auto-refresh toutes les 30 secondes
    const interval = setInterval(() => {
      ppnService.getAll()
        .then(result => setPpns(result.data || result || []))
        .catch(() => {});
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const loadPpns = async () => {
    try {
      setLoading(true);
      const result = await ppnService.getAll();
      setPpns(result.data || result || []);
    } catch (error) {
      console.error('Erreur:', error);
      showConfirmDialog('Erreur', 'Erreur lors du chargement: ' + (error.message || 'Erreur inconnue'), 'error');
      setPpns([]);
    } finally {
      setLoading(false);
    }
  };

  const showConfirmDialog = (title, message, type) => {
    setConfirmDialog({ open: true, title, message, type });
  };

  const handleSave = async () => {
    try {
      if (!formData.name || !formData.city || !formData.region) {
        showConfirmDialog('Erreur', 'Le nom, la ville et la région sont requis', 'error');
        return;
      }

      setSaving(true);

      // Préparer les données
      const dataToSave = {
        ...formData,
        latitude: parseFloat(formData.latitude) || 0,
        longitude: parseFloat(formData.longitude) || 0,
        opening_year: parseInt(formData.opening_year) || new Date().getFullYear()
      };

      if (editingId) {
        await ppnService.update(editingId, dataToSave);
        showConfirmDialog('Succès', 'PPN modifié avec succès !', 'success');
      } else {
        await ppnService.create(dataToSave);
        showConfirmDialog('Succès', 'PPN créé avec succès !', 'success');
      }
      
      await loadPpns();
      resetForm();
      setActiveTab(0);
    } catch (error) {
      console.error('Erreur:', error);
      showConfirmDialog('Erreur', 'Erreur lors de l\'enregistrement: ' + (error.message || 'Erreur inconnue'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce PPN ?')) return;

    try {
      setSaving(true);
      await ppnService.delete(id);
      showConfirmDialog('Succès', 'PPN supprimé avec succès !', 'success');
      await loadPpns();
    } catch (error) {
      console.error('Erreur:', error);
      showConfirmDialog('Erreur', 'Erreur lors de la suppression: ' + (error.message || 'Erreur inconnue'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      city: '',
      region: '',
      address: '',
      type: 'Urban',
      latitude: '',
      longitude: '',
      services: '',
      email: '',
      phone: '',
      manager: '',
      opening_year: new Date().getFullYear(),
      status: 'planned',
      image: ''
    });
    setEditingId(null);
  };

  const handleEdit = (ppn) => {
    setFormData({
      name: ppn.name || '',
      city: ppn.city || '',
      region: ppn.region || '',
      address: ppn.address || '',
      type: ppn.type || 'Urban',
      latitude: ppn.latitude?.toString() || '',
      longitude: ppn.longitude?.toString() || '',
      services: ppn.services || '',
      email: ppn.email || '',
      phone: ppn.phone || '',
      manager: ppn.manager || '',
      opening_year: ppn.opening_year || new Date().getFullYear(),
      status: ppn.status || 'planned',
      image: ppn.image || ''
    });
    setEditingId(ppn.id);
    setActiveTab(1);
  };

  const handleNewPpn = () => {
    resetForm();
    setActiveTab(1);
  };

  const filteredPpns = ppns.filter((ppn) => {
    const matchesSearch =
      searchQuery === '' ||
      ppn.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ppn.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ppn.region?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || ppn.type === filterType;
    const matchesStatus = filterStatus === 'all' || ppn.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <>
      <Backdrop open={saving} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress color="inherit" size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Enregistrement en cours...
          </Typography>
        </Box>
      </Backdrop>

      <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}>
        <DialogTitle>
          <Typography variant="h6" component="div">
            {confirmDialog.type === 'success' ? '✅' : '❌'} {confirmDialog.title}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography>{confirmDialog.message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ ...confirmDialog, open: false })} variant="contained">
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <MainCard title="Gestion des Points PPN">
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab label={`Liste des PPN (${ppns.length})`} icon={<EyeOutlined />} iconPosition="start" />
            <Tab
              label={editingId ? 'Modifier le PPN' : 'Nouveau PPN'}
              icon={editingId ? <EditOutlined /> : <PlusOutlined />}
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {/* TAB 0: LISTE */}
        {activeTab === 0 && (
          <>
            <Box sx={{ mb: 3 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
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
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Type</InputLabel>
                    <Select value={filterType} onChange={(e) => setFilterType(e.target.value)} label="Type">
                      <MenuItem value="all">Tous</MenuItem>
                      {types.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Statut</InputLabel>
                    <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} label="Statut">
                      <MenuItem value="all">Tous</MenuItem>
                      {statuses.map((status) => (
                        <MenuItem key={status.value} value={status.value}>
                          {status.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <Button variant="contained" startIcon={<PlusOutlined />} onClick={handleNewPpn} fullWidth>
                    Nouveau
                  </Button>
                </Grid>
              </Grid>
            </Box>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nom</TableCell>
                    <TableCell>Ville / Région</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Statut</TableCell>
                    <TableCell>Année d'ouverture</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                        <CircularProgress />
                        <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                          Chargement des PPN...
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : filteredPpns.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                        <Typography variant="body2" color="textSecondary">
                          Aucun PPN trouvé
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPpns.map((ppn) => (
                      <TableRow key={ppn.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>
                            {ppn.name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {ppn.manager && `Géré par ${ppn.manager}`}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{ppn.city}</Typography>
                          <Typography variant="caption" color="textSecondary">
                            {ppn.region}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={ppn.type} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={statuses.find((s) => s.value === ppn.status)?.label || ppn.status}
                            color={statuses.find((s) => s.value === ppn.status)?.color || 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{ppn.opening_year}</TableCell>
                        <TableCell align="right">
                          <IconButton onClick={() => handleEdit(ppn)} size="small" color="primary">
                            <EditOutlined />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(ppn.id)} size="small" color="error">
                            <DeleteOutlined />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {/* TAB 1: FORMULAIRE */}
        {activeTab === 1 && (
          <Box sx={{ pb: 4 }}>
            <Box sx={{ mb: 4, pb: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                {editingId ? 'Modifier le PPN' : 'Nouveau PPN'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Complétez les informations ci-dessous pour {editingId ? 'modifier' : 'créer'} un point PPN
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {/* Colonne gauche */}
              <Grid item xs={12} md={8} lg={9}>
                <Paper elevation={0} variant="outlined" sx={{ p: 3, mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2.5 }}>
                    Informations générales
                  </Typography>

                  <Grid container spacing={2.5}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Nom du PPN"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        variant="outlined"
                        placeholder="Ex: PPN Bassam"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Ville"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        required
                        variant="outlined"
                        placeholder="Ex: Abidjan"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Région"
                        value={formData.region}
                        onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                        required
                        variant="outlined"
                        placeholder="Ex: Sud-Comoé"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Gestionnaire"
                        value={formData.manager}
                        onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                        variant="outlined"
                        placeholder="Ex: Dr. Kouassi"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Adresse complète"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        variant="outlined"
                        placeholder="Ex: Grand Bassam, près de la mairie"
                      />
                    </Grid>
                  </Grid>
                </Paper>

                <Paper elevation={0} variant="outlined" sx={{ p: 3, mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2.5 }}>
                    Coordonnées géographiques
                  </Typography>

                  <Grid container spacing={2.5}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Latitude"
                        type="number"
                        value={formData.latitude}
                        onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                        variant="outlined"
                        placeholder="Ex: 5.2198417"
                        inputProps={{ step: 'any' }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Longitude"
                        type="number"
                        value={formData.longitude}
                        onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                        variant="outlined"
                        placeholder="Ex: -3.7560239"
                        inputProps={{ step: 'any' }}
                      />
                    </Grid>
                  </Grid>
                </Paper>

                <Paper elevation={0} variant="outlined" sx={{ p: 3 }}>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2.5 }}>
                    Contact
                  </Typography>

                  <Grid container spacing={2.5}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        variant="outlined"
                        placeholder="ppn@voisilab.ci"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Téléphone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        variant="outlined"
                        placeholder="+225 XX XX XX XX XX"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Services disponibles"
                        value={formData.services}
                        onChange={(e) => setFormData({ ...formData, services: e.target.value })}
                        multiline
                        rows={3}
                        variant="outlined"
                        placeholder="Ex: Formation numérique, Hub technologique, Coworking, Impression 3D (séparés par des virgules)"
                        helperText="Séparez les services par des virgules"
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Colonne droite */}
              <Grid item xs={12} md={4} lg={3}>
                <Paper elevation={0} variant="outlined" sx={{ p: 3, mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2.5 }}>
                    Type et statut
                  </Typography>

                  <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                    <InputLabel>Type</InputLabel>
                    <Select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      label="Type"
                    >
                      {types.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                    <InputLabel>Statut</InputLabel>
                    <Select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      label="Statut"
                    >
                      {statuses.map((status) => (
                        <MenuItem key={status.value} value={status.value}>
                          {status.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    fullWidth
                    label="Année d'ouverture"
                    type="number"
                    value={formData.opening_year}
                    onChange={(e) => setFormData({ ...formData, opening_year: e.target.value })}
                    variant="outlined"
                    inputProps={{ min: 2000, max: 2100 }}
                  />
                </Paper>

                <Paper elevation={0} variant="outlined" sx={{ p: 3 }}>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2.5 }}>
                    Image
                  </Typography>

                  <TextField
                    fullWidth
                    label="URL de l'image"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://..."
                    variant="outlined"
                    size="small"
                    sx={{ mb: 2 }}
                  />

                  {formData.image && (
                    <Box
                      sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        overflow: 'hidden',
                        bgcolor: 'grey.50'
                      }}
                    >
                      <img
                        src={formData.image}
                        alt="Prévisualisation"
                        style={{
                          width: '100%',
                          height: 'auto',
                          maxHeight: 200,
                          objectFit: 'cover',
                          display: 'block'
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </Box>
                  )}
                </Paper>
              </Grid>
            </Grid>

            <Box
              sx={{
                position: 'sticky',
                bottom: 0,
                mt: 4,
                pt: 3,
                pb: 2,
                display: 'flex',
                gap: 2,
                justifyContent: 'flex-end',
                alignItems: 'center',
                borderTop: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper'
              }}
            >
              <Button
                variant="outlined"
                size="medium"
                onClick={() => {
                  resetForm();
                  setActiveTab(0);
                }}
                startIcon={<CloseOutlined />}
                sx={{ minWidth: 120 }}
              >
                Annuler
              </Button>

              <Button
                variant="contained"
                size="medium"
                onClick={handleSave}
                startIcon={<SaveOutlined />}
                disabled={saving}
                sx={{ minWidth: 160 }}
              >
                {editingId ? 'Enregistrer' : 'Créer le PPN'}
              </Button>
            </Box>
          </Box>
        )}
      </MainCard>
    </>
  );
}
