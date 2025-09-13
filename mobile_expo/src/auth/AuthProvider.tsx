import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, setAuthToken } from '../api/client';

type AuthContextValue = {
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem('auth_token');
      setToken(stored);
      setAuthToken(stored);
      setLoading(false);
    })();
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    token,
    loading,
    login: async (email: string, password: string) => {
      const res = await api.login(email, password);
      await AsyncStorage.setItem('auth_token', res.token);
      setToken(res.token);
      setAuthToken(res.token);
    },
    logout: async () => {
      await AsyncStorage.removeItem('auth_token');
      setToken(null);
      setAuthToken(null);
    },
  }), [token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}



