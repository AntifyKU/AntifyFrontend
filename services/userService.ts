import { authFetch } from "./api";

export const getUserProfile = async () => {
  const res = await authFetch("/users/me", {
    method: "GET",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "Failed to get profile");
  }

  return data;
};

export const logout = async () => {
  const res = await authFetch("/auth/logout", {
    method: "POST",
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || "Failed to logout");
  }
  return data;
};

export const updateProfile = async (updateData: {
  username?: string;
  profile_picture?: string;
  preferences?: any;
}) => {
  const res = await authFetch("/users/me/profile", {
    method: "PUT",
    body: JSON.stringify(updateData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "Failed to update profile");
  }

  return data;
};

export const changeEmail = async (newEmail: string) => {
  const res = await authFetch("/users/me/email", {
    method: "PUT",
    body: JSON.stringify({ new_email: newEmail }), // Fixed: use new_email instead of email
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "Failed to change email");
  }

  return data;
};

export const changePassword = async (newPassword: string) => {
  const res = await authFetch("/users/me/password", {
    method: "PUT",
    body: JSON.stringify({ new_password: newPassword }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "Failed to change password");
  }

  return data;
};

export const deleteAccount = async () => {
  const res = await authFetch("/users/me", {
    method: "DELETE",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "Failed to delete account");
  }

  return data;
};

export const getAllUsers = async () => {
  const res = await authFetch("/users", {
    method: "GET",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "Failed to get users");
  }

  return data;
};
