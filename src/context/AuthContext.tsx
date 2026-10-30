import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api, getStoredToken, setStoredToken } from '../lib/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (userData: any) => Promise<User>;
  logout: () => void;
  quickLogin: (role: UserRole) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const DEMO_CREDENTIALS: Record<UserRole, { email: string; password: string; label: string; desc: string }> = {
  donor: {
    email: 'donor@horizon.com',
    password: 'password123',
    label: 'Grand Horizon Hotel',
    desc: 'Donor (Hotel & Banquets)',
  },
  ngo: {
    email: 'ngo@hopeharbor.org',
    password: 'password123',
    label: 'Hope Harbor Kitchen',
    desc: 'NGO / Community Kitchen',
  },
  volunteer: {
    email: 'volunteer@surplus.org',
    password: 'password123',
    label: 'David Chen',
    desc: 'Volunteer Delivery Driver',
  },
  admin: {
    email: 'admin@surplus.org',
    password: 'password123',
    label: 'Dr. Sarah Mitchell',
    desc: 'Platform Administrator',
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchCurrentUser = async () => {
    try {
      if (getStoredToken()) {
        const res = await api.getCurrentUser();
        setUser(res.user);
      } else {
        // By default on clean initial load, load demo admin or donor for seamless instant demo inspection
        const demo = await api.login(DEMO_CREDENTIALS.donor.email, DEMO_CREDENTIALS.donor.password);
        setUser(demo.user);
        setToken(demo.token);
      }
    } catch (err) {
      console.warn('Session expired or not found, logging in as demo donor');
      try {
        const demo = await api.login(DEMO_CREDENTIALS.donor.email, DEMO_CREDENTIALS.donor.password);
        setUser(demo.user);
        setToken(demo.token);
      } catch (e) {
        setUser(null);
        setToken(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const res = await api.login(email, password);
    setUser(res.user);
    setToken(res.token);
    return res.user;
  };

  const register = async (userData: any): Promise<User> => {
    const res = await api.register(userData);
    setUser(res.user);
    setToken(res.token);
    return res.user;
  };

  const logout = () => {
    setStoredToken(null);
    setUser(null);
    setToken(null);
  };

  const quickLogin = async (role: UserRole) => {
    setIsLoading(true);
    try {
      const creds = DEMO_CREDENTIALS[role];
      const res = await api.login(creds.email, creds.password);
      setUser(res.user);
      setToken(res.token);
    } catch (err) {
      console.error('Quick login failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    const res = await api.updateProfile(updates);
    setUser(res.user);
  };

  const refreshUser = async () => {
    if (getStoredToken()) {
      const res = await api.getCurrentUser();
      setUser(res.user);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        quickLogin,
        updateProfile,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
