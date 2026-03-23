import { apiClient } from "@/services/api";
import { deleteFolder, setItemFolders } from "@/services/folders";

jest.mock("@/services/api", () => ({
  apiClient: {
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

describe("folders service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deletes folder with delete_items query", async () => {
    (apiClient.delete as jest.Mock).mockResolvedValue({ message: "ok" });
    await deleteFolder("token", "folder-1", true);

    expect(apiClient.delete).toHaveBeenCalledWith(
      "/api/users/me/folders/folder-1?delete_items=true",
      { authToken: "token" },
    );
  });

  it("sets item folders", async () => {
    (apiClient.put as jest.Mock).mockResolvedValue({
      message: "ok",
      folder_ids: ["f1"],
    });
    await setItemFolders("token", "item-1", ["f1"]);

    expect(apiClient.put).toHaveBeenCalledWith(
      "/api/users/me/collection/item-1/folders",
      { folder_ids: ["f1"] },
      { authToken: "token" },
    );
  });
});
