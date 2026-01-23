/**
 * useFolders Hook
 * Manages folders state and operations
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  foldersService, 
  Folder, 
  CreateFolderRequest, 
  UpdateFolderRequest 
} from '@/services/folders';

interface UseFoldersResult {
  folders: Folder[];
  isLoading: boolean;
  error: string | null;
  createFolder: (name: string, color?: string, icon?: string) => Promise<Folder>;
  updateFolder: (id: string, data: UpdateFolderRequest) => Promise<void>;
  deleteFolder: (id: string, deleteItems?: boolean) => Promise<{ items_affected: number; items_deleted: boolean }>;
  refresh: () => Promise<void>;
}

export function useFolders(): UseFoldersResult {
  const { token, isAuthenticated } = useAuth();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Ref to track latest folders (avoids stale closure in callbacks)
  const foldersRef = useRef<Folder[]>(folders);
  
  // Keep ref in sync with state
  useEffect(() => {
    foldersRef.current = folders;
  }, [folders]);

  // Fetch folders when authenticated
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchFolders();
    } else {
      setFolders([]);
    }
  }, [isAuthenticated, token]);

  const fetchFolders = useCallback(async () => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await foldersService.getFolders(token);
      setFolders(response.folders);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch folders');
      console.error('[useFolders] Error fetching folders:', err);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const createFolder = useCallback(async (
    name: string,
    color: string = '#22A45D',
    icon: string = 'folder'
  ): Promise<Folder> => {
    if (!token) {
      throw new Error('You must be logged in to create folders');
    }

    const data: CreateFolderRequest = { name, color, icon };

    try {
      const newFolder = await foldersService.createFolder(token, data);
      setFolders(prev => [newFolder, ...prev]);
      console.log('[useFolders] Created folder:', newFolder.name);
      return newFolder;
    } catch (err: any) {
      console.error('[useFolders] Error creating folder:', err);
      throw err;
    }
  }, [token]);

  const updateFolder = useCallback(async (
    id: string,
    data: UpdateFolderRequest
  ): Promise<void> => {
    if (!token) {
      throw new Error('You must be logged in to update folders');
    }

    try {
      const updatedFolder = await foldersService.updateFolder(token, id, data);
      setFolders(prev => prev.map(f => f.id === id ? updatedFolder : f));
      console.log('[useFolders] Updated folder:', id);
    } catch (err: any) {
      console.error('[useFolders] Error updating folder:', err);
      throw err;
    }
  }, [token]);

  const deleteFolder = useCallback(async (
    id: string,
    deleteItems: boolean = false
  ): Promise<{ items_affected: number; items_deleted: boolean }> => {
    if (!token) {
      throw new Error('You must be logged in to delete folders');
    }

    try {
      const result = await foldersService.deleteFolder(token, id, deleteItems);
      setFolders(prev => prev.filter(f => f.id !== id));
      console.log('[useFolders] Deleted folder:', id, 'items_affected:', result.items_affected);
      return {
        items_affected: result.items_affected,
        items_deleted: result.items_deleted
      };
    } catch (err: any) {
      console.error('[useFolders] Error deleting folder:', err);
      throw err;
    }
  }, [token]);

  const refresh = useCallback(async () => {
    await fetchFolders();
  }, [fetchFolders]);

  return {
    folders,
    isLoading,
    error,
    createFolder,
    updateFolder,
    deleteFolder,
    refresh,
  };
}

export default useFolders;
