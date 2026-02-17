/**
 * Identification Service
 * API calls for AI ant identification
 */

import { apiClient } from './api';
import { API_ENDPOINTS } from '@/config/api';
import type { 
  DetectionResponse, 
  ClassificationResponse,
  IdentifyBase64Request,
  HealthResponse,
} from '@/types/api';

/**
 * Check if AI service is healthy
 */
export async function checkHealth(): Promise<HealthResponse> {
  return apiClient.get<HealthResponse>(API_ENDPOINTS.identifyHealth);
}

/**
 * Identify ant species from base64 image
 */
export async function identifyFromBase64(
  imageBase64: string,
  mimeType = 'image/jpeg',
  confidenceThreshold = 0.5
): Promise<ClassificationResponse> {
  const data: IdentifyBase64Request = {
    image_base64: imageBase64,
    mime_type: mimeType,
    confidence_threshold: confidenceThreshold,
  };
  return apiClient.post<ClassificationResponse>(API_ENDPOINTS.identifyBase64, data);
}

/**
 * Detect ants in image from base64
 */
export async function detectFromBase64(
  imageBase64: string,
  mimeType = 'image/jpeg',
  confidenceThreshold = 0.25
): Promise<DetectionResponse> {
  const data = {
    image_base64: imageBase64,
    mime_type: mimeType,
    confidence_threshold: confidenceThreshold,
  };
  return apiClient.post<DetectionResponse>(API_ENDPOINTS.identifyDetect, data);
}

/**
 * Identify ant from image file using FormData
 */
export async function identifyFromFile(
  imageUri: string,
  fileName = 'image.jpg',
  mimeType = 'image/jpeg'
): Promise<ClassificationResponse> {
  const formData = new FormData();
  formData.append('file', {
    uri: imageUri,
    name: fileName,
    type: mimeType,
  } as unknown as Blob);
  
  return apiClient.postFormData<ClassificationResponse>(API_ENDPOINTS.identify, formData);
}

/**
 * Detect ants in image file using FormData
 */
export async function detectFromFile(
  imageUri: string,
  fileName = 'image.jpg',
  mimeType = 'image/jpeg'
): Promise<DetectionResponse> {
  const formData = new FormData();
  formData.append('file', {
    uri: imageUri,
    name: fileName,
    type: mimeType,
  } as unknown as Blob);
  
  return apiClient.postFormData<DetectionResponse>(API_ENDPOINTS.identifyDetect, formData);
}

export const identificationService = {
  checkHealth,
  identifyFromBase64,
  detectFromBase64,
  identifyFromFile,
  detectFromFile,
};

export default identificationService;
