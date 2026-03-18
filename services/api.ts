import { API_BASE_URL, API_TIMEOUT } from "@/config/api";
import * as SecureStore from "expo-secure-store";
import { refreshIdToken } from "./auth";

export { API_BASE_URL } from "@/config/api";

const TOKEN_KEY = "auth_token";
const REFRESH_KEY = "auth_refresh";

let refreshPromise: Promise<string> | null = null;

async function getRefreshedToken(): Promise<string> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const storedRefreshToken = await SecureStore.getItemAsync(REFRESH_KEY);
      if (!storedRefreshToken) {
        throw new ApiError(401, "Unauthorized", "No refresh token available");
      }

      const data = await refreshIdToken(storedRefreshToken);

      const newIdToken = data.id_token ?? data.idToken;
      const newRefreshToken = data.refresh_token ?? data.refreshToken;

      if (!newIdToken) throw new Error("No id_token in refresh response");

      await SecureStore.setItemAsync(TOKEN_KEY, newIdToken);
      if (newRefreshToken) {
        await SecureStore.setItemAsync(REFRESH_KEY, newRefreshToken);
      }

      tokenRefreshListeners.forEach((cb) => cb(newIdToken));
      return newIdToken;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

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

function buildHeaders(
  customHeaders: Record<string, string> | Headers | undefined,
  authToken: string | undefined,
): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (customHeaders instanceof Headers) {
    customHeaders.forEach((value, key) => {
      headers[key] = value;
    });
  } else if (customHeaders && typeof customHeaders === "object") {
    Object.assign(headers, customHeaders);
  }

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  return headers;
}

async function parseResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  return (text ? JSON.parse(text) : {}) as T;
}

async function parseErrorResponse(response: Response): Promise<ApiError> {
  const errorData = await response.json().catch(() => ({}));
  return new ApiError(
    response.status,
    response.statusText,
    errorData.detail || errorData.message,
  );
}

async function retryWithRefreshedToken<T>(
  url: string,
  fetchOptions: RequestInit,
  headers: Record<string, string>,
): Promise<T> {
  // Attempt to get a fresh token, this will throw if refresh token is missing/expired
  const newToken = await getRefreshedToken();

  const retryRes = await fetch(url, {
    ...fetchOptions,
    headers: { ...headers, Authorization: `Bearer ${newToken}` },
  });

  if (!retryRes.ok) {
    // Retry also failed, parse the actual error from the server
    if (retryRes.status === 401) {
      throw new ApiError(
        401,
        "Unauthorized",
        "Session expired. Please log in again.",
      );
    }
    throw await parseErrorResponse(retryRes);
  }

  return parseResponse<T>(retryRes);
}

function wrapFetchError(error: unknown): never {
  if (error instanceof ApiError) throw error;
  if (error instanceof Error) {
    if (error.name === "AbortError") {
      throw new ApiError(408, "Request Timeout", "Request timed out");
    }
    throw new ApiError(0, "Network Error", error.message);
  }
  throw new ApiError(0, "Unknown Error", "An unknown error occurred");
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
  const headers = buildHeaders(customHeaders, authToken);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.status === 401) {
      // Don't pass signal to retry, original request already completed
      const { signal: _signal, ...fetchOptionsWithoutSignal } = fetchOptions;
      return retryWithRefreshedToken<T>(
        url,
        fetchOptionsWithoutSignal,
        headers,
      );
    }

    if (!response.ok) {
      throw await parseErrorResponse(response);
    }

    return parseResponse<T>(response);
  } catch (error) {
    clearTimeout(timeoutId);
    wrapFetchError(error);
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
  if (authToken) headers["Authorization"] = `Bearer ${authToken}`;

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

    if (response.status === 401) {
      // Retry form data upload with refreshed token
      const newToken = await getRefreshedToken();
      const retryRes = await fetch(url, {
        method: "POST",
        headers: { Authorization: `Bearer ${newToken}` },
        body: formData,
      });
      if (!retryRes.ok) throw await parseErrorResponse(retryRes);
      return retryRes.json() as Promise<T>;
    }

    if (!response.ok) {
      throw await parseErrorResponse(response);
    }

    return response.json() as Promise<T>;
  } catch (error) {
    clearTimeout(timeoutId);
    wrapFetchError(error);
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
