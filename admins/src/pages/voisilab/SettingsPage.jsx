import { useState, useEffect } from 'react';
import {
  Box, Grid, TextField, Button, Typography, Paper, Stack, Divider,
  Alert, Tabs, Tab, CircularProgress, InputAdornment
} from '@mui/material';
import {
  SaveOutlined, GlobalOutlined, FacebookOutlined, InstagramOutlined,
  LinkedinOutlined, TwitterOutlined, YoutubeOutlined, MailOutlined,
  PhoneOutlined, EnvironmentOutlined, FileTextOutlined, SearchOutlined
} from '@ant-design/icons';
import MainCard from 'components/MainCard';
import { settingsService } from 'api/voisilab';

// ─── Définition des sections et de leurs champs ──────────────────────────────

const SECTIONS = [
  {
    id: 'general',
    label: 'Général',
    icon: <GlobalOutlined />,
    category: 'general',
    fields: [
      { key: 'site_name', label: 'Nom du site', placeholder: 'VoISiLab', required: true },
      { key: 'site_tagline', label: 'Slogan / Sous-titre', placeholder: 'Fablab de l\'UVCI' },
      { key: 'contact_email', label: 'Email de contact', placeholder: 'contact@voisilab.ci', type: 'email',
        icon: <MailOutlined style={{ color: '#bbb' }} /> },
      { key: 'contact_phone', label: 'Téléphone', placeholder: '+225 07 00 00 00 00',
        icon: <PhoneOutlined style={{ color: '#bbb' }} /> },
      { key: 'address', label: 'Adresse', placeholder: 'Abidjan, Côte d\'Ivoire', multiline: true, rows: 2,
        icon: <EnvironmentOutlined style={{ color: '#bbb' }} /> },
    ]
  },
  {
    id: 'footer',
    label: 'Footer',
    icon: <FileTextOutlined />,
    category: 'footer',
    fields: [
      { key: 'footer_description', label: 'Description footer', placeholder: 'Courte présentation du FabLab...', multiline: true, rows: 3 },
      { key: 'footer_copyright', label: 'Texte copyright', placeholder: '© 2025 VoISiLab. Tous droits réservés.' },
      { key: 'footer_address', label: 'Adresse (footer)', placeholder: 'Abidjan, Côte d\'Ivoire' },
      { key: 'footer_email', label: 'Email (footer)', placeholder: 'contact@voisilab.ci', type: 'email',
        icon: <MailOutlined style={{ color: '#bbb' }} /> },
      { key: 'footer_phone', label: 'Téléphone (footer)', placeholder: '+225 07 00 00 00 00',
        icon: <PhoneOutlined style={{ color: '#bbb' }} /> },
    ]
  },
  {
    id: 'social',
    label: 'Réseaux sociaux',
    icon: <FacebookOutlined />,
    category: 'social',
    fields: [
      { key: 'facebook_url', label: 'Facebook', placeholder: 'https://facebook.com/voisilab',
        icon: <FacebookOutlined style={{ color: '#bbb' }} /> },
      { key: 'instagram_url', label: 'Instagram', placeholder: 'https://instagram.com/voisilab',
        icon: <InstagramOutlined style={{ color: '#bbb' }} /> },
      { key: 'linkedin_url', label: 'LinkedIn', placeholder: 'https://linkedin.com/company/voisilab',
        icon: <LinkedinOutlined style={{ color: '#bbb' }} /> },
      { key: 'twitter_url', label: 'Twitter / X', placeholder: 'https://twitter.com/voisilab',
        icon: <TwitterOutlined style={{ color: '#bbb' }} /> },
      { key: 'youtube_url', label: 'YouTube', placeholder: 'https://youtube.com/@voisilab',
        icon: <YoutubeOutlined style={{ color: '#bbb' }} /> },
    ]
  },
  {
    id: 'seo',
    label: 'SEO',
    icon: <SearchOutlined />,
    category: 'seo',
    fields: [
      { key: 'meta_title', label: 'Meta title', placeholder: 'VoISiLab — FabLab de l\'UVCI' },
      { key: 'meta_description', label: 'Meta description', placeholder: 'Découvrez le FabLab de l\'UVCI...', multiline: true, rows: 3 },
      { key: 'google_analytics_id', label: 'Google Analytics ID', placeholder: 'G-XXXXXXXXXX' },
    ]
  }
];

