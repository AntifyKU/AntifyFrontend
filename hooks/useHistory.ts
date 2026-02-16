/**
 * useHistory Hook
 * Manages identification history state
 */

import { useState, useEffect, useCallback } from "react";
import { historyService } from "@/services/history";
import { HistoryItem } from "@/types/api";

interface UseHistoryResult {
  history: HistoryItem[];
  isLoading: boolean;
  error: string | null;
  addToHistory: (
    item: Omit<HistoryItem, "id" | "identified_at">,
  ) => Promise<HistoryItem>;
  deleteItem: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
  updateNotes: (id: string, notes: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useHistory(): UseHistoryResult {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load history on mount
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await historyService.getHistory();
      setHistory(response.items);
    } catch (err: any) {
      setError(err.message || "Failed to load history");
      console.error("Error loading history:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addToHistory = useCallback(
    async (item: Omit<HistoryItem, "id" | "identified_at">) => {
      try {
        const newItem = await historyService.addHistoryItem(item);
        setHistory((prev) => [newItem, ...prev]);
        return newItem;
      } catch (err: any) {
        console.error("Error adding to history:", err);
        throw err;
      }
    },
    [],
  );

  const deleteItem = useCallback(async (id: string) => {
    try {
      await historyService.deleteHistoryItem(id);
      setHistory((prev) => prev.filter((item) => item.id !== id));
    } catch (err: any) {
      console.error("Error deleting history item:", err);
      throw err;
    }
  }, []);

  const clearAll = useCallback(async () => {
    try {
      await historyService.clearHistory();
      setHistory([]);
    } catch (err: any) {
      console.error("Error clearing history:", err);
      throw err;
    }
  }, []);

  const updateNotes = useCallback(async (id: string, notes: string) => {
    try {
      await historyService.updateHistoryNotes(id, notes);
      setHistory((prev) =>
        prev.map((item) => (item.id === id ? { ...item, notes } : item)),
      );
    } catch (err: any) {
      console.error("Error updating notes:", err);
      throw err;
    }
  }, []);

  const refresh = useCallback(async () => {
    await loadHistory();
  }, [loadHistory]);

  return {
    history,
    isLoading,
    error,
    addToHistory,
    deleteItem,
    clearAll,
    updateNotes,
    refresh,
  };
}

export default useHistory;
