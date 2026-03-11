import { apiClient } from "./api";
import { API_ENDPOINTS } from "@/config/api";
import type {
  FeedbackRequest,
  FeedbackResponse,
  AICorrectionRequest,
  SpeciesCorrectionRequest,
} from "@/types/api";

export async function submitFeedback(
  feedback: FeedbackRequest,
  authToken?: string,
): Promise<FeedbackResponse> {
  return apiClient.post<FeedbackResponse>(API_ENDPOINTS.feedback, feedback, {
    authToken,
  });
}

export async function submitAICorrection(
  correction: AICorrectionRequest,
  authToken?: string,
): Promise<FeedbackResponse> {
  return apiClient.post<FeedbackResponse>(
    API_ENDPOINTS.feedbackAI,
    correction,
    { authToken },
  );
}

export async function submitSpeciesCorrection(
  speciesId: string,
  correction: SpeciesCorrectionRequest,
  authToken?: string,
): Promise<FeedbackResponse> {
  return apiClient.post<FeedbackResponse>(
    API_ENDPOINTS.speciesCorrections(speciesId),
    correction,
    { authToken },
  );
}

export const feedbackService = {
  submitFeedback,
  submitAICorrection,
  submitSpeciesCorrection,
};

export default feedbackService;
