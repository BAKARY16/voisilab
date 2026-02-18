import { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Button, Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, IconButton, Paper, Select, MenuItem, FormControl, 
  InputLabel, Chip, Box, Alert
} from '@mui/material';
import { 
  EditOutlined, 
  DeleteOutlined, 
  PlusOutlined, 
  UserOutlined, 
  StarOutlined, 
  SafetyCertificateOutlined 
} from '@ant-design/icons';
import MainCard from 'components/MainCard';
import { usersService, authService } from 'api/voisilab';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'admin'
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { 
    loadUsers(); 
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
      const user = await authService.getProfile();
      setCurrentUser(user);
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const result = await usersService.getAll();
      setUsers(result.data || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const isSuperAdmin = () => currentUser?.role === 'superadmin';

  const handleSave = async () => {
    try {
      if (editingId) {
        const updateData = { ...formData };
        if (!updateData.password) {
          delete updateData.password;
        }
        await usersService.update(editingId, updateData);
      } else {
        await usersService.create(formData);
      }
      setOpen(false);
      loadUsers();
      setFormData({ email: '', password: '', full_name: '', role: 'admin' });
      setEditingId(null);
    } catch (error) {
      console.error('Erreur:', error);
      alert(error.response?.data?.error || 'Erreur lors de l\'enregistrement');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet utilisateur ?')) return;
    try {
      await usersService.delete(id);
      loadUsers();
    } catch (error) {
      console.error('Erreur:', error);
      alert(error.response?.data?.error || 'Erreur lors de la suppression');
    }
  };

  const handleRoleChange = async (id, role) => {
    try {
      await usersService.update(id, { role });
      loadUsers();
    } catch (error) {
      console.error('Erreur:', error);
      alert(error.response?.data?.error || 'Erreur lors du changement de rôle');
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'superadmin':
        return <Chip icon={<StarOutlined />} label="SuperAdmin" color="error" size="small" sx={{ fontWeight: 600 }} />;
      case 'admin':
        return <Chip icon={<SafetyCertificateOutlined />} label="Admin" color="primary" size="small" />;
      case 'editor':
        return <Chip label="Éditeur" color="info" size="small" />;
      case 'viewer':
        return <Chip label="Visiteur" color="default" size="small" />;
      default:
        return <Chip label="Utilisateur" color="default" size="small" />;
    }
  };

  return (
    <MainCard title="Gestion des utilisateurs">
      {!isSuperAdmin() && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Vous pouvez voir la liste des utilisateurs. Seuls les <strong>SuperAdmins</strong> peuvent créer, modifier ou supprimer des utilisateurs.
        </Alert>
      )}
      
      {isSuperAdmin() && (
        <Button 
          variant="contained" 
          startIcon={<PlusOutlined />} 
          onClick={() => setOpen(true)} 
          sx={{ mb: 2 }}
        >
          Nouvel administrateur
        </Button>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Nom</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Rôle</strong></TableCell>
              <TableCell><strong>Statut</strong></TableCell>
              <TableCell><strong>Créé le</strong></TableCell>
              {isSuperAdmin() && <TableCell align="center"><strong>Actions</strong></TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={isSuperAdmin() ? 6 : 5} align="center">
                  Chargement...
                </TableCell>
              </TableRow>
            ) : users.map((user) => (
              <TableRow key={user.id} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <UserOutlined style={{ fontSize: 18 }} />
                    <span style={{ fontWeight: 500 }}>
                      {user.full_name || 'Sans nom'}
                      {user.id === currentUser?.id && <Chip label="Vous" size="small" sx={{ ml: 1 }} />}
                    </span>
                  </Box>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {isSuperAdmin() ? (
                    <Select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      size="small"
                      disabled={user.role === 'superadmin' && user.id !== currentUser?.id}
                      sx={{ minWidth: 150 }}
                    >
                      <MenuItem value="superadmin">SuperAdmin</MenuItem>
                      <MenuItem value="admin">Admin</MenuItem>
                      <MenuItem value="editor">Éditeur</MenuItem>
                      <MenuItem value="viewer">Visiteur</MenuItem>
                      <MenuItem value="user">Utilisateur</MenuItem>
                    </Select>
                  ) : (
                    getRoleBadge(user.role)
                  )}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={user.active ? 'Actif' : 'Inactif'} 
                    color={user.active ? 'success' : 'default'} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>{user.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR') : '-'}</TableCell>
                {isSuperAdmin() && (
                  <TableCell align="center">
                    <IconButton 
                      onClick={() => { 
                        setEditingId(user.id); 
                        setFormData({ 
                          email: user.email,
                          full_name: user.full_name,
                          role: user.role,
                          password: '' 
                        }); 
                        setOpen(true); 
                      }} 
                      size="small"
                      color="primary"
                    >
                      <EditOutlined />
                    </IconButton>
                    <IconButton 
                      onClick={() => handleDelete(user.id)} 
                      color="error" 
                      size="small"
                      disabled={user.role === 'superadmin'}
                    >
                      <DeleteOutlined />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? "Modifier l'utilisateur" : 'Créer un administrateur'}</DialogTitle>
        <DialogContent>
          <TextField 
            fullWidth 
            label="Nom complet" 
            value={formData.full_name} 
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} 
            margin="normal" 
          />
          <TextField 
            fullWidth 
            label="Email" 
            value={formData.email} 
            onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
            margin="normal" 
            type="email" 
            required 
          />
          <TextField
            fullWidth
            label={editingId ? "Nouveau mot de passe (laisser vide pour ne pas changer)" : "Mot de passe"}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            margin="normal"
            type="password"
            required={!editingId}
            helperText="Minimum 6 caractères"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Rôle</InputLabel>
            <Select 
              value={formData.role} 
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <MenuItem value="superadmin">SuperAdmin (tous les droits)</MenuItem>
              <MenuItem value="admin">Admin (gestion complète)</MenuItem>
              <MenuItem value="editor">Éditeur (modification du contenu)</MenuItem>
              <MenuItem value="viewer">Visiteur (lecture seule)</MenuItem>
              <MenuItem value="user">Utilisateur (accès limité)</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpen(false); setEditingId(null); }}>Annuler</Button>
          <Button variant="contained" onClick={handleSave}>
            {editingId ? 'Mettre à jour' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
}
