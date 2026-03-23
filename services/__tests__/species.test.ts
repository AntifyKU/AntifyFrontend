import { apiClient } from "@/services/api";
import {
  getSpecies,
  getSpeciesById,
  updateSpeciesById,
  searchSpecies,
} from "@/services/species";

jest.mock("@/services/api", () => ({
  apiClient: {
    get: jest.fn(),
    put: jest.fn(),
  },
}));

describe("species service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("builds query string from filters", async () => {
    (apiClient.get as jest.Mock).mockResolvedValue({ species: [], total: 0 });

    await getSpecies({
      search: "ant",
      colors: "black",
      page: 2,
      limit: 10,
    });

    expect(apiClient.get).toHaveBeenCalledWith(
      expect.stringContaining("/api/species?"),
    );
    const endpoint = (apiClient.get as jest.Mock).mock.calls[0][0];
    expect(endpoint).toContain("search=ant");
    expect(endpoint).toContain("colors=black");
    expect(endpoint).toContain("page=2");
    expect(endpoint).toContain("limit=10");
  });

  it("gets species by id", async () => {
    (apiClient.get as jest.Mock).mockResolvedValue({ id: "1" });
    await getSpeciesById("1");
    expect(apiClient.get).toHaveBeenCalledWith("/api/species/1");
  });

  it("updates species with auth token", async () => {
    (apiClient.put as jest.Mock).mockResolvedValue({ id: "1" });
    await updateSpeciesById("1", { name: "A" }, "token");
    expect(apiClient.put).toHaveBeenCalledWith(
      "/api/species/1",
      { name: "A" },
      { authToken: "token" },
    );
  });

  it("searchSpecies delegates to getSpecies", async () => {
    (apiClient.get as jest.Mock).mockResolvedValue({ species: [], total: 0 });
    await searchSpecies("fire ant", 5);
    const endpoint = (apiClient.get as jest.Mock).mock.calls[0][0];
    expect(endpoint).toContain("search=fire+ant");
    expect(endpoint).toContain("limit=5");
  });
});
