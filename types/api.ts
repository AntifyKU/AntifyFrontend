/**
 * API Response Types
 * TypeScript types matching backend schemas
 */

// ============================================================================
// Species Types
// ============================================================================

export interface SpeciesClassification {
  family: string;
  subfamily: string;
  genus: string;
}

export interface Species {
  id: string;
  name: string;
  scientific_name: string;
  classification: SpeciesClassification;
  tags: string[];
  about: string;
  characteristics: string;
  colors: string[];
  habitat: string[];
  distribution: string[];
  behavior: string;
  ecological_role: string;
  image: string;
  created_at?: string;
  updated_at?: string;
}

export interface SpeciesListResponse {
  species: Species[];
  total: number;
  page: number;
  limit: number;
}

export interface SpeciesFilters {
  search?: string;
  tags?: string;
  colors?: string;
  habitat?: string;
  distribution?: string;
  page?: number;
  limit?: number;
}

// ============================================================================
// News Types
// ============================================================================

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  link: string;
  image?: string;
  source: string;
  published_at?: string;
  fetched_at?: string;
}

export interface NewsListResponse {
  items: NewsItem[];
  total: number;
  last_updated?: string;
}

// ============================================================================
// Identification Types
// ============================================================================

export interface Detection {
  class_id: number;
  class_name: string;
  confidence: number;
  bbox: number[]; // [x1, y1, x2, y2]
}

export interface DetectionResponse {
  success: boolean;
  message: string;
  num_detections: number;
  detections: Detection[];
  image_size: number[]; // [width, height]
}

export interface ClassificationResult {
  rank: number;
  class_name: string;
  confidence: number;
}

export interface ClassificationResponse {
  success: boolean;
  message: string;
  top_prediction: string;
  top_confidence: number;
  top5_predictions: ClassificationResult[];
}

export interface IdentifyBase64Request {
  image_base64: string;
  mime_type?: string;
  confidence_threshold?: number;
}

// ============================================================================
// Collection & Favorites Types
// ============================================================================

export interface CollectionItem {
  id: string;
  species_id: string;
  species_name: string;
  scientific_name: string;
  image_url?: string;
  notes?: string;
  location?: string;
  added_at: string;
}

export interface CollectionListResponse {
  items: CollectionItem[];
  total: number;
}

export interface AddToCollectionRequest {
  species_id: string;
  notes?: string;
  location?: string;
  image_url?: string;
}

export interface FavoriteItem {
  id: string;
  species_id: string;
  species_name: string;
  scientific_name: string;
  image_url?: string;
  added_at: string;
}

export interface FavoritesListResponse {
  favorites: FavoriteItem[];
  total: number;
}

// ============================================================================
// Feedback Types
// ============================================================================

export interface FeedbackRequest {
  rating: number;
  likes?: string[];
  improvements?: string[];
  additional_notes?: string;
  species_id?: string;
  identification_session_id?: string;
}

export interface FeedbackResponse {
  id: string;
  message: string;
}

export interface AICorrectionRequest {
  original_prediction: string;
  correct_species_id: string;
  image_base64?: string;
  notes?: string;
}

export interface SpeciesCorrectionRequest {
  field: string;
  original_value: string;
  suggested_value: string;
  notes?: string;
}

// ============================================================================
// Auth Types
// ============================================================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  display_name?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    uid: string;
    email: string;
    display_name?: string;
  };
}

export interface UserProfile {
  uid: string;
  email: string;
  display_name?: string;
  photo_url?: string;
  role?: string;
  created_at?: string;
}

// ============================================================================
// Common Types
// ============================================================================

export interface ApiErrorResponse {
  detail: string;
  status_code?: number;
}

export interface HealthResponse {
  status: string;
  models_loaded?: string[];
}
