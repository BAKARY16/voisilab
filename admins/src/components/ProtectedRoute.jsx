import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { authService } from 'api/voisilab';

// ProtectedRoute Component
// Redirects to login if user is not authenticated
export default function ProtectedRoute({ children }) {
  const location = useLocation();

  // Check if user is authenticated using authService
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    // Redirect to login page and save the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node
};
