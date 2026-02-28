import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('fixaro_token');
    if (!token) return;
    api('/auth/me')
      .then((res) => setUser(res.user))
      .catch(() => localStorage.removeItem('fixaro_token'));
  }, []);

  const login = ({ token, user: nextUser }) => {
    localStorage.setItem('fixaro_token', token);
    setUser(nextUser);
  };

  const logout = () => {
    localStorage.removeItem('fixaro_token');
    setUser(null);
  };

  const value = useMemo(() => ({ user, setUser, login, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
