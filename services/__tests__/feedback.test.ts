import { apiClient } from "@/services/api";
import {
  submitFeedback,
  submitAIFeedback,
  submitSpeciesCorrection,
} from "@/services/feedback";

jest.mock("@/services/api", () => ({
  apiClient: {
    post: jest.fn(),
  },
}));

describe("feedback service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("submits app feedback", async () => {
    (apiClient.post as jest.Mock).mockResolvedValue({ id: "1" });
    await submitFeedback({ rating: 4 }, "token");
    expect(apiClient.post).toHaveBeenCalledWith(
      "/api/feedback",
      { rating: 4 },
      { authToken: "token" },
    );
  });

  it("submits AI feedback", async () => {
    (apiClient.post as jest.Mock).mockResolvedValue({ id: "2" });
    await submitAIFeedback({ original_prediction: "x", is_correct: true });
    expect(apiClient.post).toHaveBeenCalledWith(
      "/api/feedback/ai",
      { original_prediction: "x", is_correct: true },
      { authToken: undefined },
    );
  });

  it("submits species correction to species-specific endpoint", async () => {
    (apiClient.post as jest.Mock).mockResolvedValue({ id: "3" });
    await submitSpeciesCorrection(
      "sp1",
      {
        field_name: "about",
        current_value: "old",
        suggested_value: "new",
        reason: "fix",
      },
      "token",
    );
    expect(apiClient.post).toHaveBeenCalledWith(
      "/api/species/sp1/corrections",
      {
        field_name: "about",
        current_value: "old",
        suggested_value: "new",
        reason: "fix",
      },
      { authToken: "token" },
    );
  });
});
