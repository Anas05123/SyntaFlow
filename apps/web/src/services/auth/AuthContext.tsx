import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { UserProfile, AccountPlan, EntitlementKey } from '../../types/auth';
import { PREVIEW_PLAN, checkEntitlement } from '../../types/auth';
import {
  getCurrentUser,
  loginWithEmail as appwriteLogin,
  signupWithEmail as appwriteSignup,
  loginWithGoogle as appwriteGoogleLogin,
  logout as appwriteLogout,
} from './appwriteClient';

interface AuthContextType {
  user: UserProfile | null;
  plan: AccountPlan;
  isLoading: boolean;
  isAuthenticated: boolean;
  can: (key: EntitlementKey) => boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: (successUrl?: string, failureUrl?: string) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [plan] = useState<AccountPlan>(PREVIEW_PLAN);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const current = await getCurrentUser();
      setUser(current);
    } catch (_err) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const res = await appwriteLogin(email, password);
    if (res.success && res.user) {
      setUser(res.user);
    }
    setIsLoading(false);
    return res;
  };

  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    const res = await appwriteSignup(email, password, name);
    if (res.success && res.user) {
      setUser(res.user);
    }
    setIsLoading(false);
    return res;
  };

  const loginWithGoogle = (successUrl?: string, failureUrl?: string) => {
    appwriteGoogleLogin(successUrl, failureUrl);
  };

  const logout = async () => {
    setIsLoading(true);
    await appwriteLogout();
    setUser(null);
    setIsLoading(false);
  };

  const can = useCallback(
    (key: EntitlementKey) => {
      return checkEntitlement(plan, key);
    },
    [plan]
  );

  const value: AuthContextType = {
    user,
    plan,
    isLoading,
    isAuthenticated: Boolean(user),
    can,
    login,
    signup,
    loginWithGoogle,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
