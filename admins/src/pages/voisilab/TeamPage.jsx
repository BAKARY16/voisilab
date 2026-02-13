import { useState, useEffect } from 'react';
import {
  Box, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, IconButton, Chip, Paper, Grid, TextField, FormControl, InputLabel, Select,
  MenuItem, Switch, FormControlLabel, Card, CardContent, Typography, Avatar, Alert
} from '@mui/material';
import { EditOutlined, DeleteOutlined, PlusOutlined, TeamOutlined, UploadOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';
import { teamService } from 'api/voisilab';

// Composant Aperçu - Preview de la page publique
function TeamPreview({ members }) {
  return (
    <Box sx={{ p: 3, bgcolor: '#f5f5f5', minHeight: 500, borderRadius: 2 }}>
      <Typography variant="h3" align="center" sx={{ mb: 4 }}>Notre Équipe</Typography>
      <Grid container spacing={3}>
        {members.filter(m => m.is_active).map((member) => (
          <Grid item xs={12} sm={6} md={4} key={member.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Avatar
                  src={member.photo_url}
                  sx={{ width: 120, height: 120, margin: '0 auto 16px', bgcolor: 'primary.main' }}
                >
                  {member.first_name?.[0]}{member.last_name?.[0]}
                </Avatar>
                <Typography variant="h5" gutterBottom>
                  {member.first_name} {member.last_name}
                </Typography>
                <Typography variant="subtitle1" color="primary" gutterBottom>
                  {member.title}
                </Typography>
                {member.department && (
                  <Chip label={member.department} size="small" sx={{ mb: 2 }} />
                )}
                {member.bio && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    {member.bio}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

// Composant Tableau - Gestion des membres
function TeamTable({ members, onEdit, onDelete, onAdd }) {
  return (
    <Box>
      <Button
        variant="contained"
        startIcon={<PlusOutlined />}
        onClick={onAdd}
        sx={{ mb: 2 }}
      >
        Nouveau membre
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Photo</TableCell>
              <TableCell>Nom</TableCell>
              <TableCell>Titre</TableCell>
              <TableCell>Département</TableCell>
              <TableCell>Ordre</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {members.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">Aucun membre</TableCell>
              </TableRow>
            ) : (
              members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <Avatar src={member.photo_url} sx={{ bgcolor: 'primary.main' }}>
                      {member.first_name?.[0]}{member.last_name?.[0]}
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <div style={{ fontWeight: 500 }}>
                      {member.first_name} {member.last_name}
                    </div>
                    {member.email && (
                      <div style={{ fontSize: '0.875rem', color: '#666' }}>{member.email}</div>
                    )}
                  </TableCell>
                  <TableCell>{member.title}</TableCell>
                  <TableCell>{member.department || '-'}</TableCell>
                  <TableCell>{member.display_order}</TableCell>
                  <TableCell>
                    <Chip
                      label={member.is_active ? 'Actif' : 'Inactif'}
                      color={member.is_active ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => onEdit(member)} size="small">
                      <EditOutlined />
                    </IconButton>
                    <IconButton onClick={() => onDelete(member.id)} color="error" size="small">
                      <DeleteOutlined />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

// Composant Formulaire - Ajouter/Modifier membre (selon maquette)
function TeamForm({ editingMember, onCancel, onSave }) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    title: '',
    department: '',
    bio: '',
    photo_url: '',
    email: '',
    linkedin_url: '',
    twitter_url: '',
    display_order: 0,
    is_active: true
  });
  const [photoPreview, setPhotoPreview] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (editingMember) {
      setFormData(editingMember);
      setPhotoPreview(editingMember.photo_url || '');
    }
  }, [editingMember]);

  const handlePhotoUrlChange = (url) => {
    setFormData({ ...formData, photo_url: url });
    setPhotoPreview(url);
  };

  const handleSubmit = async () => {
    try {
      await onSave(formData);
      setSuccess('Profil enregistré avec succès!');
      setTimeout(() => {
        setSuccess('');
        onCancel();
      }, 2000);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Titre */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Ajouter un Membre de l'Équipe
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Créez un nouveau profil pour le personnel enseignant ou administratif de l'université.
        </Typography>
      </Box>

      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

      {/* Photo de Profil */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <TeamOutlined style={{ fontSize: '1.25rem', marginRight: 8, color: '#1890ff' }} />
            <Typography variant="h6">Photo de Profil</Typography>
          </Box>
          <Box sx={{
            border: '2px dashed #d9d9d9',
            borderRadius: 2,
            p: 4,
            textAlign: 'center',
            bgcolor: '#fafafa'
          }}>
            {photoPreview ? (
              <Avatar
                src={photoPreview}
                sx={{ width: 120, height: 120, margin: '0 auto 16px' }}
              />
            ) : (
              <UploadOutlined style={{ fontSize: '3rem', color: '#999', marginBottom: 16 }} />
            )}
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Télécharger la photo (400x400px)
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
              Glissez-déposez une image ou cliquez pour parcourir
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Ou entrez l'URL de la photo"
              value={formData.photo_url}
              onChange={(e) => handlePhotoUrlChange(e.target.value)}
              sx={{ maxWidth: 400, margin: '0 auto' }}
            />
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Informations Personnelles */}
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <TeamOutlined style={{ fontSize: '1.25rem', marginRight: 8, color: '#1890ff' }} />
                <Typography variant="h6">Informations Personnelles</Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Prénom"
                    placeholder="Ex: Jean-Luc"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nom"
                    placeholder="Ex: Kouassi"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Titre"
                    placeholder="Ex: Professeur Titulaire"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Département</InputLabel>
                    <Select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      label="Département"
                    >
                      <MenuItem value="">Aucun</MenuItem>
                      <MenuItem value="Génie Informatique">Génie Informatique</MenuItem>
                      <MenuItem value="Administration">Administration</MenuItem>
                      <MenuItem value="Technique">Technique</MenuItem>
                      <MenuItem value="Recherche">Recherche</MenuItem>
                      <MenuItem value="Direction">Direction</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Biographie simplifiée"
                    placeholder="Décrivez brièvement le parcours et les expertises..."
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    multiline
                    rows={4}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Contact & Réseaux Sociaux */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <TeamOutlined style={{ fontSize: '1.25rem', marginRight: 8, color: '#1890ff' }} />
                <Typography variant="h6">Contact & Réseaux Sociaux</Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email Académique"
                    type="email"
                    placeholder="j.kouassi@univ-ivoire.ci"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="LinkedIn"
                    placeholder="https://linkedin.com/in/..."
                    value={formData.linkedin_url}
                    onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="X / Twitter"
                    placeholder="https://x.com/..."
                    value={formData.twitter_url}
                    onChange={(e) => setFormData({ ...formData, twitter_url: e.target.value })}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Paramètres */}
        <Grid item xs={12} md={5}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <TeamOutlined style={{ fontSize: '1.25rem', marginRight: 8, color: '#1890ff' }} />
                <Typography variant="h6">Paramètres</Typography>
              </Box>

              <TextField
                fullWidth
                type="number"
                label="Ordre d'affichage"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                helperText="Définit la position dans la liste (0 en premier)."
                sx={{ mb: 3 }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    color="primary"
                  />
                }
                label={
                  <Box>
                    <Typography variant="body1">Statut Actif</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Visible sur le site public
                    </Typography>
                  </Box>
                }
                sx={{ mb: 3 }}
              />

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleSubmit}
                sx={{ mb: 2 }}
              >
                Enregistrer le Profil
              </Button>

              <Button
                fullWidth
                variant="outlined"
                size="large"
                onClick={onCancel}
              >
                Annuler
              </Button>
            </CardContent>
          </Card>

          {/* Conseil Admin */}
          <Card sx={{ mt: 3, bgcolor: '#e6f7ff', border: '1px solid #91d5ff' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <TeamOutlined style={{ fontSize: '1.25rem', marginRight: 8, color: '#1890ff' }} />
                <Box>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    Conseil Admin
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Assurez-vous que l'adresse email académique est correcte car elle servira à la connexion au portail enseignant.
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

// Page principale avec Tabs
export default function TeamPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState(0);
  const [editingMember, setEditingMember] = useState(null);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const result = await teamService.getAll();
      setMembers(result.data || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    try {
      if (editingMember?.id) {
        await teamService.update(editingMember.id, formData);
      } else {
        await teamService.create(formData);
      }
      await loadMembers();
      setEditingMember(null);
    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce membre?')) return;
    try {
      await teamService.delete(id);
      loadMembers();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setCurrentTab(2); // Aller au tab "Ajouter un membre"
  };

  const handleAdd = () => {
    setEditingMember(null);
    setCurrentTab(2);
  };

  const handleCancelForm = () => {
    setEditingMember(null);
    setCurrentTab(1); // Retour au tableau
  };

  return (
    <MainCard title="Gestion de l'Équipe">
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)}>
          <Tab label="Aperçu" />
          <Tab label="Gérer l'équipe" />
          <Tab label={editingMember ? "Modifier le membre" : "Ajouter un membre"} />
        </Tabs>
      </Box>

      {loading ? (
        <Box sx={{ textAlign: 'center', p: 4 }}>Chargement...</Box>
      ) : (
        <>
          {currentTab === 0 && <TeamPreview members={members} />}
          {currentTab === 1 && (
            <TeamTable
              members={members}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAdd={handleAdd}
            />
          )}
          {currentTab === 2 && (
            <TeamForm
              editingMember={editingMember}
              onCancel={handleCancelForm}
              onSave={handleSave}
            />
          )}
        </>
      )}
    </MainCard>
  );
}
