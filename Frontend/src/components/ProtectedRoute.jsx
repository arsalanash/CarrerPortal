import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ allowedUserType, children }) => {
  const { auth } = useContext(AuthContext);

  console.log('Auth State:', auth);
  console.log('Allowed User Type:', allowedUserType);

  if (!auth.isAuthenticated && auth.userType !== allowedUserType) {
    return <Navigate to="/" replace />;
  }

  return children;
};
ProtectedRoute.propTypes = {
  allowedUserType: PropTypes.string.isRequired, // Must be a string (e.g., 'admin' or 'student')
  children: PropTypes.node.isRequired, // Must be a React node
};

export default ProtectedRoute;