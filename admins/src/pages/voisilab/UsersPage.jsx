import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Paper, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { EditOutlined, DeleteOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';
import { usersService } from 'api/voisilab';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'user'
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { loadUsers(); }, []);

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
      setFormData({ email: '', password: '', full_name: '', role: 'user' });
      setEditingId(null);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet utilisateur?')) return;
    try {
      await usersService.delete(id);
      loadUsers();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleRoleChange = async (id, role) => {
    try {
      await usersService.update(id, { role });
      loadUsers();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <MainCard title="Utilisateurs">
      <Button variant="contained" startIcon={<PlusOutlined />} onClick={() => setOpen(true)} sx={{ mb: 2 }}>Nouvel utilisateur</Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Rôle</TableCell>
              <TableCell>Créé le</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? <TableRow><TableCell colSpan={5} align="center">Chargement...</TableCell></TableRow> : users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <UserOutlined />
                    {user.full_name || 'Sans nom'}
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    size="small"
                    sx={{ minWidth: 120 }}
                  >
                    <MenuItem value="user">Utilisateur</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>{user.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR') : '-'}</TableCell>
                <TableCell>
                  <IconButton onClick={() => { setEditingId(user.id); setFormData({ ...user, password: '' }); setOpen(true); }} size="small"><EditOutlined /></IconButton>
                  <IconButton onClick={() => handleDelete(user.id)} color="error" size="small"><DeleteOutlined /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? "Modifier l'utilisateur" : 'Créer un utilisateur'}</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Nom complet" value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} margin="normal" />
          <TextField fullWidth label="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} margin="normal" type="email" required />
          <TextField
            fullWidth
            label={editingId ? "Nouveau mot de passe (laisser vide pour ne pas changer)" : "Mot de passe"}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            margin="normal"
            type="password"
            required={!editingId}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Rôle</InputLabel>
            <Select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
              <MenuItem value="user">Utilisateur</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Annuler</Button>
          <Button variant="contained" onClick={handleSave}>Enregistrer</Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
}
