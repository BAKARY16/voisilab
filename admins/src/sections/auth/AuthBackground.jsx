// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import logolab from '../../assets/images/bg_dash.jpg';

// ==============================|| AUTH BLUR BACK SVG ||============================== //

export default function AuthBackground() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        filter: 'blur(18px)',
        zIndex: -1,
      }}
    >
      <img 
        src={logolab} 
        className='object-cover' 
        width="100%" 
        height="100%" 
        alt="Voisilab Logo" 
        style={{ width: '100%', height: '100%' }} 
      />
    </Box>
  );
}
