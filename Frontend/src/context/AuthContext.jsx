import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    userType: null, // 'admin' or 'student'
    token: null,
  });

  const navigate = useNavigate();

  // Check if the user is already logged in (e.g., token in localStorage)
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userType = localStorage.getItem('userType');
    if (token && userType) {
      setAuth({ isAuthenticated: true, userType, token });
    }
  }, []);

  const login = (token, userType) => {
    localStorage.setItem('authToken', token.token);
    console.log('Token:', token.token);
    localStorage.setItem('userType', userType);
    console.log('User Type:', userType);
    setAuth({ isAuthenticated: true, userType, token });
    navigate('/');
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userType');
    setAuth({ isAuthenticated: false, userType: null, token: null });
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Add PropTypes validation for the children prop
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;