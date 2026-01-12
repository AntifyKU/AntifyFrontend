import { getToken } from "./tokenService";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL!;

export const publicFetch = (path: string, options: RequestInit = {}) => {
  return fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
};

export const authFetch = async (path: string, options: RequestInit = {}) => {
  const token = await getToken();

  if (!token) {
    throw new Error("No auth token");
  }

  return fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
};