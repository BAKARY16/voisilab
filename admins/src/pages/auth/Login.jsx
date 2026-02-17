import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import AuthWrapper from 'sections/auth/AuthWrapper';
import AuthLogin from 'sections/auth/AuthLogin';

export default function Login() {
  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid size={12}>
          <Box sx={{ mb: 2, textAlign: 'center' }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontWeight: 800, 
                letterSpacing: '-0.5px',
                color: '#1a1a1a',
                mb: 0.5
              }}
            >
              Connectez-vous
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#666',
                fontWeight: 400
              }}
            >
              Accédez à votre espace administrateur
            </Typography>
          </Box>
        </Grid>
        
        <Grid size={12}>
          <AuthLogin />
        </Grid>

        {/* <Grid size={12}>
          <Stack direction="row" spacing={1} sx={{ justifyContent: 'center' }}>
            <Typography variant="body2" sx={{ color: '#999' }}>
              Vous n'avez pas de compte ?
            </Typography>
            <Typography 
              component={Link} 
              to={'/register'} 
              variant="body2" 
              sx={{ 
                textDecoration: 'none',
                color: 'primary.main',
                fontWeight: 600,
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              S'inscrire
            </Typography>
          </Stack>
        </Grid> */}
      </Grid>
    </AuthWrapper>
  );
}
