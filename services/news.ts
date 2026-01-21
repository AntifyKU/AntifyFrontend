/**
 * News Service
 * API calls for news articles
 */

import { apiClient } from './api';
import { API_ENDPOINTS } from '@/config/api';
import type { NewsListResponse, NewsItem } from '@/types/api';

/**
 * Get latest news articles
 */
export async function getNews(limit = 20): Promise<NewsListResponse> {
  const endpoint = `${API_ENDPOINTS.news}?limit=${limit}`;
  return apiClient.get<NewsListResponse>(endpoint);
}

/**
 * Refresh news from RSS sources (admin only)
 */
export async function refreshNews(authToken?: string): Promise<{ message: string; count: number }> {
  return apiClient.post(API_ENDPOINTS.newsRefresh, undefined, { authToken });
}

export const newsService = {
  getNews,
  refreshNews,
};

export default newsService;
