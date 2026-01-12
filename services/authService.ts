import { saveToken, removeToken, getToken } from "./tokenService";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const signup = async (
  username: string,
  email: string,
  password: string
) => {
  const res = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      email,
      password,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "Signup failed");
  } 

  if (data.id_token) {
    await saveToken(data.id_token);
  }

  return data;
};

export const login = async (usernameOrEmail: string, password: string) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username_or_email: usernameOrEmail,
      password,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "Login failed");
  }

  if (data.id_token) {
    await saveToken(data.id_token);
  }

  return data;
};

export const logout = async () => {
  try {
    const token = await getToken();
    
    if (token) {
      await fetch(`${BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
    }
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    // Always remove local token, even if backend call fails
    await removeToken();
  }
};