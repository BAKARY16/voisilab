import PropTypes from 'prop-types';
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// material-ui
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';

// third-party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';
import { authService } from 'api/voisilab';

// assets
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';

export default function AuthLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState('');

  // Get the redirect path from location state, or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard/default';

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  return (
    <Formik
      initialValues={{
        email: 'admin@voisilab.fr',
        password: 'admin123',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string().email('Email invalide').max(255).required('Email requis'),
        password: Yup.string().required('Mot de passe requis')
      })}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          setError('');
          await authService.login(values.email, values.password);
          // Redirect to the page they tried to visit or dashboard
          navigate(from, { replace: true });
        } catch (err) {
          setError(err.message || 'Erreur de connexion');
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <form noValidate onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {error && (
              <Grid size={12}>
                <Alert severity="error">{error}</Alert>
              </Grid>
            )}
            <Grid size={12}>
              <Stack sx={{ gap: 1 }}>
                <InputLabel htmlFor="email-login">Email</InputLabel>
                <OutlinedInput
                  id="email-login"
                  type="email"
                  value={values.email}
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="admin@voisilab.fr"
                  fullWidth
                  error={Boolean(touched.email && errors.email)}
                />
              </Stack>
              {touched.email && errors.email && (
                <FormHelperText error>{errors.email}</FormHelperText>
              )}
            </Grid>
            <Grid size={12}>
              <Stack sx={{ gap: 1 }}>
                <InputLabel htmlFor="password-login">Mot de passe</InputLabel>
                <OutlinedInput
                  fullWidth
                  error={Boolean(touched.password && errors.password)}
                  id="password-login"
                  type={showPassword ? 'text' : 'password'}
                  value={values.password}
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        color="secondary"
                      >
                        {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                      </IconButton>
                    </InputAdornment>
                  }
                  placeholder="Mot de passe"
                />
              </Stack>
              {touched.password && errors.password && (
                <FormHelperText error>{errors.password}</FormHelperText>
              )}
            </Grid>
            <Grid size={12}>
              <AnimateButton>
                <Button
                  disabled={isSubmitting}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  {isSubmitting ? 'Connexion...' : 'Se connecter'}
                </Button>
              </AnimateButton>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
}

AuthLogin.propTypes = { isDemo: PropTypes.bool };
