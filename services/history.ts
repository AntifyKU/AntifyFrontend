import AsyncStorage from "@react-native-async-storage/async-storage";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

import type {
  HistoryFilter,
  HistoryRecord,
  NewHistoryRecord,
} from "@/types/api";

const INDEX_KEY = "history:index";
const RECORD_KEY = (id: string) => `history:record:${id}`;

const MAX_RECORDS = 200;

async function _getIndex(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(INDEX_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

async function _setIndex(index: string[]): Promise<void> {
  await AsyncStorage.setItem(INDEX_KEY, JSON.stringify(index));
}

async function _getRecord(id: string): Promise<HistoryRecord | null> {
  try {
    const raw = await AsyncStorage.getItem(RECORD_KEY(id));
    return raw ? (JSON.parse(raw) as HistoryRecord) : null;
  } catch {
    return null;
  }
}

export async function saveRecord(
  data: NewHistoryRecord,
): Promise<HistoryRecord> {
  const record: HistoryRecord = {
    ...data,
    id: uuidv4(),
    identifiedAt: new Date().toISOString(),
  };

  await AsyncStorage.setItem(RECORD_KEY(record.id), JSON.stringify(record));

  const index = await _getIndex();
  const newIndex = [record.id, ...index].slice(0, MAX_RECORDS);

  if (index.length >= MAX_RECORDS) {
    const evicted = index.slice(MAX_RECORDS - 1);
    await AsyncStorage.multiRemove(evicted.map(RECORD_KEY));
  }

  await _setIndex(newIndex);
  return record;
}

export async function getRecords(
  filter: HistoryFilter = {},
): Promise<HistoryRecord[]> {
  const { search, limit = 50 } = filter;

  const index = await _getIndex();
  if (index.length === 0) return [];

  const pairs = await AsyncStorage.multiGet(index.map(RECORD_KEY));
  let records: HistoryRecord[] = pairs
    .map(([, value]) => (value ? (JSON.parse(value) as HistoryRecord) : null))
    .filter((r): r is HistoryRecord => r !== null);

  if (search) {
    const lower = search.toLowerCase();
    records = records.filter(
      (r) =>
        r.speciesName.toLowerCase().includes(lower) ||
        (r.commonName?.toLowerCase().includes(lower) ?? false),
    );
  }

  return records.slice(0, limit);
}

export async function getRecord(id: string): Promise<HistoryRecord | null> {
  return _getRecord(id);
}

export async function deleteRecord(id: string): Promise<void> {
  await AsyncStorage.removeItem(RECORD_KEY(id));
  const index = await _getIndex();
  await _setIndex(index.filter((i) => i !== id));
}

export async function clearAllRecords(): Promise<void> {
  const index = await _getIndex();
  await AsyncStorage.multiRemove([INDEX_KEY, ...index.map(RECORD_KEY)]);
}

export async function getRecordCount(): Promise<number> {
  const index = await _getIndex();
  return index.length;
}

export const historyService = {
  saveRecord,
  getRecords,
  getRecord,
  deleteRecord,
  clearAllRecords,
  getRecordCount,
};

export default historyService;
