import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import api from '@/services/api';

interface User {
  id: number;
  username: string;
  email: string;
  // Añade aquí más campos según tu modelo de usuario
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: () => boolean;
  isLoading: boolean;
}

interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('access_token');

        if (storedUser && token) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // En caso de error, limpiar el almacenamiento local
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    try {
      const response = await api.post<AuthResponse>('token/', {
        username,
        password
      });

      const { access, refresh, user: userData } = response.data;

      // Guardar tokens
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      // Guardar información del usuario
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

    } catch (error: any) {
      console.error('Login failed:', error.response?.data || error.message);
      throw new Error(error.response?.data?.detail || 'Error en el inicio de sesión');
    }
  };

  
  const logout = () => {
    try {
      // Opcional: Llamar al endpoint de logout en el backend si existe
      // await api.post('logout/');

      // Limpiar el almacenamiento local
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      
      // Limpiar el estado
      setUser(null);
      
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const isAuthenticated = (): boolean => {
    const token = localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('user');
    return !!token && !!storedUser;
  };

  const contextValue = React.useMemo(
    () => ({
      user,
      login,
      logout,
      isAuthenticated,
      isLoading
    }),
    [user, isLoading]
  );

  if (isLoading) {
    // Puedes retornar un componente de loading aquí si lo deseas
    return null;
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};