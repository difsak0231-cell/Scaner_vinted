import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Quota } from '../types';
import { api, getStoredToken } from '../services/api';

interface AuthContextType {
  user: User | null;
  quota: Quota | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, name?: string) => Promise<void>;
  logout: () => void;
  refreshUserData: () => Promise<void>;
  isAuthModalOpen: boolean;
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  authModalMode: 'login' | 'register';
  isUpgradeModalOpen: boolean;
  openUpgradeModal: () => void;
  closeUpgradeModal: () => void;
  upgradeSuccess: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [quota, setQuota] = useState<Quota | null>({ used: 0, max: 3, remaining: 3 });
  const [loading, setLoading] = useState(true);

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const refreshUserData = async () => {
    try {
      const data = await api.getMe();
      setUser(data.user);
      if (data.quota) {
        setQuota(data.quota);
      }
    } catch (err) {
      console.warn('Could not refresh user session:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUserData();
  }, []);

  const login = async (email: string, pass: string) => {
    const res = await api.login(email, pass);
    setUser(res.user);
    setQuota(res.quota);
    setIsAuthModalOpen(false);
  };

  const register = async (email: string, pass: string, name?: string) => {
    const res = await api.register(email, pass, name);
    setUser(res.user);
    setQuota(res.quota);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    api.logout();
    setUser(null);
    api.getQuota().then(q => setQuota(q)).catch(() => {
      setQuota({ used: 0, max: 3, remaining: 3 });
    });
  };

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const openUpgradeModal = () => {
    setIsUpgradeModalOpen(true);
  };

  const closeUpgradeModal = () => {
    setIsUpgradeModalOpen(false);
  };

  const upgradeSuccess = async () => {
    await refreshUserData();
    closeUpgradeModal();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        quota,
        loading,
        login,
        register,
        logout,
        refreshUserData,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        authModalMode,
        isUpgradeModalOpen,
        openUpgradeModal,
        closeUpgradeModal,
        upgradeSuccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
