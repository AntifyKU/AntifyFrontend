import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  saveRecord,
  getRecords,
  deleteRecord,
  getRecordCount,
} from "@/services/history";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "uuid-1"),
}));

describe("history service", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await (AsyncStorage as any).clear();
  });

  it("saves and retrieves records", async () => {
    await saveRecord({
      imageBase64: "img",
      imageMimeType: "image/jpeg",
      speciesName: "Fire Ant",
      commonName: null,
      confidence: 0.9,
      speciesInfo: null,
      topPredictions: [],
    });

    const records = await getRecords();
    expect(records).toHaveLength(1);
    expect(records[0].id).toBe("uuid-1");
    expect(await getRecordCount()).toBe(1);
  });

  it("filters by search string", async () => {
    await saveRecord({
      imageBase64: "img",
      imageMimeType: "image/jpeg",
      speciesName: "Green Tree Ant",
      commonName: "Tree ant",
      confidence: 0.8,
      speciesInfo: null,
      topPredictions: [],
    });

    const records = await getRecords({ search: "tree" });
    expect(records).toHaveLength(1);
    expect(records[0].speciesName).toContain("Tree");
  });

  it("deletes record and updates index", async () => {
    const rec = await saveRecord({
      imageBase64: "img",
      imageMimeType: "image/jpeg",
      speciesName: "Ant",
      commonName: null,
      confidence: 0.3,
      speciesInfo: null,
      topPredictions: [],
    });

    await deleteRecord(rec.id);
    expect(await getRecordCount()).toBe(0);
    expect(await getRecords()).toEqual([]);
  });
});
