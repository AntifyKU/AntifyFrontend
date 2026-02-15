/**
 * News Favorites Service
 * Handles news favorites API calls
 */

import { apiClient } from './api';

export interface FavoriteNewsItem {
  id: string;
  news_id: string;
  news_title: string;
  news_description: string;
  news_link: string;
  news_image?: string;
  news_source: string;
  news_published_at?: string;
  added_at: string;
}

export interface FavoriteNewsResponse {
  items: FavoriteNewsItem[];
  total: number;
}

export interface AddFavoriteNewsRequest {
  news_id: string;
}

export interface CheckFavoriteNewsResponse {
  is_favorite: boolean;
  favorite_id?: string;
}

/**
 * Get all favorite news for current user
 */
export async function getFavoriteNews(token: string): Promise<FavoriteNewsResponse> {
  const result = await apiClient.get<FavoriteNewsResponse>('/api/users/me/favorites/news', { authToken: token });
  return result;
}

/**
 * Add a news item to favorites
 */
export async function addFavoriteNews(token: string, newsId: string): Promise<FavoriteNewsItem> {
  const result = await apiClient.post<FavoriteNewsItem>(
    '/api/users/me/favorites/news',
    { news_id: newsId },
    { authToken: token }
  );
  return result;
}

/**
 * Remove a news item from favorites
 */
export async function removeFavoriteNews(token: string, itemId: string): Promise<{ message: string }> {
  return apiClient.delete<{ message: string }>(
    `/api/users/me/favorites/news/${itemId}`,
    { authToken: token }
  );
}

/**
 * Check if a news item is in favorites
 */
export async function checkFavoriteNews(token: string, newsId: string): Promise<CheckFavoriteNewsResponse> {
  return apiClient.get<CheckFavoriteNewsResponse>(
    `/api/users/me/favorites/news/${newsId}/check`,
    { authToken: token }
  );
}

export const favoriteNewsService = {
  getFavoriteNews,
  addFavoriteNews,
  removeFavoriteNews,
  checkFavoriteNews,
};

export default favoriteNewsService;