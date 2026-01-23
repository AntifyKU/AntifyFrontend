/**
 * useCollection Hook
 * Manages collection state and operations
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { collectionService, CollectionItem, AddToCollectionRequest } from '@/services/collection';
import { foldersService } from '@/services/folders';

interface UseCollectionResult {
  collection: CollectionItem[];
  isLoading: boolean;
  error: string | null;
  isInCollection: (speciesId: string) => boolean;
  getCollectionItem: (speciesId: string) => CollectionItem | undefined;
  addToCollection: (speciesId: string, notes?: string, location?: string, folderIds?: string[]) => Promise<CollectionItem>;
  removeFromCollection: (speciesId: string) => Promise<void>;
  toggleCollection: (speciesId: string) => Promise<void>;
  addItemToFolders: (speciesId: string, folderIds: string[]) => Promise<void>;
  removeItemFromFolder: (speciesId: string, folderId: string) => Promise<void>;
  setItemFolders: (speciesId: string, folderIds: string[]) => Promise<void>;
  getItemsByFolder: (folderId: string | null) => CollectionItem[];
  refresh: () => Promise<void>;
}

export function useCollection(): UseCollectionResult {
  const { token, isAuthenticated } = useAuth();
  const [collection, setCollection] = useState<CollectionItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Ref to track latest collection (avoids stale closure in callbacks)
  const collectionRef = useRef<CollectionItem[]>(collection);
  
  // Keep ref in sync with state
  useEffect(() => {
    collectionRef.current = collection;
  }, [collection]);

  // Fetch collection when authenticated
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchCollection();
    } else {
      setCollection([]);
    }
  }, [isAuthenticated, token]);

  const fetchCollection = useCallback(async () => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await collectionService.getCollection(token);
      console.log('[useCollection] Fetched collection, count:', response.items.length);
      console.log('[useCollection] Items:', response.items.map(i => ({ id: i.id, species_id: i.species_id, species_name: i.species_name })));
      setCollection(response.items);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch collection');
      console.error('Error fetching collection:', err);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const isInCollection = useCallback((speciesId: string): boolean => {
    return collection.some(item => item.species_id === speciesId);
  }, [collection]);

  const getCollectionItem = useCallback((speciesId: string): CollectionItem | undefined => {
    return collection.find(item => item.species_id === speciesId);
  }, [collection]);

  const addToCollection = useCallback(async (
    speciesId: string,
    notes?: string,
    location?: string,
    folderIds?: string[]
  ): Promise<CollectionItem> => {
    if (!token) {
      throw new Error('You must be logged in to add to collection');
    }

    const data: AddToCollectionRequest = { species_id: speciesId };
    if (notes) data.notes = notes;
    if (location) data.location = location;
    if (folderIds && folderIds.length > 0) data.folder_ids = folderIds;

    try {
      const newItem = await collectionService.addToCollection(token, data);
      console.log('[useCollection] API returned newItem:', JSON.stringify(newItem, null, 2));
      
      // Ensure folder_ids is always an array
      if (!newItem.folder_ids) {
        newItem.folder_ids = folderIds || [];
      }
      
      setCollection(prev => {
        const updated = [...prev, newItem];
        console.log('[useCollection] Updated collection length:', updated.length);
        return updated;
      });
      console.log('[useCollection] Added to collection:', newItem.id, 'species_name:', newItem.species_name);
      return newItem;
    } catch (err: any) {
      console.error('Error adding to collection:', err);
      throw err;
    }
  }, [token]);

  const removeFromCollection = useCallback(async (speciesId: string) => {
    if (!token) {
      throw new Error('You must be logged in to remove from collection');
    }

    // Use ref to get latest collection (avoids stale closure)
    const currentCollection = collectionRef.current;
    const item = currentCollection.find(c => c.species_id === speciesId);
    
    if (!item) {
      console.warn('[useCollection] Item not found in collection:', speciesId);
      return;
    }

    console.log('[useCollection] Removing from collection:', item.id, 'for species:', speciesId);

    try {
      await collectionService.removeFromCollection(token, item.id);
      console.log('[useCollection] Successfully removed from API');
      setCollection(prev => prev.filter(c => c.species_id !== speciesId));
    } catch (err: any) {
      console.error('[useCollection] Error removing from collection:', err);
      throw err;
    }
  }, [token]);

  const toggleCollection = useCallback(async (speciesId: string) => {
    if (isInCollection(speciesId)) {
      await removeFromCollection(speciesId);
    } else {
      await addToCollection(speciesId);
    }
  }, [isInCollection, addToCollection, removeFromCollection]);

  const addItemToFolders = useCallback(async (speciesId: string, folderIds: string[]) => {
    if (!token) {
      throw new Error('You must be logged in to manage folders');
    }

    const currentCollection = collectionRef.current;
    const item = currentCollection.find(c => c.species_id === speciesId);
    
    if (!item) {
      console.warn('[useCollection] Item not found for folder assignment:', speciesId);
      return;
    }

    try {
      const result = await foldersService.addItemToFolders(token, item.id, folderIds);
      // Update local state
      setCollection(prev => prev.map(c => 
        c.species_id === speciesId 
          ? { ...c, folder_ids: result.folder_ids }
          : c
      ));
      console.log('[useCollection] Added item to folders:', result.folder_ids);
    } catch (err: any) {
      console.error('[useCollection] Error adding to folders:', err);
      throw err;
    }
  }, [token]);

  const removeItemFromFolder = useCallback(async (speciesId: string, folderId: string) => {
    if (!token) {
      throw new Error('You must be logged in to manage folders');
    }

    const currentCollection = collectionRef.current;
    const item = currentCollection.find(c => c.species_id === speciesId);
    
    if (!item) {
      console.warn('[useCollection] Item not found for folder removal:', speciesId);
      return;
    }

    try {
      const result = await foldersService.removeItemFromFolder(token, item.id, folderId);
      // Update local state
      setCollection(prev => prev.map(c => 
        c.species_id === speciesId 
          ? { ...c, folder_ids: result.folder_ids }
          : c
      ));
      console.log('[useCollection] Removed item from folder:', folderId);
    } catch (err: any) {
      console.error('[useCollection] Error removing from folder:', err);
      throw err;
    }
  }, [token]);

  const setItemFolders = useCallback(async (speciesId: string, folderIds: string[]) => {
    if (!token) {
      throw new Error('You must be logged in to manage folders');
    }

    const currentCollection = collectionRef.current;
    const item = currentCollection.find(c => c.species_id === speciesId);
    
    if (!item) {
      console.warn('[useCollection] Item not found for folder update:', speciesId);
      return;
    }

    try {
      const result = await foldersService.setItemFolders(token, item.id, folderIds);
      // Update local state
      setCollection(prev => prev.map(c => 
        c.species_id === speciesId 
          ? { ...c, folder_ids: result.folder_ids }
          : c
      ));
      console.log('[useCollection] Set item folders:', result.folder_ids);
    } catch (err: any) {
      console.error('[useCollection] Error setting folders:', err);
      throw err;
    }
  }, [token]);

  const getItemsByFolder = useCallback((folderId: string | null): CollectionItem[] => {
    if (folderId === null) {
      // Return all items
      return collection;
    }
    return collection.filter(item => item.folder_ids?.includes(folderId));
  }, [collection]);

  const refresh = useCallback(async () => {
    await fetchCollection();
  }, [fetchCollection]);

  return {
    collection,
    isLoading,
    error,
    isInCollection,
    getCollectionItem,
    addToCollection,
    removeFromCollection,
    toggleCollection,
    addItemToFolders,
    removeItemFromFolder,
    setItemFolders,
    getItemsByFolder,
    refresh,
  };
}

export default useCollection;
