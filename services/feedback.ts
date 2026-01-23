/**
 * Feedback Service
 * API calls for user feedback and AI corrections
 */

import { apiClient } from './api';
import { API_ENDPOINTS } from '@/config/api';
import type { 
  FeedbackRequest, 
  FeedbackResponse,
  AICorrectionRequest,
  SpeciesCorrectionRequest,
} from '@/types/api';

/**
 * Submit general feedback
 */
export async function submitFeedback(
  feedback: FeedbackRequest,
  authToken?: string
): Promise<FeedbackResponse> {
  return apiClient.post<FeedbackResponse>(API_ENDPOINTS.feedback, feedback, { authToken });
}

/**
 * Submit AI correction (when identification was wrong)
 */
export async function submitAICorrection(
  correction: AICorrectionRequest,
  authToken?: string
): Promise<FeedbackResponse> {
  return apiClient.post<FeedbackResponse>(API_ENDPOINTS.feedbackAI, correction, { authToken });
}

/**
 * Submit species data correction
 */
export async function submitSpeciesCorrection(
  speciesId: string,
  correction: SpeciesCorrectionRequest,
  authToken?: string
): Promise<FeedbackResponse> {
  return apiClient.post<FeedbackResponse>(
    API_ENDPOINTS.speciesCorrections(speciesId),
    correction,
    { authToken }
  );
}

export const feedbackService = {
  submitFeedback,
  submitAICorrection,
  submitSpeciesCorrection,
};

export default feedbackService;
