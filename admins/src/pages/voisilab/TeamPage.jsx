import { useState, useEffect, useRef } from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, IconButton, Chip, Paper, Grid, TextField, FormControl, InputLabel, Select,
  MenuItem, Switch, FormControlLabel, Typography, Avatar, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions, Menu, Tabs, Tab, Stack
} from '@mui/material';
import { 
  EditOutlined, DeleteOutlined, PlusOutlined, TeamOutlined, UploadOutlined,
  LinkedinOutlined, TwitterOutlined, MailOutlined, MoreOutlined,
  CloseOutlined, UserOutlined, LinkOutlined, PictureOutlined
} from '@ant-design/icons';
import MainCard from 'components/MainCard';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3500';

const ROLES = [
  'Directeur',
  'Fab Manager',
  'Formateur',
  'Chef equipe et Project Manager',
  'Developpeur Full-stack',
  'Designer',
  'Modelisation 3D et Impression',
  'Modelisateur 3D et VFX Artiste',
  'Responsable Technique',
  'Chargé de Communication',
  'Bénévole',
  'Stagiaire',
  'Autre'
];

const defaultFormData = {
  name: '',
  role: '',
  bio: '',
  avatar_url: '',
  email: '',
  linkedin_url: '',
  twitter_url: '',
  order_index: 0,
  active: true
};

