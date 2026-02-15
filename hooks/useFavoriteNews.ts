/**
 * useFavoriteNews Hook
 * Manages news favorites state and operations
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { favoriteNewsService, FavoriteNewsItem } from '@/services/favoriteNews';

interface UseFavoriteNewsResult {
  favoriteNews: FavoriteNewsItem[];
  isLoading: boolean;
  error: string | null;
  isFavorite: (newsId: string) => boolean;
  addToFavorites: (newsId: string) => Promise<void>;
  removeFromFavorites: (newsId: string) => Promise<void>;
  toggleFavorite: (newsId: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useFavoriteNews(): UseFavoriteNewsResult {
  const { token, isAuthenticated } = useAuth();
  const [favoriteNews, setFavoriteNews] = useState<FavoriteNewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Ref to track latest favorites (avoids stale closure in callbacks)
  const favoriteNewsRef = useRef<FavoriteNewsItem[]>(favoriteNews);
  
  // Keep ref in sync with state
  useEffect(() => {
    favoriteNewsRef.current = favoriteNews;
  }, [favoriteNews]);

  const fetchFavoriteNews = useCallback(async () => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await favoriteNewsService.getFavoriteNews(token);
      setFavoriteNews(response.items);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch favorite news');
      console.error('[useFavoriteNews] Error fetching favorite news:', err);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  // Fetch favorites when authenticated
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchFavoriteNews();
    } else {
      setFavoriteNews([]);
    }
  }, [isAuthenticated, token, fetchFavoriteNews]);

  const isFavorite = useCallback((newsId: string): boolean => {
    return favoriteNews.some(item => item.news_id === newsId);
  }, [favoriteNews]);

  const addToFavorites = useCallback(async (newsId: string) => {
    if (!token) {
      throw new Error('You must be logged in to add favorites');
    }

    try {
      const newItem = await favoriteNewsService.addFavoriteNews(token, newsId);
      setFavoriteNews(prev => [...prev, newItem]);
      // Also update ref immediately
      favoriteNewsRef.current = [...favoriteNewsRef.current, newItem];
    } catch (err: any) {
      console.error('[useFavoriteNews] Error adding to favorites:', err);
      throw err;
    }
  }, [token]);

  const removeFromFavorites = useCallback(async (newsId: string) => {
    if (!token) {
      throw new Error('You must be logged in to remove favorites');
    }

    // Use ref to get latest favorites (avoids stale closure)
    const currentFavorites = favoriteNewsRef.current;
    const item = currentFavorites.find(f => f.news_id === newsId);
    
    if (!item) {
      console.warn('[useFavoriteNews] Item not found in favorites:', newsId);
      return;
    }

    try {
      await favoriteNewsService.removeFavoriteNews(token, item.id);
      setFavoriteNews(prev => prev.filter(f => f.news_id !== newsId));
      // Update ref immediately
      favoriteNewsRef.current = favoriteNewsRef.current.filter(f => f.news_id !== newsId);
    } catch (err: any) {
      console.error('[useFavoriteNews] Error removing from favorites:', err);
      throw err;
    }
  }, [token]);

  const toggleFavorite = useCallback(async (newsId: string) => {
    if (isFavorite(newsId)) {
      await removeFromFavorites(newsId);
    } else {
      await addToFavorites(newsId);
    }
  }, [isFavorite, addToFavorites, removeFromFavorites]);

  const refresh = useCallback(async () => {
    await fetchFavoriteNews();
  }, [fetchFavoriteNews]);

  return {
    favoriteNews,
    isLoading,
    error,
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    refresh,
  };
}

export default useFavoriteNews;