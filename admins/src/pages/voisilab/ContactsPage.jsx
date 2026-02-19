import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Chip, Paper, Select, MenuItem, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, Typography, Grid, Divider, Stack, Tooltip, CircularProgress, Badge
} from '@mui/material';
import { DeleteOutlined, EyeOutlined, DownloadOutlined, PaperClipOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';
import { contactsService, projectSubmissionsService } from 'api/voisilab';

// ─── Configuration des statuts ────────────────────────────────────────────────

const CONTACT_STATUSES = {
  unread:   { label: 'Non lu',   color: 'warning' },
  read:     { label: 'Lu',       color: 'default' },
  replied:  { label: 'Répondu',  color: 'success' },
  archived: { label: 'Archivé',  color: 'default' },
};

const SUBMISSION_STATUSES = {
  pending:   { label: 'En attente',      color: 'warning' },
  reviewing: { label: 'En revue',        color: 'info'    },
  approved:  { label: 'Approuvé',        color: 'success' },
  rejected:  { label: 'Rejeté',          color: 'error'   },
  archived:  { label: 'Archivé',         color: 'default' },
};

// ─── Ligne d'information réutilisable ─────────────────────────────────────────

function InfoRow({ label, value }) {
  if (!value) return null;
  return (
    <Grid item xs={12} sm={6}>
      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.25 }}>
        {label}
      </Typography>
      <Typography variant="body2" color="text.primary">
        {value}
      </Typography>
    </Grid>
  );
}

// ─── Dialog : Message de contact ──────────────────────────────────────────────

