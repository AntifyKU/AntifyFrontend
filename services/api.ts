/**
 * Base API Client
 * Provides HTTP methods with error handling and timeout support
 */

import { API_BASE_URL, API_TIMEOUT } from "@/config/api";
import * as SecureStore from "expo-secure-store";
import { refreshIdToken } from "./auth";

const TOKEN_KEY = "auth_token";
const REFRESH_KEY = "auth_refresh";

// Re-export for other modules to use
export { API_BASE_URL };

let refreshPromise: Promise<string> | null = null;

async function getRefreshedToken(): Promise<string> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const storedRefreshToken = await SecureStore.getItemAsync(REFRESH_KEY);
      if (!storedRefreshToken) throw new Error("No refresh token");

      const data = await refreshIdToken(storedRefreshToken);

      await SecureStore.setItemAsync(TOKEN_KEY, data.id_token);
      if (data.refresh_token) {
        await SecureStore.setItemAsync(REFRESH_KEY, data.refresh_token);
      }

      // Notify AuthContext so its in-memory token state stays in sync
      tokenRefreshListeners.forEach((cb) => cb(data.id_token));

      return data.id_token;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

// AuthContext subscribes here so its in-memory token is updated after a refresh
type TokenRefreshListener = (newToken: string) => void;
const tokenRefreshListeners = new Set<TokenRefreshListener>();

export function subscribeToTokenRefresh(cb: TokenRefreshListener): () => void {
  tokenRefreshListeners.add(cb);
  return () => tokenRefreshListeners.delete(cb);
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    message?: string,
  ) {
    super(message || `API Error: ${status} ${statusText}`);
    this.name = "ApiError";
  }
}

interface RequestOptions {
  headers?: Record<string, string>;
  timeout?: number;
  authToken?: string;
}

async function request<T>(
  endpoint: string,
  options: RequestInit & RequestOptions = {},
): Promise<T> {
  const {
    timeout = API_TIMEOUT,
    authToken,
    headers: customHeaders,
    ...fetchOptions
  } = options;

  const url = `${API_BASE_URL}${endpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (
    customHeaders &&
    typeof customHeaders === "object" &&
    !Array.isArray(customHeaders)
  ) {
    if (customHeaders instanceof Headers) {
      customHeaders.forEach((value, key) => {
        headers[key] = value;
      });
    } else {
      Object.assign(headers, customHeaders);
    }
  }

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 401) {
        try {
          const newToken = await getRefreshedToken();

          const retryRes = await fetch(url, {
            ...fetchOptions,
            headers: { ...headers, Authorization: `Bearer ${newToken}` },
          });

          if (!retryRes.ok) {
            throw new ApiError(
              401,
              "Unauthorized",
              "Session expired. Please log in again.",
            );
          }

          const retryText = await retryRes.text();
          return (retryText ? JSON.parse(retryText) : {}) as T;
        } catch (err) {
          if (err instanceof ApiError) throw err;
          throw new ApiError(
            401,
            "Unauthorized",
            "Session expired. Please log in again.",
          );
        }
      }

      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        response.status,
        response.statusText,
        errorData.detail || errorData.message,
      );
    }

    const text = await response.text();
    if (!text) {
      return {} as T;
    }

    return JSON.parse(text) as T;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new ApiError(408, "Request Timeout", "Request timed out");
      }
      throw new ApiError(0, "Network Error", error.message);
    }

    throw new ApiError(0, "Unknown Error", "An unknown error occurred");
  }
}

async function requestFormData<T>(
  endpoint: string,
  formData: FormData,
  options: RequestOptions = {},
): Promise<T> {
  const { timeout = API_TIMEOUT, authToken } = options;

  const url = `${API_BASE_URL}${endpoint}`;

  const headers: Record<string, string> = {};

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        response.status,
        response.statusText,
        errorData.detail || errorData.message,
      );
    }

    return response.json() as Promise<T>;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new ApiError(408, "Request Timeout", "Request timed out");
      }
      throw new ApiError(0, "Network Error", error.message);
    }

    throw new ApiError(0, "Unknown Error", "An unknown error occurred");
  }
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { method: "GET", ...options }),

  post: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    }),

  put: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { method: "DELETE", ...options }),

  postFormData: <T>(
    endpoint: string,
    formData: FormData,
    options?: RequestOptions,
  ) => requestFormData<T>(endpoint, formData, options),
};

export default apiClient;
