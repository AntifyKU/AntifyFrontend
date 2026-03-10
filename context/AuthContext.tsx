import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as SecureStore from "expo-secure-store";
import { authService, UserProfile } from "@/services/auth";

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";
const REFRESH_KEY = "auth_refresh";
const REFRESH_INTERVAL = 55 * 60 * 1000; // 55 minutes, refresh before 1-hour expiry
const FIREBASE_API_KEY = process.env.EXPO_PUBLIC_FIREBASE_API_KEY;

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

interface FirebaseRefreshResponse {
  id_token: string;
  refresh_token?: string;
}

interface AuthProviderProps {
  readonly children: React.ReactNode;
}

async function refreshFirebaseToken(
  refToken: string,
): Promise<FirebaseRefreshResponse> {
  const response = await fetch(
    `https://securetoken.googleapis.com/v1/token?key=${FIREBASE_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grant_type: "refresh_token",
        refresh_token: refToken,
      }),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to refresh token");
  }

  return response.json();
}

async function saveToStore(
  token: string,
  refreshToken: string | undefined,
  user: UserProfile,
) {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
  await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
  if (refreshToken) {
    await SecureStore.setItemAsync(REFRESH_KEY, refreshToken);
  }
}

async function clearStore() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  await SecureStore.deleteItemAsync(USER_KEY);
  await SecureStore.deleteItemAsync(REFRESH_KEY);
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const applyTokenData = useCallback(async (data: FirebaseRefreshResponse) => {
    setToken(data.id_token);
    await SecureStore.setItemAsync(TOKEN_KEY, data.id_token);
    if (data.refresh_token) {
      setRefreshToken(data.refresh_token);
      await SecureStore.setItemAsync(REFRESH_KEY, data.refresh_token);
    }
  }, []);

  const clearStoredAuth = useCallback(async () => {
    await clearStore();
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }
    setToken(null);
    setUser(null);
    setRefreshToken(null);
  }, []);

  /**
   * Silently refreshes the id_token using the stored refresh_token.
   * Returns the new id_token on success, or null if the refresh_token has expired.
   */
  const silentRefresh = useCallback(
    async (storedRefreshToken: string): Promise<string | null> => {
      try {
        const data = await refreshFirebaseToken(storedRefreshToken);
        await applyTokenData(data);
        return data.id_token;
      } catch (err) {
        // refresh_token expired or revoked, user must re-login
        console.log("Refresh token expired, user must re-login:", err);
        await clearStoredAuth();
        return null;
      }
    },
    [applyTokenData, clearStoredAuth],
  );

  /**
   * Tries to fetch the user profile with the current token.
   * Falls back to a silent refresh if the token has expired.
   * If offline with no refresh token, keeps the cached session.
   */
  const validateAndSync = useCallback(
    async (currentToken: string, currentRefreshToken: string | null) => {
      try {
        const freshUser = await authService.getCurrentUser(currentToken);
        setUser(freshUser);
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(freshUser));
      } catch (err) {
        // id_token expired (every 1 hour), attempt silent refresh
        if (!currentRefreshToken) {
          // Offline or no refresh token, keep cached session, retry on next action
          console.log("Token validation failed, keeping cached session:", err);
          return;
        }

        console.log("Token expired, attempting silent refresh...");
        const newToken = await silentRefresh(currentRefreshToken);

        if (newToken) {
          const freshUser = await authService.getCurrentUser(newToken);
          setUser(freshUser);
          await SecureStore.setItemAsync(USER_KEY, JSON.stringify(freshUser));
          console.log("Silent refresh successful");
        }
      }
    },
    [silentRefresh],
  );

  const scheduleTokenRefresh = useCallback(
    (currentRefreshToken: string) => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }

      refreshTimerRef.current = setTimeout(async () => {
        console.log("Auto-refreshing token...");
        const newToken = await silentRefresh(currentRefreshToken);
        if (newToken) {
          console.log("Token auto-refreshed successfully");
        }
      }, REFRESH_INTERVAL);
    },
    [silentRefresh],
  );

  const loadStoredAuth = useCallback(async () => {
    try {
      const [storedToken, storedUser, storedRefreshToken] = await Promise.all([
        SecureStore.getItemAsync(TOKEN_KEY),
        SecureStore.getItemAsync(USER_KEY),
        SecureStore.getItemAsync(REFRESH_KEY),
      ]);

      if (!storedToken || !storedUser) return;

      // Restore from cache immediately, prevents flicker to login screen
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      if (storedRefreshToken) {
        setRefreshToken(storedRefreshToken);
      }

      // Validate token and sync fresh user data in background
      await validateAndSync(storedToken, storedRefreshToken ?? null);
    } catch (err) {
      console.error("Error loading stored auth:", err);
    } finally {
      setIsLoading(false);
    }
  }, [validateAndSync]);

  useEffect(() => {
    loadStoredAuth();
  }, [loadStoredAuth]);

  useEffect(() => {
    if (!token || !refreshToken) return;
    scheduleTokenRefresh(refreshToken);
    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, [token, refreshToken, scheduleTokenRefresh]);

  const saveAuth = useCallback(
    async (
      authToken: string,
      authRefreshToken: string | undefined,
      userProfile: UserProfile,
    ) => {
      await saveToStore(authToken, authRefreshToken, userProfile);
      setToken(authToken);
      setUser(userProfile);
      if (authRefreshToken) {
        setRefreshToken(authRefreshToken);
      }
    },
    [],
  );

  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      try {
        const response = await authService.login(email, password);
        const userProfile = await authService.getCurrentUser(response.id_token);
        await saveAuth(response.id_token, response.refresh_token, userProfile);
      } finally {
        setIsLoading(false);
      }
    },
    [saveAuth],
  );

  const signup = useCallback(
    async (username: string, email: string, password: string) => {
      setIsLoading(true);
      try {
        await authService.signup({ username, email, password });
        // Backend signup doesn't return a token, login right after
        const loginResponse = await authService.login(email, password);
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
    },
    [saveAuth],
  );

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      if (token) {
        await authService.logout(token);
      }
    } catch (err) {
      // Ignore server-side logout errors, always clear local state
      console.log("Logout API error (ignored):", err);
    } finally {
      await clearStoredAuth();
      setIsLoading(false);
    }
  }, [token, clearStoredAuth]);

  const refreshUser = useCallback(async () => {
    if (!token) return;
    await validateAndSync(token, refreshToken);
  }, [token, refreshToken, validateAndSync]);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: !!token && !!user,
      login,
      signup,
      logout,
      refreshUser,
    }),
    [user, token, isLoading, login, signup, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
