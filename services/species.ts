/**
 * Species Service
 * API calls for species data
 */

import { apiClient } from './api';
import { API_ENDPOINTS } from '@/config/api';
import type { Species, SpeciesListResponse, SpeciesFilters } from '@/types/api';

/**
 * Get list of species with optional filters
 */
export async function getSpecies(filters?: SpeciesFilters): Promise<SpeciesListResponse> {
  const params = new URLSearchParams();
  
  if (filters?.search) params.append('search', filters.search);
  if (filters?.tags) params.append('tags', filters.tags);
  if (filters?.colors) params.append('colors', filters.colors);
  if (filters?.habitat) params.append('habitat', filters.habitat);
  if (filters?.distribution) params.append('distribution', filters.distribution);
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.limit) params.append('limit', filters.limit.toString());
  
  const queryString = params.toString();
  const endpoint = queryString 
    ? `${API_ENDPOINTS.species}?${queryString}` 
    : API_ENDPOINTS.species;
    
  return apiClient.get<SpeciesListResponse>(endpoint);
}

/**
 * Get a single species by ID
 */
export async function getSpeciesById(id: string): Promise<Species> {
  return apiClient.get<Species>(API_ENDPOINTS.speciesById(id));
}

/**
 * Search species by name or scientific name
 */
export async function searchSpecies(query: string, limit = 20): Promise<SpeciesListResponse> {
  return getSpecies({ search: query, limit });
}

export const speciesService = {
  getSpecies,
  getSpeciesById,
  searchSpecies,
};

export default speciesService;
