/**
 * History Service
 * Handles local storage of identification history
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { HistoryItem, HistoryListResponse } from "@/types/api";

const HISTORY_KEY = "@ant_identify_history";
const MAX_HISTORY_ITEMS = 100; // Maximum number of items to keep

/**
 * Get all history items
 */
export async function getHistory(): Promise<HistoryListResponse> {
  try {
    const historyJson = await AsyncStorage.getItem(HISTORY_KEY);

    if (!historyJson) {
      return { items: [], total: 0 };
    }

    const items: HistoryItem[] = JSON.parse(historyJson);

    // Sort by date (newest first)
    items.sort(
      (a, b) =>
        new Date(b.identified_at).getTime() -
        new Date(a.identified_at).getTime(),
    );

    return {
      items,
      total: items.length,
    };
  } catch (error) {
    console.error("Error getting history:", error);
    return { items: [], total: 0 };
  }
}

/**
 * Add a new history item
 */
export async function addHistoryItem(
  item: Omit<HistoryItem, "id" | "identified_at">,
): Promise<HistoryItem> {
  try {
    const { items } = await getHistory();

    const newItem: HistoryItem = {
      ...item,
      id: `history_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      identified_at: new Date().toISOString(),
    };

    // Add to beginning of array
    items.unshift(newItem);

    // Keep only the most recent items
    const trimmedItems = items.slice(0, MAX_HISTORY_ITEMS);

    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(trimmedItems));

    return newItem;
  } catch (error) {
    console.error("Error adding history item:", error);
    throw error;
  }
}

/**
 * Delete a history item
 */
export async function deleteHistoryItem(id: string): Promise<void> {
  try {
    const { items } = await getHistory();
    const filteredItems = items.filter((item) => item.id !== id);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(filteredItems));
  } catch (error) {
    console.error("Error deleting history item:", error);
    throw error;
  }
}

/**
 * Clear all history
 */
export async function clearHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error("Error clearing history:", error);
    throw error;
  }
}

/**
 * Update history item notes
 */
export async function updateHistoryNotes(
  id: string,
  notes: string,
): Promise<void> {
  try {
    const { items } = await getHistory();
    const itemIndex = items.findIndex((item) => item.id === id);

    if (itemIndex === -1) {
      throw new Error("History item not found");
    }

    items[itemIndex].notes = notes;
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Error updating history notes:", error);
    throw error;
  }
}

export const historyService = {
  getHistory,
  addHistoryItem,
  deleteHistoryItem,
  clearHistory,
  updateHistoryNotes,
};

export default historyService;
