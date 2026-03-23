import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AppState, AppStateStatus } from "react-native";
import * as SecureStore from "expo-secure-store";
import { authService, UserProfile } from "@/services/auth";
import { subscribeToTokenRefresh } from "@/services/api";

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";
const REFRESH_KEY = "auth_refresh";
const TOKEN_EXPIRY_KEY = "auth_token_expiry";

// Refresh 5 minutes before expiry (tokens last 1 hour)
const TOKEN_LIFETIME_MS = 60 * 60 * 1000;
const REFRESH_BEFORE_EXPIRY_MS = 5 * 60 * 1000;
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
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refToken,
      }).toString(),
    },
  );

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body?.error?.message || "Failed to refresh token");
  }

  return response.json();
}

async function saveToStore(
  token: string,
  refreshToken: string | undefined,
  user: UserProfile,
) {
  const expiresAt = Date.now() + TOKEN_LIFETIME_MS;
  await Promise.all([
    SecureStore.setItemAsync(TOKEN_KEY, token),
    SecureStore.setItemAsync(USER_KEY, JSON.stringify(user)),
    SecureStore.setItemAsync(TOKEN_EXPIRY_KEY, String(expiresAt)),
    refreshToken
      ? SecureStore.setItemAsync(REFRESH_KEY, refreshToken)
      : Promise.resolve(),
  ]);
}

