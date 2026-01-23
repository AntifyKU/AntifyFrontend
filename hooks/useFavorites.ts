/**
 * useFavorites Hook
 * Manages favorites state and operations
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { favoritesService, FavoriteItem } from '@/services/favorites';

interface UseFavoritesResult {
  favorites: FavoriteItem[];
  isLoading: boolean;
  error: string | null;
  isFavorite: (speciesId: string) => boolean;
  addToFavorites: (speciesId: string) => Promise<void>;
  removeFromFavorites: (speciesId: string) => Promise<void>;
  toggleFavorite: (speciesId: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useFavorites(): UseFavoritesResult {
  const { token, isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Ref to track latest favorites (avoids stale closure in callbacks)
  const favoritesRef = useRef<FavoriteItem[]>(favorites);
  
  // Keep ref in sync with state
  useEffect(() => {
    favoritesRef.current = favorites;
  }, [favorites]);

  // Fetch favorites when authenticated
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchFavorites();
    } else {
      setFavorites([]);
    }
  }, [isAuthenticated, token]);

  const fetchFavorites = useCallback(async () => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    console.log('[useFavorites] Fetching favorites from API...');

    try {
      const response = await favoritesService.getFavorites(token);
      console.log('[useFavorites] Fetched favorites:', response.items.length, 'items');
      setFavorites(response.items);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch favorites');
      console.error('[useFavorites] Error fetching favorites:', err);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const isFavorite = useCallback((speciesId: string): boolean => {
    return favorites.some(item => item.species_id === speciesId);
  }, [favorites]);

  const addToFavorites = useCallback(async (speciesId: string) => {
    if (!token) {
      throw new Error('You must be logged in to add favorites');
    }

    console.log('[useFavorites] Adding to favorites:', speciesId);

    try {
      const newItem = await favoritesService.addFavorite(token, speciesId);
      console.log('[useFavorites] API response:', newItem);
      setFavorites(prev => [...prev, newItem]);
      // Also update ref immediately
      favoritesRef.current = [...favoritesRef.current, newItem];
      console.log('[useFavorites] Favorites updated, new count:', favoritesRef.current.length);
    } catch (err: any) {
      console.error('[useFavorites] Error adding to favorites:', err);
      throw err;
    }
  }, [token]);

  const removeFromFavorites = useCallback(async (speciesId: string) => {
    if (!token) {
      throw new Error('You must be logged in to remove favorites');
    }

    // Use ref to get latest favorites (avoids stale closure)
    const currentFavorites = favoritesRef.current;
    const item = currentFavorites.find(f => f.species_id === speciesId);
    
    if (!item) {
      console.warn('[useFavorites] Item not found in favorites:', speciesId);
      console.log('[useFavorites] Current favorites:', currentFavorites.map(f => f.species_id));
      return;
    }

    console.log('[useFavorites] Removing favorite:', item.id, 'for species:', speciesId);

    try {
      await favoritesService.removeFavorite(token, item.id);
      console.log('[useFavorites] Successfully removed from API');
      setFavorites(prev => prev.filter(f => f.species_id !== speciesId));
    } catch (err: any) {
      console.error('[useFavorites] Error removing from favorites:', err);
      throw err;
    }
  }, [token]);

  const toggleFavorite = useCallback(async (speciesId: string) => {
    if (isFavorite(speciesId)) {
      await removeFromFavorites(speciesId);
    } else {
      await addToFavorites(speciesId);
    }
  }, [isFavorite, addToFavorites, removeFromFavorites]);

  const refresh = useCallback(async () => {
    await fetchFavorites();
  }, [fetchFavorites]);

  return {
    favorites,
    isLoading,
    error,
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    refresh,
  };
}

export default useFavorites;
