import React, { createContext, useState, useEffect } from 'react';
import { api } from './services/api';

interface AuthContextProps {
  authenticated: boolean;
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthStatus: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  authenticated: false,
  setAuthenticated: () => {},
  checkAuthStatus: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState<boolean>(
    localStorage.getItem('authenticated') === 'true'
  );

  const checkAuthStatus = async () => {
    try {
      const response = await api.get('/auth_status');
      setAuthenticated(response.data.authenticated);
      localStorage.setItem('authenticated', response.data.authenticated.toString());
    } catch (error) {
      setAuthenticated(false);
      localStorage.removeItem('authenticated');
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ authenticated, setAuthenticated, checkAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
};