// ─── Composant principal ─────────────────────────────────────────────────────

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [values, setValues] = useState({});   // { key: value, ... }
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { loadSettings(); }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const result = await settingsService.getAll();
      const map = {};
      (result.data || []).forEach(s => { map[s.key] = s.value || ''; });
      setValues(map);
    } catch (e) {
      setError('Impossible de charger les paramètres');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key, val) => {
    setValues(prev => ({ ...prev, [key]: val }));
  };

  const handleSave = async () => {
    const section = SECTIONS[activeTab];
    setError('');
    setSuccess('');
    setSaving(true);

    // Vérifier les champs requis
    const missing = section.fields.filter(f => f.required && !values[f.key]?.trim());
    if (missing.length > 0) {
      setError(`Champ requis manquant : ${missing.map(f => f.label).join(', ')}`);
      setSaving(false);
      return;
    }

    try {
      const settings = section.fields.map(f => ({
        key: f.key,
        value: values[f.key] || '',
        description: f.label,
        category: section.category
      }));

      await settingsService.bulkSave(settings);
      setSuccess(`Section "${section.label}" enregistrée avec succès.`);
      setTimeout(() => setSuccess(''), 4000);
    } catch (e) {
      setError(e.message || 'Erreur lors de l\'enregistrement');
    } finally {
      setSaving(false);
    }
  };

  const section = SECTIONS[activeTab];

  return (
    <MainCard title={
      <Typography variant="h4">Paramètres du site</Typography>
    }>
      {/* Feedback */}
      {success && <Alert severity="success" onClose={() => setSuccess('')} sx={{ mb: 2 }}>{success}</Alert>}
      {error && <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>{error}</Alert>}

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="flex-start">
        {/* ── Navigation verticale ── */}
        <Paper variant="outlined" sx={{ borderRadius: 1.5, minWidth: 180, flexShrink: 0 }}>
          <Tabs
            value={activeTab}
            onChange={(_, v) => { setActiveTab(v); setError(''); setSuccess(''); }}
            orientation="vertical"
            sx={{
              '& .MuiTab-root': {
                alignItems: 'flex-start',
                textAlign: 'left',
                minHeight: 44,
                px: 2,
                py: 1,
                fontSize: '0.82rem',
                justifyContent: 'flex-start',
                gap: 1
              }
            }}
          >
            {SECTIONS.map(s => (
              <Tab key={s.id} icon={s.icon} label={s.label} iconPosition="start" />
            ))}
          </Tabs>
        </Paper>

        {/* ── Formulaire de la section active ── */}
        <Box sx={{ flex: 1, width: '100%' }}>
          {loading ? (
            <Stack alignItems="center" justifyContent="center" sx={{ py: 6 }}>
              <CircularProgress size={28} />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Chargement...</Typography>
            </Stack>
          ) : (
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 1.5 }}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 0.5 }}>
                {section.label}
              </Typography>
              <Divider sx={{ mb: 2.5 }} />

              <Grid container spacing={2.5}>
                {section.fields.map(field => (
                  <Grid item xs={12} sm={field.multiline ? 12 : 6} key={field.key}>
                    <TextField
                      fullWidth
                      size="small"
                      label={field.label}
                      placeholder={field.placeholder}
                      type={field.type || 'text'}
                      multiline={!!field.multiline}
                      rows={field.rows || 1}
                      value={values[field.key] || ''}
                      onChange={e => handleChange(field.key, e.target.value)}
                      required={!!field.required}
                      InputProps={field.icon ? {
                        startAdornment: <InputAdornment position="start">{field.icon}</InputAdornment>
                      } : undefined}
                    />
                  </Grid>
                ))}
              </Grid>

              <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  startIcon={saving ? <CircularProgress size={14} color="inherit" /> : <SaveOutlined />}
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </Button>
              </Stack>
            </Paper>
          )}
        </Box>
      </Stack>
    </MainCard>
  );
}
