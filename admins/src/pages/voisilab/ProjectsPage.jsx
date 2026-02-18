import { useState, useEffect } from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  IconButton, Chip, Paper, Select, MenuItem, FormControl, InputLabel,
  Typography, Grid, Divider, Tabs, Tab, Menu, CircularProgress, Stack, Avatar
} from '@mui/material';
import {
  DeleteOutlined, EyeOutlined, DownloadOutlined, CloseOutlined,
  CheckOutlined, MoreOutlined, ReloadOutlined,
  UserOutlined, MailOutlined, PhoneOutlined,
  ProjectOutlined, DollarOutlined, ScheduleOutlined,
  PaperClipOutlined, EditOutlined
} from '@ant-design/icons';
import MainCard from 'components/MainCard';
import { projectSubmissionsService } from 'api/voisilab';

const STATUS_LABELS = {
  pending:   'En attente',
  reviewing: 'En cours',
  approved:  'Approuvé',
  rejected:  'Rejeté',
  archived:  'Archivé'
};

const STATUS_COLORS = {
  pending:   'warning',
  reviewing: 'info',
  approved:  'success',
  rejected:  'error',
  archived:  'default'
};

// Ligne d'info compacte avec icône
function InfoRow({ icon, label, value }) {
  if (!value) return null;
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, py: 0.75 }}>
      <Box sx={{ color: 'text.disabled', mt: 0.1, fontSize: '14px' }}>{icon}</Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="caption" color="text.secondary" display="block">{label}</Typography>
        <Typography variant="body2">{value}</Typography>
      </Box>
    </Box>
  );
}

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
  const initials = submission.name
    ? submission.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
    : '?';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      {/* En-tête */}
      <DialogTitle sx={{ p: 0 }}>
        <Box sx={{ px: 3, py: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.lighter', color: 'primary.main', fontWeight: 600, fontSize: '0.85rem' }}>
              {initials}
            </Avatar>
            <Box>
              <Typography variant="h6" lineHeight={1.2}>{submission.name}</Typography>
              <Typography variant="caption" color="text.secondary">Dossier {submission.id}</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label={STATUS_LABELS[submission.status] || submission.status}
              color={STATUS_COLORS[submission.status] || 'default'}
              size="small"
              variant="outlined"
            />
            <IconButton onClick={onClose} size="small"><CloseOutlined /></IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {/* Section Contact */}
        <Box sx={{ px: 3, py: 2, bgcolor: 'grey.50' }}>
          <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600, letterSpacing: 1 }}>
            Contact
          </Typography>
          <Box sx={{ mt: 1 }}>
            <InfoRow icon={<MailOutlined />}   label="Email"     value={submission.email} />
            <InfoRow icon={<PhoneOutlined />}  label="Téléphone" value={submission.phone} />
          </Box>
        </Box>

        <Divider />

        {/* Section Projet */}
        <Box sx={{ px: 3, py: 2 }}>
          <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600, letterSpacing: 1 }}>
            Projet
          </Typography>
          <Box sx={{ mt: 1 }}>
            <InfoRow icon={<ProjectOutlined />}  label="Type de projet" value={submission.project_type} />
            <InfoRow icon={<DollarOutlined />}   label="Budget"         value={submission.budget} />
            <InfoRow icon={<ScheduleOutlined />} label="Délai souhaité" value={submission.timeline} />
          </Box>
        </Box>

        <Divider />

        {/* Description */}
        <Box sx={{ px: 3, py: 2 }}>
          <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600, letterSpacing: 1 }}>
            Description
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mt: 1,
              whiteSpace: 'pre-wrap',
              bgcolor: 'grey.50',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              p: 1.5,
              maxHeight: 140,
              overflowY: 'auto',
              lineHeight: 1.7
            }}
          >
            {submission.description}
          </Typography>
        </Box>

        {/* Fichiers joints */}
        {files.length > 0 && (
          <>
            <Divider />
            <Box sx={{ px: 3, py: 2 }}>
              <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600, letterSpacing: 1 }}>
                <PaperClipOutlined style={{ marginRight: 4 }} />
                Fichiers joints ({files.length})
              </Typography>
              <Stack spacing={0.5} sx={{ mt: 1 }}>
                {files.map((file, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      px: 1.5, py: 1,
                      border: '1px solid', borderColor: 'divider', borderRadius: 1,
                      bgcolor: 'background.paper'
                    }}
                  >
                    <Typography variant="body2" noWrap sx={{ flex: 1, mr: 1 }}>
                      {file.originalName}
                    </Typography>
                    <Button
                      size="small"
                      startIcon={<DownloadOutlined />}
                      onClick={() => onDownloadFile(submission.id, file)}
                      sx={{ flexShrink: 0 }}
                    >
                      Télécharger
                    </Button>
                  </Box>
                ))}
              </Stack>
            </Box>
          </>
        )}

        <Divider />

        {/* Gestion du statut */}
        <Box sx={{ px: 3, py: 2 }}>
          <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600, letterSpacing: 1 }}>
            <EditOutlined style={{ marginRight: 4 }} />
            Décision
          </Typography>
          <Stack spacing={1.5} sx={{ mt: 1.5 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Statut</InputLabel>
              <Select
                label="Statut"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <MenuItem value="pending">En attente</MenuItem>
                <MenuItem value="reviewing">En cours de revue</MenuItem>
                <MenuItem value="approved">Approuvé</MenuItem>
                <MenuItem value="rejected">Rejeté</MenuItem>
                <MenuItem value="archived">Archivé</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Notes internes"
              placeholder="Commentaire sur la décision..."
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              size="small"
            />
          </Stack>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Button onClick={onClose} variant="outlined" size="small">Fermer</Button>
        <Button
          variant="contained"
          onClick={handleStatusUpdate}
          disabled={updating}
          disableElevation
          size="small"
        >
          {updating ? 'Enregistrement...' : 'Enregistrer la décision'}
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
                      color={STATUS_COLORS[item.status] || 'default'}
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
