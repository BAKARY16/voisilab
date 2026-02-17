import { useState, useEffect } from 'react';
import {
  Box, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Chip, Paper, Select, MenuItem, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, Typography, Grid, Card, CardContent, Divider
} from '@mui/material';
import { DeleteOutlined, EyeOutlined, DownloadOutlined, CloseOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';
import { contactsService, projectSubmissionsService } from 'api/voisilab';

// Composant pour afficher les détails d'un message de contact
function ContactMessageDialog({ message, open, onClose }) {
  if (!message) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5">Message de Contact</Typography>
          <IconButton onClick={onClose} size="small"><CloseOutlined /></IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Nom</Typography>
            <Typography variant="body1"><strong>{message.firstname} {message.lastname}</strong></Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Email</Typography>
            <Typography variant="body1">{message.email}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Téléphone</Typography>
            <Typography variant="body1">{message.phone}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Date</Typography>
            <Typography variant="body1">{new Date(message.created_at).toLocaleString('fr-FR')}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="caption" color="text.secondary">Sujet</Typography>
            <Typography variant="h6">{message.subject}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="caption" color="text.secondary">Message</Typography>
            <Typography variant="body1" sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>{message.message}</Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Fermer</Button>
      </DialogActions>
    </Dialog>
  );
}

// Composant pour afficher les détails d'une soumission de projet
function ProjectSubmissionDialog({ submission, open, onClose }) {
  if (!submission) return null;

  const handleDownloadFile = async (file) => {
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
    } catch (error) {
      console.error('Erreur téléchargement:', error);
      alert('Erreur lors du téléchargement du fichier');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5">Soumission de Projet</Typography>
          <IconButton onClick={onClose} size="small"><CloseOutlined /></IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <Typography variant="caption" color="text.secondary">Nom du porteur</Typography>
            <Typography variant="h6">{submission.name}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Email</Typography>
            <Typography variant="body1">{submission.email}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Téléphone</Typography>
            <Typography variant="body1">{submission.phone}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Type de projet</Typography>
            <Typography variant="body1">{submission.project_type}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Date de soumission</Typography>
            <Typography variant="body1">{new Date(submission.created_at).toLocaleString('fr-FR')}</Typography>
          </Grid>
          {submission.budget && (
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">Budget</Typography>
              <Typography variant="body1">{submission.budget}</Typography>
            </Grid>
          )}
          {submission.timeline && (
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">Délai</Typography>
              <Typography variant="body1">{submission.timeline}</Typography>
            </Grid>
          )}
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="caption" color="text.secondary">Description du projet</Typography>
            <Typography variant="body1" sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>{submission.description}</Typography>
          </Grid>
          {submission.files && submission.files.length > 0 && (
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="caption" color="text.secondary">Fichiers joints ({submission.files.length})</Typography>
              <Box sx={{ mt: 1 }}>
                {submission.files.map((file, index) => (
                  <Card key={index} sx={{ mb: 1 }}>
                    <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, '&:last-child': { pb: 2 } }}>
                      <Box>
                        <Typography variant="body2"><strong>{file.originalName}</strong></Typography>
                        <Typography variant="caption" color="text.secondary">
                          {(file.size / 1024).toFixed(2)} KB • {file.mimetype}
                        </Typography>
                      </Box>
                      <Button
                        size="small"
                        startIcon={<DownloadOutlined />}
                        onClick={() => handleDownloadFile(file)}
                      >
                        Télécharger
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Fermer</Button>
      </DialogActions>
    </Dialog>
  );
}

export default function ContactsPage() {
  const [currentTab, setCurrentTab] = useState(0);
  const [contacts, setContacts] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [submissionDialogOpen, setSubmissionDialogOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [contactsResult, submissionsResult] = await Promise.all([
        contactsService.getAll(),
        projectSubmissionsService.getAll()
      ]);
      setContacts(contactsResult.data || []);
      setSubmissions(submissionsResult.data || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContactStatusChange = async (id, status) => {
    try {
      await contactsService.updateStatus(id, status);
      loadData();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleSubmissionStatusChange = async (id, status) => {
    try {
      await projectSubmissionsService.updateStatus(id, status);
      loadData();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleDeleteContact = async (id) => {
    if (!window.confirm('Supprimer ce message?')) return;
    try {
      await contactsService.delete(id);
      loadData();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleDeleteSubmission = async (id) => {
    if (!window.confirm('Supprimer cette soumission? Les fichiers seront également supprimés.')) return;
    try {
      await projectSubmissionsService.delete(id);
      loadData();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const viewContactDetails = async (id) => {
    try {
      const result = await contactsService.getById(id);
      setSelectedContact(result.data);
      setContactDialogOpen(true);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const viewSubmissionDetails = async (id) => {
    try {
      const result = await projectSubmissionsService.getById(id);
      setSelectedSubmission(result.data);
      setSubmissionDialogOpen(true);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const unreadCount = contacts.filter(c => c.status === 'unread').length;
  const pendingCount = submissions.filter(s => s.status === 'pending').length;

  return (
    <MainCard title="Gestion des Messages">
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)}>
          <Tab label={`Messages de contact ${unreadCount > 0 ? `(${unreadCount})` : ''}`} />
          <Tab label={`Soumissions de projet ${pendingCount > 0 ? `(${pendingCount})` : ''}`} />
        </Tabs>
      </Box>

      {loading ? (
        <Box sx={{ textAlign: 'center', p: 4 }}>Chargement...</Box>
      ) : (
        <>
          {currentTab === 0 && (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nom</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Sujet</TableCell>
                    <TableCell>Statut</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {contacts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">Aucun message</TableCell>
                    </TableRow>
                  ) : (
                    contacts.map((contact) => (
                      <TableRow key={contact.id} sx={{ bgcolor: contact.status === 'unread' ? 'action.hover' : 'inherit' }}>
                        <TableCell>
                          <Typography variant="body2" fontWeight={contact.status === 'unread' ? 'bold' : 'normal'}>
                            {contact.firstname} {contact.lastname}
                          </Typography>
                        </TableCell>
                        <TableCell>{contact.email}</TableCell>
                        <TableCell>{contact.subject}</TableCell>
                        <TableCell>
                          <Select
                            value={contact.status}
                            onChange={(e) => handleContactStatusChange(contact.id, e.target.value)}
                            size="small"
                          >
                            <MenuItem value="unread">Non lu</MenuItem>
                            <MenuItem value="read">Lu</MenuItem>
                            <MenuItem value="replied">Répondu</MenuItem>
                            <MenuItem value="archived">Archivé</MenuItem>
                          </Select>
                        </TableCell>
                        <TableCell>{new Date(contact.created_at).toLocaleDateString('fr-FR')}</TableCell>
                        <TableCell>
                          <IconButton onClick={() => viewContactDetails(contact.id)} size="small">
                            <EyeOutlined />
                          </IconButton>
                          <IconButton onClick={() => handleDeleteContact(contact.id)} color="error" size="small">
                            <DeleteOutlined />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {currentTab === 1 && (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Porteur</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Type de projet</TableCell>
                    <TableCell>Fichiers</TableCell>
                    <TableCell>Statut</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {submissions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">Aucune soumission</TableCell>
                    </TableRow>
                  ) : (
                    submissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell>
                          <Typography variant="body2" fontWeight={submission.status === 'pending' ? 'bold' : 'normal'}>
                            {submission.name}
                          </Typography>
                        </TableCell>
                        <TableCell>{submission.email}</TableCell>
                        <TableCell>{submission.project_type}</TableCell>
                        <TableCell>
                          <Chip
                            label={submission.files ? submission.files.length : 0}
                            size="small"
                            color={submission.files && submission.files.length > 0 ? 'primary' : 'default'}
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            value={submission.status}
                            onChange={(e) => handleSubmissionStatusChange(submission.id, e.target.value)}
                            size="small"
                          >
                            <MenuItem value="pending">En attente</MenuItem>
                            <MenuItem value="reviewing">En cours de revue</MenuItem>
                            <MenuItem value="approved">Approuvé</MenuItem>
                            <MenuItem value="rejected">Rejeté</MenuItem>
                            <MenuItem value="archived">Archivé</MenuItem>
                          </Select>
                        </TableCell>
                        <TableCell>{new Date(submission.created_at).toLocaleDateString('fr-FR')}</TableCell>
                        <TableCell>
                          <IconButton onClick={() => viewSubmissionDetails(submission.id)} size="small">
                            <EyeOutlined />
                          </IconButton>
                          <IconButton onClick={() => handleDeleteSubmission(submission.id)} color="error" size="small">
                            <DeleteOutlined />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}

      <ContactMessageDialog
        message={selectedContact}
        open={contactDialogOpen}
        onClose={() => setContactDialogOpen(false)}
      />
      <ProjectSubmissionDialog
        submission={selectedSubmission}
        open={submissionDialogOpen}
        onClose={() => setSubmissionDialogOpen(false)}
      />
    </MainCard>
  );
}
