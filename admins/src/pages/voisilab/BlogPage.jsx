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
  Divider
} from '@mui/material';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined, EyeOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';
import { blogService } from 'api/voisilab';
import { padding, width } from '@mui/system';

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState(0); // 0=Liste, 1=Formulaire
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: '',
    category: '',
    status: 'draft'
  });
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', message: '', type: '' });

  const categories = ['Événement', 'Cérémonie', 'Formation', 'Partenariat'];

  useEffect(() => {
    // Charger au démarrage
    loadPosts();
    
    // Auto-refresh toutes les 30 secondes en arrière-plan (au lieu de 5s)
    const interval = setInterval(() => {
      // Recharger sans afficher le loading
      blogService.getAll()
        .then(result => setPosts(result.data || result || []))
        .catch(() => {}); // Silencieux en arrière-plan
    }, 30000); // 30 secondes
    
    return () => clearInterval(interval);
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const result = await blogService.getAll();
      setPosts(result.data || result || []);
    } catch (error) {
      console.error('Erreur:', error);
      showNotification('Erreur lors du chargement: ' + (error.message || 'Erreur inconnue'), 'error');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title) =>
    title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  const showConfirmDialog = (title, message, type) => {
    setConfirmDialog({ open: true, title, message, type });
  };

  const handleSave = async () => {
    try {
      if (!formData.title || !formData.content) {
        showConfirmDialog('Erreur', 'Le titre et le contenu sont requis', 'error');
        return;
      }

      setSaving(true);

      if (editingId) {
        await blogService.update(editingId, formData);
        showConfirmDialog('Succès', 'Article modifié avec succès !', 'success');
      } else {
        await blogService.create(formData);
        showConfirmDialog('Succès', 'Article créé avec succès !', 'success');
      }
      
      await loadPosts();
      resetForm();
      setActiveTab(0); // Retour à la liste
    } catch (error) {
      console.error('Erreur:', error);
      showConfirmDialog('Erreur', 'Erreur lors de l\'enregistrement: ' + (error.message || 'Erreur inconnue'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setSaving(true);
      await blogService.delete(id);
      showConfirmDialog('Succès', 'Article supprimé avec succès !', 'success');
      await loadPosts();
    } catch (error) {
      console.error('Erreur:', error);
      showConfirmDialog('Erreur', 'Erreur lors de la suppression: ' + (error.message || 'Erreur inconnue'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      featured_image: '',
      category: '',
      status: 'draft'
    });
    setEditingId(null);
  };

  const handleEdit = (post) => {
    setFormData({
      title: post.title || '',
      slug: post.slug || '',
      excerpt: post.excerpt || '',
      content: post.content || '',
      featured_image: post.featured_image || '',
      category: post.category || '',
      status: post.status || 'draft'
    });
    setEditingId(post.id);
    setActiveTab(1); // Aller au formulaire
  };

  const handleNewPost = () => {
    resetForm();
    setActiveTab(1); // Aller au formulaire
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      searchQuery === '' ||
      post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || post.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || post.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <>
      {/* Backdrop Loading */}
      <Backdrop open={saving} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress color="inherit" size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Enregistrement en cours...
          </Typography>
        </Box>
      </Backdrop>

      {/* Dialog de confirmation */}
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

      <MainCard title="Gestion des Actualités">
        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab label={`Liste des actualités (${posts.length})`} />
            <Tab 
              label={editingId ? "Modifier l'actualité" : "Nouvelle actualité"} 
              icon={editingId ? <EditOutlined /> : <PlusOutlined />}
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {/* TAB 0: LISTE */}
        {activeTab === 0 && (
          <>
            {/* Filtres */}
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
                    <InputLabel>Statut</InputLabel>
                    <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} label="Statut">
                      <MenuItem value="all">Tous</MenuItem>
                      <MenuItem value="published">Publiés</MenuItem>
                      <MenuItem value="draft">Brouillons</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Catégorie</InputLabel>
                    <Select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} label="Catégorie">
                      <MenuItem value="all">Toutes</MenuItem>
                      {categories.map((cat) => (
                        <MenuItem key={cat} value={cat}>
                          {cat}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <Button variant="contained" startIcon={<PlusOutlined />} onClick={handleNewPost} fullWidth>
                    Nouveau
                  </Button>
                </Grid>
              </Grid>
            </Box>

            {/* Table */}
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Image</TableCell>
                    <TableCell>Titre</TableCell>
                    <TableCell>Catégorie</TableCell>
                    <TableCell>Statut</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                        <CircularProgress />
                        <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                          Chargement des actualités...
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : filteredPosts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                        <Typography variant="body2" color="textSecondary">
                          Aucune actualité trouvée
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPosts.map((post) => (
                      <TableRow key={post.id} hover>
                        <TableCell>
                          {post.featured_image && (
                            <Card sx={{ width: 60, height: 45 }}>
                              <CardMedia
                                component="img"
                                image={post.featured_image}
                                alt={post.title}
                                sx={{ objectFit: 'cover', width: '100%', height: '100%' }}
                              />
                            </Card>
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>
                            {post.title}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            /{post.slug}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={post.category || 'Non catégorisé'} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={post.status === 'published' ? 'Publié' : 'Brouillon'}
                            color={post.status === 'published' ? 'success' : 'warning'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(post.created_at || post.published_at).toLocaleDateString('fr-FR')}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton onClick={() => handleEdit(post)} size="small" color="primary">
                            <EditOutlined />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(post.id)} size="small" color="error">
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
            {/* En-tête du formulaire */}
            <Box sx={{ mb: 4, pb: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                {editingId ? 'Modifier l\'actualité' : 'Nouvelle actualité'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Complétez les informations ci-dessous pour {editingId ? 'modifier' : 'créer'} votre actualité
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {/* Colonne gauche - Informations principales */}
              <Grid item xs={12} md={8} lg={9}>
                {/* Section Titre et Slug */}
                <Paper elevation={0} variant="outlined" sx={{ p: 3, mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2.5 }}>
                    Informations principales
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2.5, width: '100%' }}>
                    <TextField
                      fullWidth
                      label="Titre de l'actualité"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          title: e.target.value,
                          slug: generateSlug(e.target.value)
                        })
                      }
                      required
                      variant="outlined"
                      placeholder="Ex: Lancement du nouveau FabLab UVCI"
                      helperText="Le titre s'affichera en haut de l'actualité"
                    />
                    
                    <TextField
                      fullWidth
                      label="Slug (URL)"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      required
                      variant="outlined"
                      helperText="URL conviviale générée automatiquement"
                      InputProps={{
                        startAdornment: (
                          <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                            /actualites/
                          </Typography>
                        )
                      }}
                    />
                  </Box>
                </Paper>

                {/* Section Contenu */}
                <Paper elevation={0} variant="outlined" sx={{ p: 3, mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2.5 }}>
                    Contenu
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <TextField
                      fullWidth
                      label="Extrait / Résumé"
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      multiline
                      rows={3}
                      variant="outlined"
                      placeholder="Résumé court pour la liste (recommandé 150-200 caractères)"
                      helperText={`${formData.excerpt?.length || 0} caractères`}
                    />
                    
                    <TextField
                      fullWidth
                      label="Contenu complet"
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      multiline
                      rows={14}
                      required
                      variant="outlined"
                      placeholder="Rédigez le contenu complet de votre actualité ici..."
                      helperText="Vous pouvez utiliser du HTML pour la mise en forme"
                      sx={{ 
                        '& textarea': { fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem', lineHeight: 1.6 }
                      }}
                    />
                  </Box>
                </Paper>
              </Grid>

              {/* Colonne droite - Paramètres */}
              <Grid item xs={12} md={4} lg={3}>
                {/* Section Publication */}
                <Paper elevation={0} variant="outlined" sx={{ p: 3, mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2.5 }}>
                    Publication
                  </Typography>

                  <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                    <InputLabel>Statut</InputLabel>
                    <Select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      label="Statut"
                    >
                      <MenuItem value="draft">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'warning.main' }} />
                          <span>Brouillon</span>
                        </Box>
                      </MenuItem>
                      <MenuItem value="published">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main' }} />
                          <span>Publié</span>
                        </Box>
                      </MenuItem>
                    </Select>
                  </FormControl>

                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    {formData.status === 'published' 
                      ? 'Cette actualité sera visible publiquement' 
                      : 'Cette actualité ne sera pas visible publiquement'}
                  </Typography>
                </Paper>

                {/* Section Catégorie */}
                <Paper elevation={0} variant="outlined" sx={{ p: 3, mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2.5 }}>
                    Catégorie
                  </Typography>

                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Catégorie</InputLabel>
                    <Select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      label="Catégorie"
                    >
                      <MenuItem value="">
                        <em>Aucune catégorie</em>
                      </MenuItem>
                      {categories.map((cat) => (
                        <MenuItem key={cat} value={cat}>
                          {cat}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Paper>

                {/* Section Image */}
                <Paper elevation={0} variant="outlined" sx={{ p: 3 }}>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2.5 }}>
                    Image à la une
                  </Typography>

                  <TextField
                    fullWidth
                    label="URL de l'image"
                    value={formData.featured_image}
                    onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                    placeholder="https://..."
                    variant="outlined"
                    size="small"
                    sx={{ mb: 2 }}
                  />

                  {formData.featured_image && (
                    <Box
                      sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        overflow: 'hidden',
                        bgcolor: 'grey.50'
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={formData.featured_image}
                        alt="Prévisualisation"
                        sx={{ 
                          width: '100%', 
                          height: 'auto', 
                          maxHeight: 200,
                          objectFit: 'cover'
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

            {/* Boutons d'action fixés en bas */}
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
                {editingId ? 'Enregistrer' : 'Publier'}
              </Button>
            </Box>
          </Box>
        )}
      </MainCard>
    </>
  );
}
