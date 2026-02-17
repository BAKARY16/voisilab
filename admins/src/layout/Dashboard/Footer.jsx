// material-ui
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export default function Footer() {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      sx={{ gap: 1.5, alignItems: 'center', justifyContent: 'space-between', p: '24px 16px 0px', mt: 'auto' }}
    >
      <Typography variant="caption">
        &copy; {new Date().getFullYear()} Tous droits réservés{' '}
        <Link href="https://uvci.edu.ci/" target="_blank" underline="hover">
          VoisiLab UVCI
        </Link>
      </Typography>
      <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/about" variant="caption" color="text.primary">
          À propos
        </Link>
        <Link href="/contact" variant="caption" color="text.primary">
          Contact
        </Link>
        <Link href="https://uvci.edu.ci/" target="_blank" variant="caption" color="text.primary">
          UVCI
        </Link>
      </Stack>
    </Stack>
  );
}
