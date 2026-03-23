import { apiClient } from "./api";
import { API_ENDPOINTS } from "@/config/api";
import type { Species, SpeciesListResponse, SpeciesFilters } from "@/types/api";

export async function getSpecies(
  filters?: SpeciesFilters,
): Promise<SpeciesListResponse> {
  const params = new URLSearchParams();

  if (filters?.search) params.append("search", filters.search);
  if (filters?.tags) params.append("tags", filters.tags);
  if (filters?.colors) params.append("colors", filters.colors);
  if (filters?.habitat) params.append("habitat", filters.habitat);
  if (filters?.distribution)
    params.append("distribution", filters.distribution);
  if (filters?.province) params.append("province", filters.province);
  if (filters?.page) params.append("page", filters.page.toString());
  if (filters?.limit) params.append("limit", filters.limit.toString());

  const queryString = params.toString();
  const endpoint = queryString
    ? `${API_ENDPOINTS.species}?${queryString}`
    : API_ENDPOINTS.species;

  return apiClient.get<SpeciesListResponse>(endpoint);
}

export async function getSpeciesById(id: string): Promise<Species> {
  return apiClient.get<Species>(API_ENDPOINTS.speciesById(id));
}

export async function updateSpeciesById(
  id: string,
  payload: Partial<Species> & Record<string, unknown>,
  authToken: string,
): Promise<Species> {
  return apiClient.put<Species>(API_ENDPOINTS.speciesById(id), payload, {
    authToken,
  });
}

export async function searchSpecies(
  query: string,
  limit = 20,
): Promise<SpeciesListResponse> {
  return getSpecies({ search: query, limit });
}

export const speciesService = {
  getSpecies,
  getSpeciesById,
  updateSpeciesById,
  searchSpecies,
};

export default speciesService;
