import { useEffect, useState } from 'react';
import { verifyToken } from '../../api/auth';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      verifyToken(token)
        .then(() => setIsAuthenticated(true))
        .catch(() => {
          localStorage.removeItem('token');
          window.location.href = '/login';
        });
    } else {
      window.location.href = '/login';
    }
  }, []);

  return isAuthenticated ? children : null;
};

export default ProtectedRoute;