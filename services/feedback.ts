import { apiClient } from "./api";
import { API_ENDPOINTS } from "@/config/api";
import type {
  FeedbackRequest,
  FeedbackResponse,
  AIFeedbackRequest,
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

export async function submitAIFeedback(
  feedback: AIFeedbackRequest,
  authToken?: string,
): Promise<FeedbackResponse> {
  return apiClient.post<FeedbackResponse>(API_ENDPOINTS.feedbackAI, feedback, {
    authToken,
  });
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
  submitAIFeedback,
  submitSpeciesCorrection,
};

export default feedbackService;
