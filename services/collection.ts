/**
 * Collection Service
 * Handles collection API calls
 */

import { apiClient } from './api';

export interface CollectionItem {
  id: string;
  species_id: string;
  species_name: string;
  species_scientific_name: string;
  species_image: string;
  notes?: string;
  location_found?: string;
  user_image_url?: string;
  added_at: string;
  folder_ids: string[];  // Folder IDs this item belongs to
}

export interface CollectionResponse {
  items: CollectionItem[];
  total: number;
}

export interface AddToCollectionRequest {
  species_id: string;
  notes?: string;
  location?: string;
  folder_ids?: string[];  // Optional folder IDs to add item to
}

export interface CheckCollectionResponse {
  in_collection: boolean;
  collection_id?: string;
}

/**
 * Get all collection items for current user
 */
export async function getCollection(token: string): Promise<CollectionResponse> {
  return apiClient.get<CollectionResponse>('/api/users/me/collection', { authToken: token });
}

/**
 * Add a species to collection
 */
export async function addToCollection(
  token: string,
  data: AddToCollectionRequest
): Promise<CollectionItem> {
  return apiClient.post<CollectionItem>(
    '/api/users/me/collection',
    data,
    { authToken: token }
  );
}

/**
 * Remove a species from collection
 */
export async function removeFromCollection(
  token: string,
  itemId: string
): Promise<{ message: string }> {
  return apiClient.delete<{ message: string }>(
    `/api/users/me/collection/${itemId}`,
    { authToken: token }
  );
}

/**
 * Check if a species is in collection
 */
export async function checkCollection(
  token: string,
  speciesId: string
): Promise<CheckCollectionResponse> {
  return apiClient.get<CheckCollectionResponse>(
    `/api/users/me/collection/${speciesId}/check`,
    { authToken: token }
  );
}

export const collectionService = {
  getCollection,
  addToCollection,
  removeFromCollection,
  checkCollection,
};

export default collectionService;
