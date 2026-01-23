/**
 * Favorites Service
 * Handles favorites API calls
 */

import { apiClient } from './api';

export interface FavoriteItem {
  id: string;
  species_id: string;
  species_name: string;
  species_scientific_name: string;
  species_image: string;
  species_about?: string;
  added_at: string;
}

export interface FavoritesResponse {
  items: FavoriteItem[];
  total: number;
}

export interface AddFavoriteRequest {
  species_id: string;
}

export interface CheckFavoriteResponse {
  is_favorite: boolean;
  favorite_id?: string;
}

/**
 * Get all favorites for current user
 */
export async function getFavorites(token: string): Promise<FavoritesResponse> {
  console.log('[favoritesService] Fetching favorites...');
  const result = await apiClient.get<FavoritesResponse>('/api/users/me/favorites', { authToken: token });
  console.log('[favoritesService] Fetched favorites:', result);
  return result;
}

/**
 * Add a species to favorites
 */
export async function addFavorite(token: string, speciesId: string): Promise<FavoriteItem> {
  console.log('[favoritesService] Adding favorite, speciesId:', speciesId);
  const result = await apiClient.post<FavoriteItem>(
    '/api/users/me/favorites',
    { species_id: speciesId },
    { authToken: token }
  );
  console.log('[favoritesService] Add favorite response:', result);
  return result;
}

/**
 * Remove a species from favorites
 */
export async function removeFavorite(token: string, itemId: string): Promise<{ message: string }> {
  return apiClient.delete<{ message: string }>(
    `/api/users/me/favorites/${itemId}`,
    { authToken: token }
  );
}

/**
 * Check if a species is in favorites
 */
export async function checkFavorite(token: string, speciesId: string): Promise<CheckFavoriteResponse> {
  return apiClient.get<CheckFavoriteResponse>(
    `/api/users/me/favorites/${speciesId}/check`,
    { authToken: token }
  );
}

export const favoritesService = {
  getFavorites,
  addFavorite,
  removeFavorite,
  checkFavorite,
};

export default favoritesService;
