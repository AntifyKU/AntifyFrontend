/**
 * Folders Service
 * Handles folder API calls for organizing collection items
 */

import { apiClient } from './api';

// Preset folder colors
export const FOLDER_COLORS = [
  { name: 'Green', hex: '#22A45D' },
  { name: 'Blue', hex: '#3B82F6' },
  { name: 'Purple', hex: '#8B5CF6' },
  { name: 'Pink', hex: '#EC4899' },
  { name: 'Red', hex: '#EF4444' },
  { name: 'Orange', hex: '#F97316' },
  { name: 'Yellow', hex: '#EAB308' },
  { name: 'Teal', hex: '#14B8A6' },
  { name: 'Gray', hex: '#6B7280' },
];

export interface Folder {
  id: string;
  name: string;
  color: string;
  icon: string;
  created_at: string;
  updated_at: string;
  item_count: number;
}

export interface FolderListResponse {
  folders: Folder[];
  total: number;
}

export interface CreateFolderRequest {
  name: string;
  color?: string;
  icon?: string;
}

export interface UpdateFolderRequest {
  name?: string;
  color?: string;
  icon?: string;
}

export interface AddToFoldersRequest {
  folder_ids: string[];
}

export interface DeleteFolderResponse {
  message: string;
  items_affected: number;
  items_deleted: boolean;
}

/**
 * Get all folders for current user
 */
export async function getFolders(token: string): Promise<FolderListResponse> {
  return apiClient.get<FolderListResponse>('/api/users/me/folders', { authToken: token });
}

/**
 * Create a new folder
 */
export async function createFolder(
  token: string,
  data: CreateFolderRequest
): Promise<Folder> {
  return apiClient.post<Folder>('/api/users/me/folders', data, { authToken: token });
}

/**
 * Update a folder
 */
export async function updateFolder(
  token: string,
  folderId: string,
  data: UpdateFolderRequest
): Promise<Folder> {
  return apiClient.put<Folder>(`/api/users/me/folders/${folderId}`, data, { authToken: token });
}

/**
 * Delete a folder
 */
export async function deleteFolder(
  token: string,
  folderId: string,
  deleteItems: boolean = false
): Promise<DeleteFolderResponse> {
  return apiClient.delete<DeleteFolderResponse>(
    `/api/users/me/folders/${folderId}?delete_items=${deleteItems}`,
    { authToken: token }
  );
}

/**
 * Add a collection item to folders
 */
export async function addItemToFolders(
  token: string,
  itemId: string,
  folderIds: string[]
): Promise<{ message: string; folder_ids: string[] }> {
  return apiClient.post<{ message: string; folder_ids: string[] }>(
    `/api/users/me/collection/${itemId}/folders`,
    { folder_ids: folderIds },
    { authToken: token }
  );
}

/**
 * Remove a collection item from a folder
 */
export async function removeItemFromFolder(
  token: string,
  itemId: string,
  folderId: string
): Promise<{ message: string; folder_ids: string[] }> {
  return apiClient.delete<{ message: string; folder_ids: string[] }>(
    `/api/users/me/collection/${itemId}/folders/${folderId}`,
    { authToken: token }
  );
}

/**
 * Set folders for a collection item (replaces existing)
 */
export async function setItemFolders(
  token: string,
  itemId: string,
  folderIds: string[]
): Promise<{ message: string; folder_ids: string[] }> {
  return apiClient.put<{ message: string; folder_ids: string[] }>(
    `/api/users/me/collection/${itemId}/folders`,
    { folder_ids: folderIds },
    { authToken: token }
  );
}

export const foldersService = {
  getFolders,
  createFolder,
  updateFolder,
  deleteFolder,
  addItemToFolders,
  removeItemFromFolder,
  setItemFolders,
  FOLDER_COLORS,
};

export default foldersService;
