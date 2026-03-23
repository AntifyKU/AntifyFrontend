import { apiClient } from "./api";
import { API_ENDPOINTS } from "@/config/api";
import type {
  DetectionResponse,
  ClassificationResponse,
  IdentifyBase64Request,
  HealthResponse,
  SpeciesDetailsResponse,
} from "@/types/api";

export async function checkHealth(): Promise<HealthResponse> {
  return apiClient.get<HealthResponse>(API_ENDPOINTS.identifyHealth);
}

export async function identifyFromBase64(
  imageBase64: string,
  mimeType = "image/jpeg",
  confidenceThreshold = 0.5,
): Promise<ClassificationResponse> {
  const data: IdentifyBase64Request = {
    image_base64: imageBase64,
    mime_type: mimeType,
    confidence_threshold: confidenceThreshold,
  };
  return apiClient.post<ClassificationResponse>(
    API_ENDPOINTS.identifyBase64,
    data,
  );
}

export async function detectFromBase64(
  imageBase64: string,
  mimeType = "image/jpeg",
  confidenceThreshold = 0.25,
): Promise<DetectionResponse> {
  const data = {
    image_base64: imageBase64,
    mime_type: mimeType,
    confidence_threshold: confidenceThreshold,
  };
  return apiClient.post<DetectionResponse>(API_ENDPOINTS.identifyDetect, data);
}

export async function identifyFromFile(
  imageUri: string,
  fileName = "image.jpg",
  mimeType = "image/jpeg",
): Promise<ClassificationResponse> {
  const formData = new FormData();
  formData.append("file", {
    uri: imageUri,
    name: fileName,
    type: mimeType,
  } as unknown as Blob);

  return apiClient.postFormData<ClassificationResponse>(
    API_ENDPOINTS.identify,
    formData,
  );
}

export async function detectFromFile(
  imageUri: string,
  fileName = "image.jpg",
  mimeType = "image/jpeg",
): Promise<DetectionResponse> {
  const formData = new FormData();
  formData.append("file", {
    uri: imageUri,
    name: fileName,
    type: mimeType,
  } as unknown as Blob);

  return apiClient.postFormData<DetectionResponse>(
    API_ENDPOINTS.identifyDetect,
    formData,
  );
}

export async function identifySpeciesFromFile(
  imageUri: string,
  fileName = "image.jpg",
  mimeType = "image/jpeg",
): Promise<SpeciesDetailsResponse> {
  const formData = new FormData();
  formData.append("file", {
    uri: imageUri,
    name: fileName,
    type: mimeType,
  } as unknown as Blob);

  return apiClient.postFormData<SpeciesDetailsResponse>(
    API_ENDPOINTS.identifySpeciesDetails,
    formData,
  );
}

export async function identifySpeciesFromBase64(
  imageBase64: string,
  mimeType = "image/jpeg",
): Promise<SpeciesDetailsResponse> {
  const data = {
    image_base64: imageBase64,
    mime_type: mimeType,
  };
  return apiClient.post<SpeciesDetailsResponse>(
    API_ENDPOINTS.identifySpeciesDetails,
    data,
  );
}

export const identificationService = {
  checkHealth,
  identifyFromBase64,
  detectFromBase64,
  identifyFromFile,
  detectFromFile,
  identifySpeciesFromFile,
  identifySpeciesFromBase64,
};

export default identificationService;