async function clearStore() {
  await Promise.all([
    SecureStore.deleteItemAsync(TOKEN_KEY),
    SecureStore.deleteItemAsync(USER_KEY),
    SecureStore.deleteItemAsync(REFRESH_KEY),
    SecureStore.deleteItemAsync(TOKEN_EXPIRY_KEY),
  ]);
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
  // Prevent concurrent silent refreshes
  const isRefreshingRef = useRef(false);
  // Track whether initial load is done
  const isInitializedRef = useRef(false);

  const clearTimers = useCallback(() => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  }, []);

  const clearStoredAuth = useCallback(async () => {
    await clearStore();
    clearTimers();
    setToken(null);
    setUser(null);
    setRefreshToken(null);
  }, [clearTimers]);

  /**
   * Silently refreshes the id_token using the stored refresh_token.
   * Returns the new id_token on success, or null if refresh failed.
   */
  const silentRefresh = useCallback(
    async (storedRefreshToken: string): Promise<string | null> => {
      if (isRefreshingRef.current) {
        // Already refreshing, wait a moment and read from store
        await new Promise((r) => setTimeout(r, 500));
        return SecureStore.getItemAsync(TOKEN_KEY);
      }

      isRefreshingRef.current = true;
      try {
        const data = await refreshFirebaseToken(storedRefreshToken);
        const newIdToken = data.id_token;
        const newRefreshToken = data.refresh_token;

        const expiresAt = Date.now() + TOKEN_LIFETIME_MS;
        await Promise.all([
          SecureStore.setItemAsync(TOKEN_KEY, newIdToken),
          SecureStore.setItemAsync(TOKEN_EXPIRY_KEY, String(expiresAt)),
          newRefreshToken
            ? SecureStore.setItemAsync(REFRESH_KEY, newRefreshToken)
            : Promise.resolve(),
        ]);

        setToken(newIdToken);
        if (newRefreshToken) {
          setRefreshToken(newRefreshToken);
        }

        console.log("[AuthContext] Silent refresh successful");
        return newIdToken;
      } catch (err) {
        console.log("[AuthContext] Refresh token expired, must re-login:", err);
        await clearStoredAuth();
        return null;
      } finally {
        isRefreshingRef.current = false;
      }
    },
    [clearStoredAuth],
  );

  /**
   * Check if token needs refresh based on saved expiry time.
   * Returns true if token is expired or will expire within threshold.
   */
  const isTokenExpiredOrExpiring = useCallback(async (): Promise<boolean> => {
    const expiryStr = await SecureStore.getItemAsync(TOKEN_EXPIRY_KEY);
    if (!expiryStr) return true;
    const expiresAt = Number(expiryStr);
    return Date.now() >= expiresAt - REFRESH_BEFORE_EXPIRY_MS;
  }, []);

  /**
   * Schedule the next proactive token refresh based on saved expiry.
   */
  const scheduleTokenRefresh = useCallback(
    (currentRefreshToken: string) => {
      clearTimers();

      SecureStore.getItemAsync(TOKEN_EXPIRY_KEY).then((expiryStr) => {
        const expiresAt = expiryStr
          ? Number(expiryStr)
          : Date.now() + TOKEN_LIFETIME_MS;
        const delay = Math.max(
          0,
          expiresAt - Date.now() - REFRESH_BEFORE_EXPIRY_MS,
        );

        console.log(
          `[AuthContext] Scheduling token refresh in ${Math.round(delay / 1000 / 60)} minutes`,
        );

        refreshTimerRef.current = setTimeout(async () => {
          console.log("[AuthContext] Proactive token refresh...");
          await silentRefresh(currentRefreshToken);
        }, delay);
      });
    },
    [clearTimers, silentRefresh],
  );

  /**
   * Validate token and sync user profile. Handles expiry gracefully.
   */
  const validateAndSync = useCallback(
    async (
      currentToken: string,
      currentRefreshToken: string | null,
    ): Promise<string | null> => {
      // Check if token is already expired/expiring before making API call
      const needsRefresh = await isTokenExpiredOrExpiring();

      let activeToken = currentToken;

      if (needsRefresh && currentRefreshToken) {
        console.log(
          "[AuthContext] Token expired/expiring, refreshing before API call...",
        );
        const refreshed = await silentRefresh(currentRefreshToken);
        if (!refreshed) return null;
        activeToken = refreshed;
      }

      try {
        const freshUser = await authService.getCurrentUser(activeToken);
        setUser(freshUser);
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(freshUser));
        return activeToken;
      } catch (err: any) {
        // Token was rejected by backend (401)
        if (err?.status === 401 && currentRefreshToken && !needsRefresh) {
          console.log("[AuthContext] Got 401, attempting emergency refresh...");
          const refreshed = await silentRefresh(currentRefreshToken);
          if (!refreshed) return null;

          try {
            const freshUser = await authService.getCurrentUser(refreshed);
            setUser(freshUser);
            await SecureStore.setItemAsync(USER_KEY, JSON.stringify(freshUser));
            return refreshed;
          } catch (retryErr) {
            console.error(
              "[AuthContext] Post-refresh user fetch failed:",
              retryErr,
            );
            return null;
          }
        }

        // Network error, keep cached user session, don't log out
        console.log(
          "[AuthContext] Validation failed (likely offline), keeping cache:",
          err?.message,
        );
        return activeToken;
      }
    },
    [isTokenExpiredOrExpiring, silentRefresh],
  );

  /**
   * Handle app coming back to foreground — check if token needs refresh.
   */
  const handleAppResume = useCallback(async () => {
    const storedRefreshToken = await SecureStore.getItemAsync(REFRESH_KEY);
    const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);

    if (!storedToken || !storedRefreshToken) return;

    const needsRefresh = await isTokenExpiredOrExpiring();
    if (needsRefresh) {
      console.log(
        "[AuthContext] App resumed with expired/expiring token, refreshing...",
      );
      const newToken = await silentRefresh(storedRefreshToken);
      if (newToken) {
        scheduleTokenRefresh(storedRefreshToken);
      }
    }
  }, [isTokenExpiredOrExpiring, silentRefresh, scheduleTokenRefresh]);

  // Listen for app state changes to handle resume
  useEffect(() => {
    if (!isInitializedRef.current) return;

    const subscription = AppState.addEventListener(
      "change",
      (nextState: AppStateStatus) => {
        if (nextState === "active") {
          handleAppResume();
        }
      },
    );

    return () => subscription.remove();
  }, [handleAppResume]);

  const loadStoredAuth = useCallback(async () => {
    try {
      const [storedToken, storedUser, storedRefreshToken] = await Promise.all([
        SecureStore.getItemAsync(TOKEN_KEY),
        SecureStore.getItemAsync(USER_KEY),
        SecureStore.getItemAsync(REFRESH_KEY),
      ]);

      if (!storedToken || !storedUser || !storedRefreshToken) {
        console.log("[AuthContext] Missing auth components, user must log in");
        if (storedToken || storedUser || storedRefreshToken) {
          await clearStoredAuth();
        }
        return;
      }

      // Restore from cache immediately to prevent flicker to login screen
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      if (storedRefreshToken) {
        setRefreshToken(storedRefreshToken);
      }

      // Validate and sync in background
      const activeToken = await validateAndSync(
        storedToken,
        storedRefreshToken ?? null,
      );

      if (activeToken && storedRefreshToken) {
        scheduleTokenRefresh(storedRefreshToken);
      }
    } catch (err) {
      console.error("[AuthContext] Error loading stored auth:", err);
    } finally {
      setIsLoading(false);
      isInitializedRef.current = true;
    }
  }, [validateAndSync, scheduleTokenRefresh, clearStoredAuth]);

  useEffect(() => {
    loadStoredAuth();
    return () => clearTimers();
  }, [loadStoredAuth, clearTimers]);

  // Keep AuthContext token in sync when api.ts silently refreshes a 401
  useEffect(() => {
    const unsubscribe = subscribeToTokenRefresh((newToken) => {
      console.log("[AuthContext] API layer triggered a refresh, syncing state");
      setToken(newToken);
    });
    return unsubscribe;
  }, []);

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
        scheduleTokenRefresh(authRefreshToken);
      }
    },
    [scheduleTokenRefresh],
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
      console.log("[AuthContext] Logout API error (ignored):", err);
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
