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
  // Ensure URI is correctly formatted for React Native fetch
  let formattedUri = imageUri;
  if (!imageUri.startsWith("file://") && !imageUri.startsWith("http") && !imageUri.startsWith("data:")) {
    formattedUri = `file://${imageUri}`;
  }

  console.log(`[identification] Preparing classification for ${formattedUri} (${mimeType})`);

  const formData = new FormData();
  formData.append("file", {
    uri: formattedUri,
    name: fileName,
    type: mimeType,
  } as any);

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
  // Ensure URI is correctly formatted for React Native fetch
  let formattedUri = imageUri;
  if (!imageUri.startsWith("file://") && !imageUri.startsWith("http") && !imageUri.startsWith("data:")) {
    formattedUri = `file://${imageUri}`;
  }

  console.log(`[identification] Preparing detection for ${formattedUri} (${mimeType})`);

  const formData = new FormData();
  formData.append("file", {
    uri: formattedUri,
    name: fileName,
    type: mimeType,
  } as any);

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
  // Ensure URI is correctly formatted for React Native fetch
  let formattedUri = imageUri;
  if (!imageUri.startsWith("file://") && !imageUri.startsWith("http") && !imageUri.startsWith("data:")) {
    formattedUri = `file://${imageUri}`;
  }

  console.log(`[identification] Preparing upload for ${formattedUri} (${mimeType})`);

  const formData = new FormData();
  formData.append("file", {
    uri: formattedUri,
    name: fileName,
    type: mimeType,
  } as any);

  return apiClient.postFormData<SpeciesDetailsResponse>(
    API_ENDPOINTS.identifySpeciesDetails,
    formData,
  );
}

export async function identifySpeciesFromBase64(
  imageBase64: string,
  mimeType = "image/jpeg",
): Promise<SpeciesDetailsResponse> {
  return apiClient.post<SpeciesDetailsResponse>(
    API_ENDPOINTS.identifySpeciesDetailsBase64,
    {
      image_base64: imageBase64,
      mime_type: mimeType,
    },
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
