import { apiClient } from "@/services/api";
import {
  addToCollection,
  removeFromCollection,
  checkCollection,
} from "@/services/collection";

jest.mock("@/services/api", () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  },
}));

describe("collection service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("adds item to collection with auth", async () => {
    (apiClient.post as jest.Mock).mockResolvedValue({ id: "c1" });
    await addToCollection("token", { species_id: "s1", notes: "note" });

    expect(apiClient.post).toHaveBeenCalledWith(
      "/api/users/me/collection",
      { species_id: "s1", notes: "note" },
      { authToken: "token" },
    );
  });

  it("removes collection item by item id", async () => {
    (apiClient.delete as jest.Mock).mockResolvedValue({ message: "ok" });
    await removeFromCollection("token", "item-1");

    expect(apiClient.delete).toHaveBeenCalledWith(
      "/api/users/me/collection/item-1",
      { authToken: "token" },
    );
  });

  it("checks species collection status", async () => {
    (apiClient.get as jest.Mock).mockResolvedValue({ in_collection: false });
    await checkCollection("token", "sp-9");

    expect(apiClient.get).toHaveBeenCalledWith(
      "/api/users/me/collection/sp-9/check",
      { authToken: "token" },
    );
  });
});
