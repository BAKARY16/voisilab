// material-ui
import { useTheme } from '@mui/material/styles';
import logolab from '../../assets/images/logolab.png';

// ==============================|| LOGO ICON SVG ||============================== //

export default function LogoIcon() {
  const theme = useTheme();

  return (
    <img src={logolab} alt="Voisilab Logo" style={{ width: 60}} />
  );
}
