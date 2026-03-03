import { useRef, useState } from 'react';
import {
  Box, IconButton, Tooltip, Divider, Paper, Popover, Typography
} from '@mui/material';
import { BoldOutlined, SmileOutlined } from '@ant-design/icons';

// ─── Icônes / emojis disponibles pour insertion ───────────────────────────────
const ICONS = [
  '🔧', '💡', '🎯', '✅', '⚠️', '📌', '🔎', '🚀', '🎨', '📝',
  '⭐', '🌟', '💪', '🏆', '📚', '⚙️', '🌐', '🔬', '🎓', '📡',
  '🤝', '💻', '🖥️', '📱', '📷', '🔑', '💰', '🏗️', '🌱', '♻️',
  '✨', '🎉', '👋', '❗', '➡️', '⬆️', '▶️', '•', '—', '→',
  '👍', '🙏', '🎤', '🎵', '🏫', '🧠', '🧪', '🔩', '🖨️', '🖱️',
];

/**
 * RichTextField — Zone de texte enrichi avec barre d'outils minimale.
 *
 * Stocke du texte brut avec balises HTML inline (<strong>) et emojis.
 * Le contenu est rendu côté client via dangerouslySetInnerHTML.
 *
 * @param {string}   label       - Libellé affiché dans la barre d'outils
 * @param {string}   value       - Valeur courante (HTML/texte)
 * @param {function} onChange    - Callback (newValue: string)
 * @param {number}   rows        - Hauteur en lignes (défaut: 6)
 * @param {string}   helperText  - Texte d'aide affiché en dessous
 * @param {string}   placeholder - Placeholder du textarea
 * @param {boolean}  required    - Ajoute * au label
 */
export default function RichTextField({
  label,
  value = '',
  onChange,
  rows = 6,
  helperText,
  placeholder,
  required = false,
}) {
  const textareaRef = useRef(null);
  const [iconAnchor, setIconAnchor] = useState(null);

  // ── Encadrer la sélection avec des balises HTML ──────────────────────────
  const wrapSelection = (before, after = '') => {
    const ta = textareaRef.current;
    if (!ta) return;
    const s = ta.selectionStart;
    const e = ta.selectionEnd;
    const selected = value.slice(s, e);
    const next = value.slice(0, s) + before + selected + after + value.slice(e);
    onChange(next);
    // Restaurer la sélection après le rendu React
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(s + before.length, e + before.length);
    });
  };

  // ── Insérer un texte/emoji à la position du curseur ──────────────────────
  const insertAt = (text) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const pos = ta.selectionStart;
    const next = value.slice(0, pos) + text + value.slice(pos);
    onChange(next);
    setIconAnchor(null);
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(pos + text.length, pos + text.length);
    });
  };

  return (
    <Box>
      {/* ── Barre d'outils ── */}
      <Paper
        variant="outlined"
        sx={{
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          px: 1.5,
          py: 0.5,
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          bgcolor: 'grey.50',
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mr: 0.5, fontSize: '0.7rem', fontWeight: 600, userSelect: 'none' }}
        >
          {label}{required ? ' *' : ''}
        </Typography>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        {/* Bouton Gras */}
        <Tooltip title="Gras — sélectionner du texte puis cliquer">
          <IconButton
            size="small"
            // onMouseDown évite de perdre la sélection du textarea
            onMouseDown={(e) => {
              e.preventDefault();
              wrapSelection('<strong>', '</strong>');
            }}
            sx={{ width: 28, height: 28 }}
          >
            <BoldOutlined style={{ fontSize: 13, fontWeight: 800 }} />
          </IconButton>
        </Tooltip>

        {/* Bouton Emoji / Icône */}
        <Tooltip title="Insérer une icône ou un emoji">
          <IconButton
            size="small"
            onClick={(e) => setIconAnchor(e.currentTarget)}
            sx={{ width: 28, height: 28 }}
          >
            <SmileOutlined style={{ fontSize: 13 }} />
          </IconButton>
        </Tooltip>

        {/* Compteur de caractères */}
        <Typography
          variant="caption"
          color="text.disabled"
          sx={{ ml: 'auto', fontSize: '0.65rem' }}
        >
          {value.replace(/<[^>]*>/g, '').length} car.
        </Typography>
      </Paper>

      {/* ── Zone de texte ── */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '10px 12px',
          fontFamily: 'inherit',
          fontSize: '0.875rem',
          lineHeight: 1.75,
          border: '1px solid #e0e0e0',
          borderTop: 'none',
          borderBottomLeftRadius: 4,
          borderBottomRightRadius: 4,
          resize: 'vertical',
          outline: 'none',
          boxSizing: 'border-box',
          backgroundColor: '#fff',
          color: '#000',
        }}
      />

      {/* ── Texte d'aide ── */}
      {helperText && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ ml: 1.5, mt: 0.5, display: 'block' }}
        >
          {helperText}
        </Typography>
      )}

      {/* ── Popover sélecteur d'icônes ── */}
      <Popover
        open={Boolean(iconAnchor)}
        anchorEl={iconAnchor}
        onClose={() => setIconAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        PaperProps={{ sx: { boxShadow: 2 } }}
      >
        <Box sx={{ p: 1.5, width: 280 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', mb: 1, fontWeight: 600 }}
          >
            Cliquer pour insérer
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {ICONS.map((icon) => (
              <Box
                key={icon}
                onClick={() => insertAt(icon)}
                sx={{
                  width: 36,
                  height: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  borderRadius: 1,
                  transition: 'background 0.1s',
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                {icon}
              </Box>
            ))}
          </Box>
        </Box>
      </Popover>
    </Box>
  );
}
