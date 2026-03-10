import { useCallback, useEffect, useState } from "react";
import { historyService } from "@/services/history";
import type {
  HistoryFilter,
  HistoryRecord,
  NewHistoryRecord,
} from "@/types/api";

let _cache: HistoryRecord[] | null = null;
let _cacheCount = 0;

type CacheListener = (records: HistoryRecord[], count: number) => void;
const _listeners = new Set<CacheListener>();

function _notify() {
  if (_cache !== null) {
    _listeners.forEach((fn) => fn(_cache!, _cacheCount));
  }
}

export function invalidateHistoryCache() {
  _cache = null;
}

export function prependToHistoryCache(record: HistoryRecord) {
  _cache = _cache ? [record, ..._cache] : [record];
  _cacheCount += 1;
  _notify();
}

interface UseHistoryReturn {
  records: HistoryRecord[];
  totalCount: number;
  loading: boolean;
  error: Error | null;
  loadRecords: (filter?: HistoryFilter) => Promise<void>;
  addRecord: (data: NewHistoryRecord) => Promise<HistoryRecord | null>;
  removeRecord: (id: string) => Promise<void>;
  clearHistory: () => Promise<void>;
  fetchRecord: (id: string) => Promise<HistoryRecord | null>;
}

export function useHistory(initialFilter?: HistoryFilter): UseHistoryReturn {
  const [records, setRecords] = useState<HistoryRecord[]>(_cache ?? []);
  const [totalCount, setTotalCount] = useState(_cacheCount);
  const [loading, setLoading] = useState(_cache === null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const listener: CacheListener = (newRecords, newCount) => {
      setRecords(newRecords);
      setTotalCount(newCount);
    };
    _listeners.add(listener);
    return () => {
      _listeners.delete(listener);
    };
  }, []);

  const loadRecords = useCallback(async (filter: HistoryFilter = {}) => {
    const hasFilter = Object.keys(filter).length > 0;
    if (_cache !== null && !hasFilter) {
      setRecords(_cache);
      setTotalCount(_cacheCount);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const [data, count] = await Promise.all([
        historyService.getRecords(filter),
        historyService.getRecordCount(),
      ]);
      if (!hasFilter) {
        _cache = data;
        _cacheCount = count;
      }
      setRecords(data);
      setTotalCount(count);
    } catch (err) {
      const wrapped =
        err instanceof Error ? err : new Error("Failed to load history");
      setError(wrapped);
      console.error("[useHistory] loadRecords:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addRecord = useCallback(
    async (data: NewHistoryRecord): Promise<HistoryRecord | null> => {
      setError(null);
      try {
        const saved = await historyService.saveRecord(data);
        // update cache immediately
        _cache = _cache ? [saved, ..._cache] : [saved];
        _cacheCount += 1;
        setRecords((prev) => [saved, ...prev]);
        setTotalCount((prev) => prev + 1);
        return saved;
      } catch (err) {
        const wrapped =
          err instanceof Error ? err : new Error("Failed to save record");
        setError(wrapped);
        console.error("[useHistory] addRecord:", err);
        return null;
      }
    },
    [],
  );

  const removeRecord = useCallback(async (id: string): Promise<void> => {
    setError(null);
    try {
      await historyService.deleteRecord(id);
      // update cache immediately
      if (_cache) _cache = _cache.filter((r) => r.id !== id);
      _cacheCount = Math.max(0, _cacheCount - 1);
      setRecords((prev) => prev.filter((r) => r.id !== id));
      setTotalCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      const wrapped =
        err instanceof Error ? err : new Error("Failed to delete record");
      setError(wrapped);
      console.error("[useHistory] removeRecord:", err);
    }
  }, []);

  const clearHistory = useCallback(async (): Promise<void> => {
    setError(null);
    try {
      await historyService.clearAllRecords();
      invalidateHistoryCache();
      setRecords([]);
      setTotalCount(0);
    } catch (err) {
      const wrapped =
        err instanceof Error ? err : new Error("Failed to clear history");
      setError(wrapped);
      console.error("[useHistory] clearHistory:", err);
    }
  }, []);

  const fetchRecord = useCallback(
    async (id: string): Promise<HistoryRecord | null> => {
      try {
        return await historyService.getRecord(id);
      } catch (err) {
        console.error("[useHistory] fetchRecord:", err);
        return null;
      }
    },
    [],
  );

  useEffect(() => {
    loadRecords(initialFilter);
  }, [loadRecords, initialFilter]);

  return {
    records,
    totalCount,
    loading,
    error,
    loadRecords,
    addRecord,
    removeRecord,
    clearHistory,
    fetchRecord,
  };
}

export default useHistory;
