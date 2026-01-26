/**
 * Auth Service
 * Handles authentication API calls
 */

import { apiClient, API_BASE_URL } from "./api";

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  username_or_email: string; // Backend expects this field name
  password: string;
}

export interface SignupResponse {
  message: string;
}

export interface LoginResponse {
  message: string;
  user_id: string;
  id_token: string;
}

export interface UserProfile {
  user_id: string;
  username: string;
  email: string;
  role: string;
  profile_picture: string | null;
  is_active: boolean;
  created_at: string;
  lasted_login: string | null;
  lasted_update: string | null;
  preferences: {
    language: string;
    theme: string;
    notifications_enabled: boolean;
  };
}

export interface UpdateProfileRequest {
  username?: string;
  profile_picture?: string;
  preferences?: {
    language?: string;
    theme?: string;
    notifications_enabled?: boolean;
  };
}

export interface UploadProfilePictureResponse {
  message: string;
  profile_picture_url: string;
}

/**
 * Sign up a new user
 */
export async function signup(data: SignupRequest): Promise<SignupResponse> {
  return apiClient.post<SignupResponse>("/api/auth/signup", data);
}

/**
 * Log in an existing user
 */
export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  return apiClient.post<LoginResponse>("/api/auth/login", {
    username_or_email: email,
    password,
  });
}

/**
 * Log out the current user
 */
export async function logout(token: string): Promise<{ message: string }> {
  return apiClient.post<{ message: string }>(
    "/api/auth/logout",
    {},
    { authToken: token },
  );
}

/**
 * Get current user profile
 */
export async function getCurrentUser(token: string): Promise<UserProfile> {
  return apiClient.get<UserProfile>("/api/users/me", { authToken: token });
}

/**
 * Update user profile
 */
export async function updateProfile(
  token: string,
  data: UpdateProfileRequest,
): Promise<{ message: string }> {
  return apiClient.put<{ message: string }>("/api/users/me/profile", data, {
    authToken: token,
  });
}

/**
 * Upload profile picture
 */
export async function uploadProfilePicture(
  token: string,
  imageUri: string,
  mimeType: string = "image/jpeg",
): Promise<UploadProfilePictureResponse> {
  const formData = new FormData();

  // Create file object from URI
  const filename = imageUri.split("/").pop() || "profile.jpg";
  formData.append("file", {
    uri: imageUri,
    type: mimeType,
    name: filename,
  } as any);

  const response = await fetch(`${API_BASE_URL}/api/users/me/profile-picture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Upload failed: ${response.status}`);
  }

  return response.json();
}

/**
 * Delete profile picture
 */
export async function deleteProfilePicture(
  token: string,
): Promise<{ message: string }> {
  return apiClient.delete<{ message: string }>(
    "/api/users/me/profile-picture",
    { authToken: token },
  );
}

/**
 * Change user email
 */
export async function changeEmail(
  token: string,
  newEmail: string,
): Promise<{ message: string }> {
  return apiClient.put<{ message: string }>(
    "/api/users/me/email",
    { new_email: newEmail },
    { authToken: token },
  );
}

/**
 * Change user password
 */
export async function changePassword(
  token: string,
  newPassword: string,
): Promise<{ message: string }> {
  return apiClient.put<{ message: string }>(
    "/api/users/me/password",
    { new_password: newPassword },
    { authToken: token },
  );
}

export const authService = {
  signup,
  login,
  logout,
  getCurrentUser,
  updateProfile,
  uploadProfilePicture,
  deleteProfilePicture,
  changeEmail,
  changePassword,
};

export default authService;
