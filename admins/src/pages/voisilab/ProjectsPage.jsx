import { useState, useEffect } from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  IconButton, Chip, Paper, Select, MenuItem, FormControl, InputLabel,
  Typography, Grid, Divider, Tabs, Tab, Menu, CircularProgress
} from '@mui/material';
import {
  DeleteOutlined, EyeOutlined, DownloadOutlined, CloseOutlined,
  CheckOutlined, MoreOutlined, ReloadOutlined
} from '@ant-design/icons';
import MainCard from 'components/MainCard';
import { projectSubmissionsService } from 'api/voisilab';

const STATUS_LABELS = {
  pending: 'En attente',
  reviewing: 'En cours',
  approved: 'Approuvé',
  rejected: 'Rejeté',
  archived: 'Archivé'
};

function ProjectDetailDialog({ submission, open, onClose, onStatusChange, onDownloadFile }) {
  const [newStatus, setNewStatus] = useState('');
  const [reviewNotes, setReviewNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (submission) {
      setNewStatus(submission.status);
      setReviewNotes(submission.review_notes || '');
    }
  }, [submission]);

  if (!submission) return null;

  const handleStatusUpdate = async () => {
    setUpdating(true);
    try {
      await onStatusChange(submission.id, newStatus, reviewNotes);
      onClose();
    } finally {
      setUpdating(false);
    }
  };

  const files = submission.files || [];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography variant="h6">Projet #{submission.id}</Typography>
        <IconButton onClick={onClose} size="small"><CloseOutlined /></IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="caption" color="text.secondary">Porteur</Typography>
            <Typography variant="body1">{submission.name}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Email</Typography>
            <Typography variant="body2">{submission.email}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Téléphone</Typography>
            <Typography variant="body2">{submission.phone}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Type</Typography>
            <Typography variant="body2">{submission.project_type}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Budget</Typography>
            <Typography variant="body2">{submission.budget || '-'}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="caption" color="text.secondary">Description</Typography>
            <Typography variant="body2" sx={{ mt: 0.5, whiteSpace: 'pre-wrap' }}>
              {submission.description}
            </Typography>
          </Grid>

          {files.length > 0 && (
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="caption" color="text.secondary">Fichiers ({files.length})</Typography>
              <Box sx={{ mt: 1 }}>
                {files.map((file, index) => (
                  <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.5 }}>
                    <Typography variant="body2">{file.originalName}</Typography>
                    <Button size="small" onClick={() => onDownloadFile(submission.id, file)}>
                      Télécharger
                    </Button>
                  </Box>
                ))}
              </Box>
            </Grid>
          )}

          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="caption" color="text.secondary">Mettre à jour le statut</Typography>
            <FormControl fullWidth size="small" sx={{ mt: 1 }}>
              <Select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                <MenuItem value="pending">En attente</MenuItem>
                <MenuItem value="reviewing">En cours</MenuItem>
                <MenuItem value="approved">Approuvé</MenuItem>
                <MenuItem value="rejected">Rejeté</MenuItem>
                <MenuItem value="archived">Archivé</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              multiline
              rows={2}
              placeholder="Notes..."
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              size="small"
              sx={{ mt: 1 }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Fermer</Button>
        <Button
          variant="contained"
          onClick={handleStatusUpdate}
          disabled={updating}
          disableElevation
        >
          {updating ? 'Enregistrement...' : 'Enregistrer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function ProjectsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuSubmission, setMenuSubmission] = useState(null);

  useEffect(() => { loadSubmissions(); }, [filterStatus]);

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      const params = filterStatus !== 'all' ? { status: filterStatus } : {};
      const result = await projectSubmissionsService.getAll(params);
      setSubmissions(result.data || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event, submission) => {
    setAnchorEl(event.currentTarget);
    setMenuSubmission(submission);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuSubmission(null);
  };

  const handleStatusChange = async (id, status, notes) => {
    try {
      await projectSubmissionsService.updateStatus(id, status, notes);
      loadSubmissions();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleDownloadFile = async (submissionId, file) => {
    try {
      const blob = await projectSubmissionsService.downloadFile(submissionId, file.storedName);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.originalName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleDelete = async (id) => {
    handleMenuClose();
    if (!window.confirm('Supprimer cette soumission ?')) return;
    try {
      await projectSubmissionsService.delete(id);
      loadSubmissions();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleViewDetails = (submission) => {
    handleMenuClose();
    setSelectedSubmission(submission);
    setDetailOpen(true);
  };

  const handleQuickStatus = async (status) => {
    if (menuSubmission) {
      await handleStatusChange(menuSubmission.id, status, '');
    }
    handleMenuClose();
  };

  const pendingCount = submissions.filter(s => s.status === 'pending').length;

  return (
    <MainCard
      title="Projets soumis"
      secondary={
        <Button size="small" onClick={loadSubmissions} disabled={loading} startIcon={<ReloadOutlined />}>
          Actualiser
        </Button>
      }
    >
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={filterStatus} onChange={(e, v) => setFilterStatus(v)}>
          <Tab value="all" label="Tous" />
          <Tab value="pending" label={`En attente${pendingCount ? ` (${pendingCount})` : ''}`} />
          <Tab value="reviewing" label="En cours" />
          <Tab value="approved" label="Approuvés" />
          <Tab value="rejected" label="Rejetés" />
        </Tabs>
      </Box>

      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Porteur</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  <CircularProgress size={20} />
                </TableCell>
              </TableRow>
            ) : submissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                  Aucun projet
                </TableCell>
              </TableRow>
            ) : (
              submissions.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>
                    <Typography variant="body2">{item.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{item.email}</Typography>
                  </TableCell>
                  <TableCell>{item.project_type}</TableCell>
                  <TableCell>
                    <Chip
                      label={STATUS_LABELS[item.status] || item.status}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(item.created_at).toLocaleDateString('fr-FR')}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={(e) => handleMenuOpen(e, item)}>
                      <MoreOutlined />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => handleViewDetails(menuSubmission)}>
          <EyeOutlined style={{ marginRight: 8 }} /> Voir détails
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleQuickStatus('approved')}>
          <CheckOutlined style={{ marginRight: 8 }} /> Approuver
        </MenuItem>
        <MenuItem onClick={() => handleQuickStatus('rejected')}>
          <CloseOutlined style={{ marginRight: 8 }} /> Rejeter
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleDelete(menuSubmission?.id)} sx={{ color: 'error.main' }}>
          <DeleteOutlined style={{ marginRight: 8 }} /> Supprimer
        </MenuItem>
      </Menu>

      <ProjectDetailDialog
        submission={selectedSubmission}
        open={detailOpen}
        onClose={() => { setDetailOpen(false); setSelectedSubmission(null); }}
        onStatusChange={handleStatusChange}
        onDownloadFile={handleDownloadFile}
      />
    </MainCard>
  );
}
