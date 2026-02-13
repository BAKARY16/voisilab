// material-ui
import { useTheme } from '@mui/material/styles';
import logolab from '../../assets/images/logolab.png';

// ==============================|| LOGO SVG ||============================== //

export default function LogoMain() {
  const theme = useTheme();
  return (
    <img src={logolab} alt="Voisilab Logo" style={{ width: 100}} />
  );
}
