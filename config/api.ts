/**
 * API Configuration
 * Central configuration for API endpoints
 */

// Base URL for the backend API
// For development:
// - iOS Simulator: use 'localhost'
// - Android Emulator: use '10.0.2.2'
// - Physical device: use your machine's IP address
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

// API endpoints
export const API_ENDPOINTS = {
  // Species
  species: '/api/species',
  speciesById: (id: string) => `/api/species/${id}`,
  
  // News
  news: '/api/news',
  newsRefresh: '/api/news/refresh',
  
  // Identification
  identify: '/api/identify',
  identifyBase64: '/api/identify/base64',
  identifyDetect: '/api/identify/detect',
  identifyHealth: '/api/identify/health',
  
  // User Collection & Favorites
  collection: '/api/users/me/collection',
  collectionItem: (id: string) => `/api/users/me/collection/${id}`,
  collectionCheck: (speciesId: string) => `/api/users/me/collection/${speciesId}/check`,
  favorites: '/api/users/me/favorites',
  favoritesItem: (id: string) => `/api/users/me/favorites/${id}`,
  favoritesCheck: (speciesId: string) => `/api/users/me/favorites/${speciesId}/check`,
  
  // Feedback
  feedback: '/api/feedback',
  feedbackAI: '/api/feedback/ai',
  speciesCorrections: (speciesId: string) => `/api/species/${speciesId}/corrections`,
  
  // Auth
  login: '/api/auth/login',
  signup: '/api/auth/signup',
  logout: '/api/auth/logout',
  me: '/api/users/me',
} as const;

// Request timeout in milliseconds
export const API_TIMEOUT = 30000;
