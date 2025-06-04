import React, { useEffect } from 'react';
import { useAuth } from 'src/hooks/useAuth';
import { setLogoutCallback } from 'src/interceptors/api';

interface ApiProviderProps {
  children: React.ReactNode;
}

const ApiProvider: React.FC<ApiProviderProps> = ({ children }) => {
  const { logout } = useAuth();

  useEffect(() => {
    setLogoutCallback(logout);
  }, [logout]);

  return <>{children}</>;
};

export default ApiProvider; 