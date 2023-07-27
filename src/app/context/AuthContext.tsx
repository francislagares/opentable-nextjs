'use client';

import axios from 'axios';
import { getCookie } from 'cookies-next';
import { createContext, useContext, useEffect, useState } from 'react';

import { User } from '@/app/models/user';

interface Auth {
  loading: boolean;
  error: string | null;
  data: User | null;
}

interface AuthState extends Auth {
  setAuthState: React.Dispatch<React.SetStateAction<Auth>>;
}

const AuthContext = createContext<AuthState>({
  loading: true,
  error: null,
  data: null,
  setAuthState: () => {},
});

interface Props {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const [authState, setAuthState] = useState<Auth>({
    loading: true,
    data: null,
    error: null,
  });

  const fetchUser = async () => {
    setAuthState({
      data: null,
      error: null,
      loading: true,
    });
    try {
      const jwt = getCookie('jwt');

      if (!jwt) {
        return setAuthState({
          data: null,
          error: null,
          loading: false,
        });
      }

      const response = await axios.get('http://localhost:3000/api/auth/me', {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;

      setAuthState({
        data: response.data,
        error: null,
        loading: false,
      });
    } catch (error: any) {
      setAuthState({
        data: null,
        error: error.response.data.errorMessage,
        loading: false,
      });
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ ...authState, setAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }

  return context;
};