function ContactDialog({ message, open, onClose, onStatusChange }) {
  if (!message) return null;
  const statusInfo = CONTACT_STATUSES[message.status] || CONTACT_STATUSES.read;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ elevation: 2 }}>
      <DialogTitle sx={{ pb: 1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="h6" fontWeight={600}>
              {message.firstname} {message.lastname}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(message.created_at).toLocaleString('fr-FR')}
            </Typography>
          </Box>
          <Chip
            label={statusInfo.label}
            color={statusInfo.color}
            size="small"
            sx={{ mt: 0.5 }}
          />
        </Stack>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 2.5 }}>
        <Grid container spacing={2}>
          <InfoRow label="Email"     value={message.email} />
          <InfoRow label="Téléphone" value={message.phone} />
        </Grid>

        <Box sx={{ mt: 2.5 }}>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
            Sujet
          </Typography>
          <Typography variant="subtitle1" fontWeight={600}>
            {message.subject}
          </Typography>
        </Box>

        <Box
          sx={{
            mt: 2, p: 2,
            bgcolor: 'grey.50',
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
            {message.message}
          </Typography>
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Box sx={{ flex: 1 }}>
          <Select
            value={message.status}
            onChange={(e) => onStatusChange(message.id, e.target.value)}
            size="small"
            sx={{ minWidth: 150 }}
          >
            {Object.entries(CONTACT_STATUSES).map(([val, { label }]) => (
              <MenuItem key={val} value={val}>{label}</MenuItem>
            ))}
          </Select>
        </Box>
        <Button onClick={onClose} variant="outlined" size="small">Fermer</Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── Dialog : Soumission de projet ────────────────────────────────────────────

function SubmissionDialog({ submission, open, onClose, onStatusChange }) {
  if (!submission) return null;
  const statusInfo = SUBMISSION_STATUSES[submission.status] || SUBMISSION_STATUSES.pending;

  const handleDownload = async (file) => {
    try {
      const blob = await projectSubmissionsService.downloadFile(submission.id, file.storedName);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.originalName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Erreur téléchargement:', err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ elevation: 2 }}>
      <DialogTitle sx={{ pb: 1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="h6" fontWeight={600}>
              {submission.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(submission.created_at).toLocaleString('fr-FR')}
            </Typography>
          </Box>
          <Chip
            label={statusInfo.label}
            color={statusInfo.color}
            size="small"
            sx={{ mt: 0.5 }}
          />
        </Stack>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 2.5 }}>
        <Grid container spacing={2}>
          <InfoRow label="Email"          value={submission.email} />
          <InfoRow label="Téléphone"      value={submission.phone} />
          <InfoRow label="Type de projet" value={submission.project_type} />
          <InfoRow label="Budget"         value={submission.budget} />
          <InfoRow label="Délai"          value={submission.timeline} />
        </Grid>

        {submission.description && (
          <Box sx={{ mt: 2.5 }}>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
              Description
            </Typography>
            <Box
              sx={{
                p: 2,
                bgcolor: 'grey.50',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
                {submission.description}
              </Typography>
            </Box>
          </Box>
        )}

        {submission.files && submission.files.length > 0 && (
          <Box sx={{ mt: 2.5 }}>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Fichiers joints — {submission.files.length}
            </Typography>
            <Stack spacing={1}>
              {submission.files.map((file, i) => (
                <Stack
                  key={i}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{
                    px: 2, py: 1.25,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    bgcolor: 'background.paper',
                  }}
                >
                  <Box>
                    <Typography variant="body2" fontWeight={500}>{file.originalName}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {(file.size / 1024).toFixed(1)} Ko
                    </Typography>
                  </Box>
                  <Tooltip title="Télécharger">
                    <IconButton size="small" onClick={() => handleDownload(file)}>
                      <DownloadOutlined />
                    </IconButton>
                  </Tooltip>
                </Stack>
              ))}
            </Stack>
          </Box>
        )}
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Box sx={{ flex: 1 }}>
          <Select
            value={submission.status}
            onChange={(e) => onStatusChange(submission.id, e.target.value)}
            size="small"
            sx={{ minWidth: 170 }}
          >
            {Object.entries(SUBMISSION_STATUSES).map(([val, { label }]) => (
              <MenuItem key={val} value={val}>{label}</MenuItem>
            ))}
          </Select>
        </Box>
        <Button onClick={onClose} variant="outlined" size="small">Fermer</Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────

export default function ContactsPage() {
  const { id } = useParams();
  const [currentTab, setCurrentTab] = useState(0);
  const [contacts, setContacts] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [submissionDialogOpen, setSubmissionDialogOpen] = useState(false);

  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    if (id && !loading) viewContactDetails(parseInt(id, 10));
  }, [id, loading]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [c, s] = await Promise.all([
        contactsService.getAll(),
        projectSubmissionsService.getAll(),
      ]);
      setContacts(c.data || []);
      setSubmissions(s.data || []);
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleContactStatusChange = async (contactId, status) => {
    try {
      await contactsService.updateStatus(contactId, status);
      setSelectedContact((prev) => prev ? { ...prev, status } : prev);
      setContacts((prev) => prev.map((c) => c.id === contactId ? { ...c, status } : c));
    } catch (err) { console.error(err); }
  };

  const handleSubmissionStatusChange = async (subId, status) => {
    try {
      await projectSubmissionsService.updateStatus(subId, status);
      setSelectedSubmission((prev) => prev ? { ...prev, status } : prev);
      setSubmissions((prev) => prev.map((s) => s.id === subId ? { ...s, status } : s));
    } catch (err) { console.error(err); }
  };

  const handleDeleteContact = async (contactId) => {
    if (!window.confirm('Supprimer ce message ?')) return;
    try { await contactsService.delete(contactId); loadData(); }
    catch (err) { console.error(err); }
  };

  const handleDeleteSubmission = async (subId) => {
    if (!window.confirm('Supprimer cette soumission et ses fichiers ?')) return;
    try { await projectSubmissionsService.delete(subId); loadData(); }
    catch (err) { console.error(err); }
  };

  const viewContactDetails = async (contactId) => {
    try {
      const result = await contactsService.getById(contactId);
      setSelectedContact(result.data);
      setContactDialogOpen(true);
    } catch (err) { console.error(err); }
  };

  const viewSubmissionDetails = async (subId) => {
    try {
      const result = await projectSubmissionsService.getById(subId);
      setSelectedSubmission(result.data);
      setSubmissionDialogOpen(true);
    } catch (err) { console.error(err); }
  };

  const unreadCount  = contacts.filter((c) => c.status === 'unread').length;
  const pendingCount = submissions.filter((s) => s.status === 'pending').length;

  return (
    <MainCard title="Messages & Soumissions">
      {/* Onglets */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={currentTab} onChange={(_, v) => setCurrentTab(v)}>
          <Tab
            label={
              <Badge badgeContent={unreadCount} color="warning" sx={{ '& .MuiBadge-badge': { right: -10 } }}>
                Messages de contact
              </Badge>
            }
            sx={{ pr: unreadCount ? 2.5 : 0 }}
          />
          <Tab
            label={
              <Badge badgeContent={pendingCount} color="warning" sx={{ '& .MuiBadge-badge': { right: -10 } }}>
                Soumissions de projet
              </Badge>
            }
            sx={{ pr: pendingCount ? 2.5 : 0 }}
          />
        </Tabs>
      </Box>

      {/* Contenu */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={32} />
        </Box>
      ) : (
        <>
          {/* ── Tab 0 : Messages de contact ── */}
          {currentTab === 0 && (
            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Expéditeur</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Sujet</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Statut</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {contacts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                        Aucun message reçu
                      </TableCell>
                    </TableRow>
                  ) : contacts.map((contact) => {
                    const s = CONTACT_STATUSES[contact.status] || CONTACT_STATUSES.read;
                    const isUnread = contact.status === 'unread';
                    return (
                      <TableRow
                        key={contact.id}
                        hover
                        sx={{ '&:last-child td': { border: 0 } }}
                      >
                        <TableCell>
                          <Typography variant="body2" fontWeight={isUnread ? 600 : 400}>
                            {contact.firstname} {contact.lastname}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">{contact.email}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={isUnread ? 600 : 400} noWrap sx={{ maxWidth: 280 }}>
                            {contact.subject}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={s.label} color={s.color} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(contact.created_at).toLocaleDateString('fr-FR')}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Voir le message">
                            <IconButton size="small" onClick={() => viewContactDetails(contact.id)}>
                              <EyeOutlined />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Supprimer">
                            <IconButton size="small" color="error" onClick={() => handleDeleteContact(contact.id)}>
                              <DeleteOutlined />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* ── Tab 1 : Soumissions de projet ── */}
          {currentTab === 1 && (
            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Porteur de projet</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Fichiers</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Statut</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {submissions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                        Aucune soumission reçue
                      </TableCell>
                    </TableRow>
                  ) : submissions.map((sub) => {
                    const s = SUBMISSION_STATUSES[sub.status] || SUBMISSION_STATUSES.pending;
                    const fileCount = sub.files ? sub.files.length : 0;
                    return (
                      <TableRow
                        key={sub.id}
                        hover
                        sx={{ '&:last-child td': { border: 0 } }}
                      >
                        <TableCell>
                          <Typography variant="body2" fontWeight={sub.status === 'pending' ? 600 : 400}>
                            {sub.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">{sub.email}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{sub.project_type}</Typography>
                        </TableCell>
                        <TableCell>
                          {fileCount > 0 ? (
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                              <PaperClipOutlined style={{ fontSize: 12, color: '#888' }} />
                              <Typography variant="caption" color="text.secondary">{fileCount}</Typography>
                            </Stack>
                          ) : (
                            <Typography variant="caption" color="text.disabled">—</Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip label={s.label} color={s.color} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(sub.created_at).toLocaleDateString('fr-FR')}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Voir la soumission">
                            <IconButton size="small" onClick={() => viewSubmissionDetails(sub.id)}>
                              <EyeOutlined />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Supprimer">
                            <IconButton size="small" color="error" onClick={() => handleDeleteSubmission(sub.id)}>
                              <DeleteOutlined />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}

      {/* Dialogs */}
      <ContactDialog
        message={selectedContact}
        open={contactDialogOpen}
        onClose={() => setContactDialogOpen(false)}
        onStatusChange={handleContactStatusChange}
      />
      <SubmissionDialog
        submission={selectedSubmission}
        open={submissionDialogOpen}
        onClose={() => setSubmissionDialogOpen(false)}
        onStatusChange={handleSubmissionStatusChange}
      />
    </MainCard>
  );
}