export default function TeamPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [imageTab, setImageTab] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => { loadMembers(); }, []);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/team/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      setMembers(result.data || []);
    } catch (err) {
      console.error('Erreur chargement:', err);
      setError('Erreur lors du chargement de l\'équipe');
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${API_URL}${url}`;
  };

  const handleOpenMenu = (event, member) => {
    setMenuAnchor(event.currentTarget);
    setSelectedMember(member);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
    setSelectedMember(null);
  };

  const handleEdit = () => {
    if (selectedMember) {
      setEditingId(selectedMember.id);
      setFormData({
        name: selectedMember.name || '',
        role: selectedMember.role || '',
        bio: selectedMember.bio || '',
        avatar_url: selectedMember.avatar_url || '',
        email: selectedMember.email || '',
        linkedin_url: selectedMember.linkedin_url || '',
        twitter_url: selectedMember.twitter_url || '',
        order_index: selectedMember.order_index || 0,
        active: selectedMember.active !== false
      });
      setPreviewImage(selectedMember.avatar_url ? getImageUrl(selectedMember.avatar_url) : '');
      setImageTab(selectedMember.avatar_url?.startsWith('http') ? 1 : 0);
      setOpen(true);
    }
    handleCloseMenu();
  };

  const handleDelete = async () => {
    if (!selectedMember || !window.confirm(`Supprimer "${selectedMember.name}" de l'équipe ?`)) {
      handleCloseMenu();
      return;
    }
    try {
      const token = sessionStorage.getItem('token');
      await fetch(`${API_URL}/api/team/${selectedMember.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      loadMembers();
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
      const response = await fetch(`${API_URL}/api/upload/team`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: uploadFormData
      });

      if (!response.ok) throw new Error('Erreur upload');

      const result = await response.json();
      setFormData(prev => ({ ...prev, avatar_url: result.url }));
      setPreviewImage(getImageUrl(result.url));
    } catch (err) {
      console.error('Erreur upload:', err);
      setError('Erreur lors de l\'upload de l\'image');
    } finally {
      setUploading(false);
    }
  };

  const handleUrlChange = (url) => {
    setFormData(prev => ({ ...prev, avatar_url: url }));
    setPreviewImage(url);
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, avatar_url: '' }));
    setPreviewImage('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = async () => {
    setError('');
    
    if (!formData.name.trim()) {
      setError('Le nom est requis');
      return;
    }
    if (!formData.role.trim()) {
      setError('Le rôle est requis');
      return;
    }

    try {
      const token = sessionStorage.getItem('token');
      const dataToSend = {
        name: formData.name.trim(),
        role: formData.role.trim(),
        bio: formData.bio?.trim() || '',
        avatar_url: formData.avatar_url?.trim() || '',
        email: formData.email?.trim() || '',
        linkedin_url: formData.linkedin_url?.trim() || '',
        twitter_url: formData.twitter_url?.trim() || '',
        order_index: parseInt(formData.order_index) || 0,
        active: formData.active !== false
      };

      const url = editingId 
        ? `${API_URL}/api/team/${editingId}`
        : `${API_URL}/api/team`;
      
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
      loadMembers();
    } catch (err) {
      console.error('Erreur sauvegarde:', err);
      setError(err.message || 'Erreur lors de l\'enregistrement');
    }
  };

  const handleToggleActive = async (member) => {
    try {
      const token = sessionStorage.getItem('token');
      await fetch(`${API_URL}/api/team/${member.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ active: !member.active })
      });
      loadMembers();
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
    <MainCard title="Gestion de l'Équipe">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button 
          variant="contained" 
          startIcon={<PlusOutlined />} 
          onClick={handleOpenCreate}
          size="large"
        >
          Nouveau membre
        </Button>
        <Chip label={`${members.length} membre(s)`} variant="outlined" />
      </Box>

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell width={80}>Photo</TableCell>
              <TableCell>Membre</TableCell>
              <TableCell>Rôle</TableCell>
              <TableCell>Contact</TableCell>
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
            ) : members.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <TeamOutlined style={{ fontSize: 40, color: '#ccc' }} />
                  <Typography color="text.secondary" sx={{ mt: 1 }}>Aucun membre</Typography>
                </TableCell>
              </TableRow>
            ) : members.map((member) => (
              <TableRow key={member.id} hover>
                <TableCell>
                  <Avatar
                    src={member.avatar_url ? getImageUrl(member.avatar_url) : undefined}
                    sx={{ width: 56, height: 56, bgcolor: 'primary.main' }}
                  >
                    {member.name?.charAt(0)}
                  </Avatar>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>{member.name}</Typography>
                  {member.bio && (
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
                      {member.bio}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Chip label={member.role} size="small" variant="outlined" />
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={0.5}>
                    {member.email && (
                      <IconButton size="small" href={`mailto:${member.email}`}>
                        <MailOutlined style={{ fontSize: 16 }} />
                      </IconButton>
                    )}
                    {member.linkedin_url && (
                      <IconButton size="small" href={member.linkedin_url} target="_blank">
                        <LinkedinOutlined style={{ fontSize: 16 }} />
                      </IconButton>
                    )}
                    {member.twitter_url && (
                      <IconButton size="small" href={member.twitter_url} target="_blank">
                        <TwitterOutlined style={{ fontSize: 16 }} />
                      </IconButton>
                    )}
                    {!member.email && !member.linkedin_url && !member.twitter_url && (
                      <Typography variant="caption" color="text.secondary">-</Typography>
                    )}
                  </Stack>
                </TableCell>
                <TableCell align="center">
                  <Chip label={member.order_index} size="small" />
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={member.active ? 'Actif' : 'Inactif'}
                    color={member.active ? 'success' : 'default'}
                    size="small"
                    onClick={() => handleToggleActive(member)}
                    sx={{ cursor: 'pointer' }}
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={(e) => handleOpenMenu(e, member)}>
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
            <UserOutlined style={{ fontSize: 20 }} />
            <Typography variant="h6">
              {editingId ? 'Modifier le membre' : 'Nouveau membre'}
            </Typography>
          </Stack>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 3 }}>
          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
          
          <Grid container spacing={3}>
            {/* Section Photo */}
            <Grid item xs={12} md={4}>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, height: '100%' }}>
                <Typography variant="subtitle2" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PictureOutlined /> Photo de profil
                </Typography>
                
                {/* Preview */}
                <Box 
                  sx={{ 
                    width: '100%', 
                    height: 200, 
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
                      <Avatar 
                        src={previewImage} 
                        sx={{ width: 150, height: 150 }}
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
                      <UserOutlined style={{ fontSize: 50, color: '#bbb' }} />
                      <Typography variant="caption" color="text.secondary">Aucune photo</Typography>
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
                      {uploading ? 'Upload...' : 'Choisir une photo'}
                    </Button>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, textAlign: 'center' }}>
                      Max 5 Mo (JPG, PNG, GIF, WebP)
                    </Typography>
                  </Box>
                ) : (
                  <TextField
                    fullWidth
                    size="small"
                    label="URL de la photo"
                    placeholder="https://..."
                    value={formData.avatar_url?.startsWith('http') ? formData.avatar_url : ''}
                    onChange={(e) => handleUrlChange(e.target.value)}
                  />
                )}
              </Paper>
            </Grid>

            {/* Section Informations */}
            <Grid item xs={12} md={8}>
              <Stack spacing={2.5}>
                {/* Identité */}
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>Identité</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={7}>
                      <TextField 
                        fullWidth 
                        label="Nom complet" 
                        value={formData.name} 
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                        size="small"
                        required
                        placeholder="Ex: Jean Dupont"
                      />
                    </Grid>
                    <Grid item xs={12} md={5}>
                      <FormControl fullWidth size="small" required>
                        <InputLabel>Rôle</InputLabel>
                        <Select 
                          value={formData.role} 
                          label="Rôle"
                          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        >
                          {ROLES.map(role => (
                            <MenuItem key={role} value={role}>{role}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField 
                        fullWidth 
                        label="Biographie" 
                        value={formData.bio} 
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })} 
                        multiline 
                        rows={3}
                        size="small"
                        placeholder="Quelques mots sur ce membre..."
                      />
                    </Grid>
                  </Grid>
                </Paper>

                {/* Contact */}
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>Contact & Réseaux sociaux</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField 
                        fullWidth 
                        label="Email" 
                        type="email"
                        value={formData.email} 
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                        size="small"
                        placeholder="email@exemple.com"
                        InputProps={{
                          startAdornment: <MailOutlined style={{ marginRight: 8, color: '#999' }} />
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField 
                        fullWidth 
                        label="LinkedIn" 
                        value={formData.linkedin_url} 
                        onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })} 
                        size="small"
                        placeholder="https://linkedin.com/in/..."
                        InputProps={{
                          startAdornment: <LinkedinOutlined style={{ marginRight: 8, color: '#0077B5' }} />
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField 
                        fullWidth 
                        label="Twitter / X" 
                        value={formData.twitter_url} 
                        onChange={(e) => setFormData({ ...formData, twitter_url: e.target.value })} 
                        size="small"
                        placeholder="https://twitter.com/..."
                        InputProps={{
                          startAdornment: <TwitterOutlined style={{ marginRight: 8, color: '#1DA1F2' }} />
                        }}
                      />
                    </Grid>
                  </Grid>
                </Paper>

                {/* Paramètres */}
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>Paramètres d'affichage</Typography>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6}>
                      <TextField 
                        fullWidth 
                        label="Ordre d'affichage" 
                        type="number"
                        value={formData.order_index} 
                        onChange={(e) => setFormData({ ...formData, order_index: e.target.value })} 
                        size="small"
                        InputProps={{ inputProps: { min: 0 } }}
                        helperText="Les membres sont triés par ordre croissant"
                      />
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
            disabled={!formData.name.trim() || !formData.role.trim()}
          >
            {editingId ? 'Mettre à jour' : 'Ajouter le membre'}
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
}
