/**
 * Auth Context
 * Provides authentication state and methods throughout the app
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { authService, UserProfile } from '@/services/auth';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load stored auth state on mount
  useEffect(() => {
    loadStoredAuth();
  }, []);

  async function loadStoredAuth() {
    try {
      const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
      const storedUser = await SecureStore.getItemAsync(USER_KEY);

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));

        // Validate token by fetching current user
        try {
          const currentUser = await authService.getCurrentUser(storedToken);
          setUser(currentUser);
          await SecureStore.setItemAsync(USER_KEY, JSON.stringify(currentUser));
        } catch (error) {
          // Token is invalid, clear stored auth
          console.log('Token validation failed, clearing auth');
          await clearStoredAuth();
        }
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function saveAuth(authToken: string, userProfile: UserProfile) {
    await SecureStore.setItemAsync(TOKEN_KEY, authToken);
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(userProfile));
    setToken(authToken);
    setUser(userProfile);
  }

  async function clearStoredAuth() {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);
    setToken(null);
    setUser(null);
  }

  async function login(email: string, password: string) {
    setIsLoading(true);
    try {
      const response = await authService.login(email, password);
      
      // Fetch full user profile
      const userProfile = await authService.getCurrentUser(response.id_token);
      
      await saveAuth(response.id_token, userProfile);
    } finally {
      setIsLoading(false);
    }
  }

  async function signup(username: string, email: string, password: string) {
    setIsLoading(true);
    try {
      // First create the account
      await authService.signup({ username, email, password });
      
      // Then login to get the token (backend signup doesn't return token)
      const loginResponse = await authService.login(email, password);
      
      // Fetch full user profile
      const userProfile = await authService.getCurrentUser(loginResponse.id_token);
      
      await saveAuth(loginResponse.id_token, userProfile);
    } finally {
      setIsLoading(false);
    }
  }

  async function logout() {
    setIsLoading(true);
    try {
      if (token) {
        await authService.logout(token);
      }
    } catch (error) {
      // Ignore logout errors, still clear local state
      console.log('Logout API error (ignored):', error);
    } finally {
      await clearStoredAuth();
      setIsLoading(false);
    }
  }

  async function refreshUser() {
    if (!token) return;
    
    try {
      const currentUser = await authService.getCurrentUser(token);
      setUser(currentUser);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(currentUser));
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  }

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token && !!user,
    login,
    signup,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
