import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
} from "react";
import * as SecureStore from "expo-secure-store";
import { authService, UserProfile } from "@/services/auth";

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";
const REFRESH_KEY = "auth_refresh";

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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load stored auth state on mount
  useEffect(() => {
    loadStoredAuth();
  }, []);

  // Set up automatic token refresh
  useEffect(() => {
    if (token && refreshToken) {
      scheduleTokenRefresh();
    }
    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, [token, refreshToken]);

  async function loadStoredAuth() {
    try {
      const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
      const storedUser = await SecureStore.getItemAsync(USER_KEY);
      const storedRefreshToken = await SecureStore.getItemAsync(REFRESH_KEY);

      if (storedToken && storedUser && storedRefreshToken) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setRefreshToken(storedRefreshToken);

        // Try to validate/refresh the token
        try {
          // Try to use the stored token first
          const currentUser = await authService.getCurrentUser(storedToken);
          setUser(currentUser);
          await SecureStore.setItemAsync(USER_KEY, JSON.stringify(currentUser));
        } catch (error) {
          // If token is expired, try to refresh it
          console.log("Token expired, attempting refresh...");
          try {
            const newToken = await refreshIdToken(storedRefreshToken);
            setToken(newToken);
            await SecureStore.setItemAsync(TOKEN_KEY, newToken);
            
            // Fetch user with new token
            const currentUser = await authService.getCurrentUser(newToken);
            setUser(currentUser);
            await SecureStore.setItemAsync(USER_KEY, JSON.stringify(currentUser));
          } catch (refreshError) {
            // Refresh failed, clear auth
            console.log("Token refresh failed, clearing auth");
            await clearStoredAuth();
          }
        }
      }
    } catch (error) {
      console.error("Error loading stored auth:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function refreshIdToken(refToken: string): Promise<string> {
    // Firebase REST API to refresh ID token
    const FIREBASE_API_KEY = process.env.EXPO_PUBLIC_FIREBASE_API_KEY;
    
    const response = await fetch(
      `https://securetoken.googleapis.com/v1/token?key=${FIREBASE_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          grant_type: "refresh_token",
          refresh_token: refToken,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    const data = await response.json();
    
    // Update refresh token if a new one is provided
    if (data.refresh_token) {
      setRefreshToken(data.refresh_token);
      await SecureStore.setItemAsync(REFRESH_KEY, data.refresh_token);
    }
    
    return data.id_token;
  }

  function scheduleTokenRefresh() {
    // Clear existing timer
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }

    // Refresh token 5 minutes before it expires (55 minutes)
    const REFRESH_INTERVAL = 55 * 60 * 1000; // 55 minutes in milliseconds

    refreshTimerRef.current = setTimeout(async () => {
      if (refreshToken) {
        try {
          console.log("Auto-refreshing token...");
          const newToken = await refreshIdToken(refreshToken);
          setToken(newToken);
          await SecureStore.setItemAsync(TOKEN_KEY, newToken);
          console.log("Token refreshed successfully");
        } catch (error) {
          console.error("Auto-refresh failed:", error);
          // Don't logout on auto-refresh failure, just log it
          // The next API call will fail and can trigger a manual refresh
        }
      }
    }, REFRESH_INTERVAL);
  }

  async function saveAuth(
    authToken: string,
    authRefreshToken: string | undefined,
    userProfile: UserProfile,
  ) {
    await SecureStore.setItemAsync(TOKEN_KEY, authToken);

    if (authRefreshToken) {
      await SecureStore.setItemAsync(REFRESH_KEY, authRefreshToken);
      setRefreshToken(authRefreshToken);
    }

    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(userProfile));

    setToken(authToken);
    setUser(userProfile);
  }

  async function clearStoredAuth() {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);
    await SecureStore.deleteItemAsync(REFRESH_KEY);
    
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }
    
    setToken(null);
    setUser(null);
    setRefreshToken(null);
  }

  async function login(email: string, password: string) {
    setIsLoading(true);
    try {
      const response = await authService.login(email, password);
      const userProfile = await authService.getCurrentUser(response.id_token);

      await saveAuth(response.id_token, response.refresh_token, userProfile);
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
      const userProfile = await authService.getCurrentUser(
        loginResponse.id_token,
      );

      await saveAuth(
        loginResponse.id_token,
        loginResponse.refresh_token,
        userProfile,
      );
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
      console.log("Logout API error (ignored):", error);
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
      console.error("Error refreshing user:", error);
      
      // If token is invalid, try to refresh it
      if (refreshToken) {
        try {
          const newToken = await refreshIdToken(refreshToken);
          setToken(newToken);
          await SecureStore.setItemAsync(TOKEN_KEY, newToken);
          
          const currentUser = await authService.getCurrentUser(newToken);
          setUser(currentUser);
          await SecureStore.setItemAsync(USER_KEY, JSON.stringify(currentUser));
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          await clearStoredAuth();
        }
      }
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