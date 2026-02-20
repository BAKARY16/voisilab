import { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Avatar,
  Box,
  Typography,
  Divider,
  Alert,
  CircularProgress,
  Paper,
  IconButton,
  Backdrop
} from '@mui/material';
import { UserOutlined, LockOutlined, SaveOutlined, CameraOutlined, CloseOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';
import { authService } from 'api/voisilab';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3500';

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    role: 'admin',
    avatar_url: '',
    phone: '',
    bio: '',
    organization: ''
  });
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await authService.getProfile();
      console.log('📡 Réponse getProfile:', response);
      
      if (response && response.user) {
        setProfile(response.user);
      } else {
        // Fallback sur localStorage si l'API ne retourne pas de données
        const storedUser = authService.getCurrentUser();
        if (storedUser) {
          setProfile(storedUser);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
      setError('Erreur lors du chargement du profil');
      
      // Fallback sur localStorage en cas d'erreur
      const storedUser = authService.getCurrentUser();
      if (storedUser) {
        setProfile(storedUser);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      if (!profile?.full_name) {
        setError('Le nom est requis');
        setSaving(false);
        return;
      }

      await authService.updateProfile({
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        phone: profile.phone,
        bio: profile.bio,
        organization: profile.organization
      });

      setSuccess('Profil mis à jour avec succès');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.message || 'Erreur lors de la mise à jour du profil');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      setError('Veuillez sélectionner une image');
      return;
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('L\'image ne doit pas dépasser 5MB');
      return;
    }

    try {
      setUploading(true);
      setError('');

      const formData = new FormData();
      formData.append('file', file);

      const token = sessionStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/upload/avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'upload');
      }

      const data = await response.json();
      const avatarUrl = data.url?.startsWith('http') ? data.url : `${API_URL}${data.url}`;
      
      setProfile({ ...profile, avatar_url: avatarUrl });
      setSuccess('Photo de profil téléchargée avec succès');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Erreur upload:', error);
      setError('Erreur lors du téléchargement de l\'image');
    } finally {
      setUploading(false);
    }
  };

  const handlePasswordChange = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      if (passwordData.new_password !== passwordData.confirm_password) {
        setError('Les mots de passe ne correspondent pas');
        setSaving(false);
        return;
      }

      if (passwordData.new_password.length < 6) {
        setError('Le mot de passe doit contenir au moins 6 caractères');
        setSaving(false);
        return;
      }

      await authService.changePassword(
        passwordData.current_password,
        passwordData.new_password
      );

      setSuccess('Mot de passe modifié avec succès');
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });

      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.message || 'Erreur lors du changement de mot de passe');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Impossible de charger les informations du profil. Veuillez vous reconnecter.
        </Alert>
      </Box>
    );
  }

  return (
    <>
      <Backdrop open={saving || uploading} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress color="inherit" size={60} />
          <Typography variant="h6" sx={{ mt: 2, color: 'white' }}>
            {uploading ? 'Téléchargement...' : 'Enregistrement...'}
          </Typography>
        </Box>
      </Backdrop>

      <MainCard title="Mon profil">
        {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Grid container spacing={3}>
          {/* Colonne gauche - Informations principales */}
          <Grid item xs={12} md={8} lg={9}>
            {/* Section Informations personnelles */}
            <Paper elevation={0} variant="outlined" sx={{ p: 3, mb: 3 }}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2.5 }}>
                <UserOutlined style={{ marginRight: 8 }} />
                Informations personnelles
              </Typography>

              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nom complet"
                    value={profile?.full_name || ''}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    required
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={profile?.email || ''}
                    disabled
                    variant="outlined"
                    helperText="L'email ne peut pas être modifié"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Téléphone"
                    value={profile?.phone || ''}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    variant="outlined"
                    placeholder="+225 XX XX XX XX XX"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Organisation"
                    value={profile?.organization || ''}
                    onChange={(e) => setProfile({ ...profile, organization: e.target.value })}
                    variant="outlined"
                    placeholder="UVCI"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Bio / Description"
                    value={profile?.bio || ''}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    multiline
                    rows={4}
                    variant="outlined"
                    placeholder="Parlez un peu de vous..."
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<SaveOutlined />}
                  onClick={handleProfileUpdate}
                  disabled={saving || uploading}
                >
                  Enregistrer les modifications
                </Button>
              </Box>
            </Paper>

            {/* Section Mot de passe */}
            <Paper elevation={0} variant="outlined" sx={{ p: 3 }}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2.5 }}>
                <LockOutlined style={{ marginRight: 8 }} />
                Sécurité du compte
              </Typography>

              <Grid container spacing={2.5}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Mot de passe actuel"
                    type="password"
                    value={passwordData.current_password}
                    onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nouveau mot de passe"
                    type="password"
                    value={passwordData.new_password}
                    onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                    variant="outlined"
                    helperText="Minimum 6 caractères"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Confirmer le mot de passe"
                    type="password"
                    value={passwordData.confirm_password}
                    onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                    variant="outlined"
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  color="warning"
                  startIcon={<LockOutlined />}
                  onClick={handlePasswordChange}
                  disabled={saving || uploading}
                >
                  Changer le mot de passe
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Colonne droite - Photo de profil */}
          <Grid item xs={12} md={4} lg={3}>
            <Paper elevation={0} variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2.5 }}>
                Photo de profil
              </Typography>

              <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                <Avatar
                  src={profile?.avatar_url}
                  sx={{
                    width: 150,
                    height: 150,
                    bgcolor: 'primary.main',
                    fontSize: '3rem',
                    mx: 'auto'
                  }}
                >
                  {!profile?.avatar_url && <UserOutlined style={{ fontSize: '4rem' }} />}
                </Avatar>

                <IconButton
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': { bgcolor: 'primary.dark' }
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  <CameraOutlined />
                </IconButton>
              </Box>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleAvatarUpload}
              />

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Formats acceptés: JPG, PNG
                <br />
                Taille maximale: 5MB
              </Typography>

              {profile?.avatar_url && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<CloseOutlined />}
                  onClick={() => setProfile({ ...profile, avatar_url: '' })}
                  fullWidth
                >
                  Supprimer la photo
                </Button>
              )}
            </Paper>

            {/* Informations du compte */}
            <Paper elevation={0} variant="outlined" sx={{ p: 3, mt: 3 }}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                Informations du compte
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Rôle
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {profile?.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body2" fontWeight={500} sx={{ wordBreak: 'break-all' }}>
                  {profile?.email}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Membre depuis
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {profile?.created_at
                    ? new Date(profile.created_at).toLocaleDateString('fr-FR')
                    : 'N/A'}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </MainCard>
    </>
  );
}
