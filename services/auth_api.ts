export const signup = async (
  username: string,
  email: string,
  password: string
) => {
  const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
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

  return data;
};
