'use client';

import { createContext, useContext, useState } from 'react';

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
  loading: false,
  error: null,
  data: null,
  setAuthState: () => {},
});

interface Props {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const [authState, setAuthState] = useState<Auth>({
    loading: false,
    error: null,
    data: null,
  });

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
