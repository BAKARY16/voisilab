import { useState, useEffect, useRef } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, Dialog, DialogContent, DialogActions,
  TextField, IconButton, Chip, Paper, Select, MenuItem,
  FormControl, InputLabel, Box, Typography, Card, CardMedia,
  Grid, InputAdornment, Tabs, Tab, CircularProgress, Backdrop,
  Divider, Stack, Snackbar, Alert, Switch, Tooltip
} from '@mui/material';
import {
  EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined,
  SaveOutlined, CloseOutlined, UploadOutlined,
  LinkOutlined, WarningOutlined, CheckCircleOutlined, ReloadOutlined
} from '@ant-design/icons';
import MainCard from 'components/MainCard';
import RichTextField from 'components/RichTextField';
import { blogService, API_URL } from 'api/voisilab';

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState(0); // 0=Liste, 1=Formulaire
  const [formData, setFormData] = useState({
    title: '', slug: '', excerpt: '', content: '',
    featured_image: '', category: '', status: 'draft',
    cta_label: '', cta_url: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  // â”€â”€ Notifications / dialogs â”€â”€
  const [alert, setAlert] = useState({ open: false, title: '', message: '', severity: 'info' });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', message: '', onConfirm: null, onCancel: null });
  const imageFileRef = useRef(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const categories = ['Ã‰vénement', 'Cérémonie', 'Formation', 'Partenariat'];

  useEffect(() => {
    // Charger au démarrage
    loadPosts();

    // Auto-refresh toutes les 30 secondes en arrière-plan (au lieu de 5s)
    const interval = setInterval(() => {
      // Recharger sans afficher le loading
      blogService.getAll()
        .then(result => setPosts(result.data || result || []))
        .catch(() => { }); // Silencieux en arrière-plan
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

  const showAlert = (title, message, ok = false) =>
    setAlert({ open: true, title, message, severity: ok ? 'success' : 'error' });

  const askConfirm = (title, message) => new Promise(resolve => {
    setConfirmDialog({
      open: true, title, message,
      onConfirm: () => { setConfirmDialog(d => ({ ...d, open: false })); resolve(true); },
      onCancel: () => { setConfirmDialog(d => ({ ...d, open: false })); resolve(false); }
    });
  });

  const showConfirmDialog = (title, message) => showAlert(title, message, title === 'Succès');

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showConfirmDialog('Erreur', 'Veuillez sélectionner une image (JPG, PNG, WebP...)', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showConfirmDialog('Erreur', "L'image ne doit pas dépasser 5 MB", 'error');
      return;
    }
    try {
      setUploadingImage(true);
      const fd = new FormData();
      fd.append('file', file);
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/upload/blog`, {
        method: 'POST',
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: fd
      });
      if (!response.ok) throw new Error("Erreur lors de l'upload");
      const data = await response.json();
      const imageUrl = data.url?.startsWith('http') ? data.url : `${API_URL}${data.url}`;
      setFormData((prev) => ({ ...prev, featured_image: imageUrl }));
    } catch (err) {
      showConfirmDialog('Erreur', "Impossible de télécharger l'image : " + (err.message || 'Erreur inconnue'), 'error');
    } finally {
      setUploadingImage(false);
      event.target.value = '';
    }
  };

  const handleSave = async () => {
    try {
      if (!formData.title || !formData.content) {
        showAlert('Champs requis', 'Le titre et le contenu sont requis');
        return;
      }
      setSaving(true);
      if (editingId) {
        await blogService.update(editingId, formData);
        showAlert('Article enregistré', '', true);
      } else {
        await blogService.create(formData);
        showAlert('Article créé', '', true);
      }
      await loadPosts();
      resetForm();
      setActiveTab(0);
    } catch (error) {
      console.error('Erreur:', error);
      showAlert('Erreur', "Impossible d'enregistrer : " + (error.message || 'Erreur inconnue'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    const ok = await askConfirm(
      'Supprimer l\'article',
      `Vous Ãªtes sur le point de supprimer définitivement "${title}". Cette action est irréversible.`
    );
    if (!ok) return;
    try {
      setSaving(true);
      await blogService.delete(id);
      showAlert('Article supprimé', '', true);
      await loadPosts();
    } catch (error) {
      showAlert('Erreur', 'Erreur lors de la suppression : ' + (error.message || 'Erreur inconnue'));
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '', slug: '', excerpt: '', content: '',
      featured_image: '', category: '', status: 'draft',
      cta_label: '', cta_url: ''
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
      status: post.status || 'draft',
      cta_label: post.cta_label || '',
      cta_url: post.cta_url || ''
    });
    setEditingId(post.id);
    setActiveTab(1);
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
      {/* Snackbar alert */}
      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={() => setAlert(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setAlert(prev => ({ ...prev, open: false }))}
          severity={alert.severity}
          variant="filled"
          sx={{ minWidth: 280 }}
        >
          <strong>{alert.title}</strong>{alert.message ? ' â€” ' + alert.message : ''}
        </Alert>
      </Snackbar>

      {/* Backdrop */}
      <Backdrop open={saving} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress color="inherit" size={52} />
          <Typography variant="h6" sx={{ mt: 2 }}>Enregistrement...</Typography>
        </Box>
      </Backdrop>

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
                  <Stack direction="row" spacing={1}>
                    <Button size="small" variant="outlined" startIcon={<ReloadOutlined />} onClick={() => loadPosts()} disabled={loading}>
                      Actualiser
                    </Button>
                    <Button variant="contained" size="small" startIcon={<PlusOutlined />} onClick={handleNewPost} disableElevation>
                      Nouveau
                    </Button>
                  </Stack>
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
                          <Tooltip title="Modifier">
                            <IconButton onClick={() => handleEdit(post)} size="small" color="primary">
                              <EditOutlined />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Supprimer">
                            <IconButton onClick={() => handleDelete(post.id, post.title)} size="small" color="error">
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
          </>
        )}

        {/* TAB 1: FORMULAIRE */}
        {activeTab === 1 && (
          <Box sx={{ pb: 4 }}>
            <Box sx={{ mb: 4, pb: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                {editingId ? "Modifier l'actualité" : 'Nouvelle actualité'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Complétez les informations ci-dessous pour {editingId ? 'modifier' : 'créer'} cette actualité
              </Typography>
            </Box>

            <input ref={imageFileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />

            <Grid container spacing={3}>

              {/* â”€â”€ Ligne 1 : Informations principales | Publication + Catégorie â”€â”€ */}
              <Grid item xs={12} md={6}>
                <Paper elevation={0} variant="outlined" sx={{ p: 3, height: '100%' }}>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2.5 }}>Informations principales</Typography>
                  <Grid container spacing={2.5}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth size="small"
                        label="Titre de l'actualité *"
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value, slug: generateSlug(e.target.value) })}
                        placeholder="Ex : Lancement du nouveau FabLab UVCI"
                        helperText="Ce titre s'affichera en haut de l'actualité"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth size="small"
                        label="Slug (URL)"
                        value={formData.slug}
                        onChange={e => setFormData({ ...formData, slug: e.target.value })}
                        helperText="Généré automatiquement depuis le titre"
                        InputProps={{ startAdornment: <Typography variant="body2" color="text.secondary" sx={{ mr: 1, whiteSpace: 'nowrap' }}>/actualites/</Typography> }}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper elevation={0} variant="outlined" sx={{ p: 3, height: '100%' }}>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>Publication</Typography>
                  <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                    <InputLabel>Statut</InputLabel>
                    <Select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} label="Statut">
                      <MenuItem value="draft">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'warning.main' }} />
                          Brouillon
                        </Box>
                      </MenuItem>
                      <MenuItem value="published">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main' }} />
                          Publié
                        </Box>
                      </MenuItem>
                    </Select>
                  </FormControl>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1, bgcolor: formData.status === 'published' ? '#f0fdf4' : 'background.paper', transition: 'background-color 0.2s', mb: 2 }}>
                    <Box>
                      <Typography variant="body2" fontWeight={500}>{formData.status === 'published' ? 'Publié' : 'Brouillon'}</Typography>
                      <Typography variant="caption" color="text.secondary">{formData.status === 'published' ? 'Visible sur le site' : 'Non visible'}</Typography>
                    </Box>
                    <Switch checked={formData.status === 'published'} onChange={e => setFormData({ ...formData, status: e.target.checked ? 'published' : 'draft' })} color="success" />
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>Catégorie</Typography>
                  <FormControl fullWidth size="small">
                    <InputLabel>Catégorie</InputLabel>
                    <Select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} label="Catégorie">
                      <MenuItem value=""><em>Aucune</em></MenuItem>
                      {categories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Paper>
              </Grid>

              {/* â”€â”€ Ligne 2 : Contenu (pleine largeur) â”€â”€ */}
              <Grid item xs={12}>
                <Paper elevation={0} variant="outlined" sx={{ p: 3 }}>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2.5 }}>Contenu</Typography>
                  <Stack spacing={2.5}>
                    <RichTextField
                      label="Extrait / Résumé"
                      value={formData.excerpt}
                      onChange={val => setFormData({ ...formData, excerpt: val })}
                      rows={3}
                      placeholder="Résumé court pour la liste (150-200 caractères recommandés)"
                      helperText={`${(formData.excerpt?.replace(/<[^>]*>/g, '') || '').length} caractères`}
                    />
                    <RichTextField
                      label="Contenu complet *"
                      value={formData.content}
                      onChange={val => setFormData({ ...formData, content: val })}
                      rows={14}
                      placeholder="Rédigez le contenu complet de votre actualité..."
                      helperText="Utilisez Gras et les icônes pour mettre en forme. Les sauts de ligne sont conservés."
                    />
                  </Stack>
                </Paper>
              </Grid>

              {/* â”€â”€ Ligne 3 : Image | Bouton personnalisé â”€â”€ */}
              <Grid item xs={12} md={6}>
                <Paper elevation={0} variant="outlined" sx={{ p: 3, height: '100%' }}>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>Image à la une</Typography>
                  <Button
                    variant="outlined" fullWidth
                    startIcon={uploadingImage ? <CircularProgress size={16} /> : <UploadOutlined />}
                    onClick={() => imageFileRef.current?.click()}
                    disabled={uploadingImage}
                    sx={{ mb: 1.5 }}
                  >
                    {uploadingImage ? 'Téléchargement...' : 'Choisir depuis le disque'}
                  </Button>
                  <TextField
                    fullWidth size="small" label="Ou coller une URL"
                    value={formData.featured_image}
                    onChange={e => setFormData({ ...formData, featured_image: e.target.value })}
                    placeholder="https://..."
                    sx={{ mb: 2 }}
                  />
                  <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, overflow: 'hidden', bgcolor: 'grey.50', height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {formData.featured_image ? (
                      <CardMedia
                        component="img" image={formData.featured_image} alt="Aperçu de l'image"
                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={e => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <Typography variant="caption" color="text.disabled">Aperçu de l'image</Typography>
                    )}
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper elevation={0} variant="outlined" sx={{ p: 3, height: '100%' }}>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 0.5 }}>
                    <LinkOutlined style={{ marginRight: 8 }} />
                    Bouton personnalisé (optionnel)
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2.5 }}>
                    Ce bouton apparaitra sur la page de détail de l'actualité.
                  </Typography>
                  <Grid container spacing={2.5}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth size="small"
                        label="Texte du bouton"
                        value={formData.cta_label}
                        onChange={e => setFormData({ ...formData, cta_label: e.target.value })}
                        placeholder="Ex : Lire la suite sur notre site"
                        inputProps={{ maxLength: 60 }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth size="small"
                        label="Lien URL"
                        value={formData.cta_url}
                        onChange={e => setFormData({ ...formData, cta_url: e.target.value })}
                        placeholder="https://..."
                        InputProps={{ startAdornment: <InputAdornment position="start"><LinkOutlined /></InputAdornment> }}
                      />
                    </Grid>
                  </Grid>
                  {formData.cta_label?.trim() && formData.cta_url?.trim() && (
                    <Box sx={{ mt: 2.5 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>AperÃ§u :</Typography>
                      <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 2, py: 1, border: '1px solid', borderColor: 'primary.main', borderRadius: 1, color: 'primary.main', fontSize: 14, fontWeight: 500 }}>
                        <LinkOutlined style={{ fontSize: 14 }} />
                        {formData.cta_label}
                      </Box>
                    </Box>
                  )}
                </Paper>
              </Grid>

            </Grid>

            {/* Boutons d'action */}
            <Box sx={{ position: 'sticky', bottom: 0, mt: 4, pt: 3, pb: 2, display: 'flex', gap: 2, justifyContent: 'flex-end', alignItems: 'center', borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
              <Button variant="outlined" onClick={() => { resetForm(); setActiveTab(0); }} startIcon={<CloseOutlined />} sx={{ minWidth: 120 }}>Annuler</Button>
              <Button variant="contained" onClick={handleSave} startIcon={<SaveOutlined />} disabled={saving} disableElevation sx={{ minWidth: 160 }}>
                {editingId ? 'Enregistrer' : 'Publier'}
              </Button>
            </Box>
          </Box>
        )}
      </MainCard>

      {/* â•â•â• DIALOG DE CONFIRMATION â•â•â• */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => confirmDialog.onCancel?.()}
        maxWidth="xs" fullWidth
        PaperProps={{ sx: { borderRadius: 3, overflow: 'hidden' } }}
      >
        <Box sx={{ height: 6, bgcolor: 'error.main' }} />
        <DialogContent sx={{ pt: 4, pb: 2, textAlign: 'center' }}>
          <Box sx={{ width: 60, height: 60, borderRadius: '50%', mx: 'auto', mb: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#fef2f2' }}>
            <WarningOutlined style={{ fontSize: 28, color: '#ef4444' }} />
          </Box>
          <Typography variant="h6" fontWeight={700} gutterBottom>{confirmDialog.title}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>{confirmDialog.message}</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1, justifyContent: 'center' }}>
          <Button variant="outlined" onClick={() => confirmDialog.onCancel?.()} sx={{ minWidth: 110, borderRadius: 2 }}>Annuler</Button>
          <Button variant="contained" color="error" onClick={() => confirmDialog.onConfirm?.()} disableElevation sx={{ minWidth: 110, borderRadius: 2 }}>Supprimer</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
