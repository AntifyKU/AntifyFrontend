import { apiClient } from "@/services/api";
import {
  identifyFromBase64,
  detectFromBase64,
  identifySpeciesFromBase64,
} from "@/services/identification";

jest.mock("@/services/api", () => ({
  apiClient: {
    post: jest.fn(),
    postFormData: jest.fn(),
    get: jest.fn(),
  },
}));

describe("identification service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("sends identify base64 payload with defaults", async () => {
    (apiClient.post as jest.Mock).mockResolvedValue({ success: true });

    await identifyFromBase64("abc");

    expect(apiClient.post).toHaveBeenCalledWith("/api/identify/base64", {
      image_base64: "abc",
      mime_type: "image/jpeg",
      confidence_threshold: 0.5,
    });
  });

  it("sends detect base64 payload with custom threshold", async () => {
    (apiClient.post as jest.Mock).mockResolvedValue({ success: true });

    await detectFromBase64("abc", "image/png", 0.4);
    expect(apiClient.post).toHaveBeenCalledWith("/api/identify/detect", {
      image_base64: "abc",
      mime_type: "image/png",
      confidence_threshold: 0.4,
    });
  });

  it("sends identify species base64 payload", async () => {
    (apiClient.post as jest.Mock).mockResolvedValue({ success: true });
    await identifySpeciesFromBase64("base", "image/webp");
    expect(apiClient.post).toHaveBeenCalledWith("/api/identify/species/details", {
      image_base64: "base",
      mime_type: "image/webp",
    });
  });
});
