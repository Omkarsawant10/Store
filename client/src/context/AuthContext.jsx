import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in
  const checkUser = async () => {
    try {
      const res = await api.get('/auth/me', { withCredentials: true });
      setUser(res.data.user);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Logout functionality
  const logoutUser = async () => {
    try {
      await api.get('/auth/logout',{ withCredentials: true });
      setUser(null);
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, logoutUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
