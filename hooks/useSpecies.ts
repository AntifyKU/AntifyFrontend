/**
 * useSpecies Hook
 * Fetches species list with optional filters and fallback to static data
 */

import { useState, useEffect, useRef } from 'react';
import { speciesService } from '@/services/species';
import { antSpeciesData } from '@/constants/AntData';
import type { Species, SpeciesFilters } from '@/types/api';

// Transform static data to API format
function transformStaticSpecies(staticData: typeof antSpeciesData): Species[] {
  return staticData.map(ant => ({
    id: ant.id,
    name: ant.name,
    scientific_name: ant.scientificName,
    classification: ant.classification,
    tags: ant.tags,
    about: ant.about,
    characteristics: ant.characteristics,
    colors: ant.colors,
    habitat: ant.habitat,
    distribution: ant.distribution,
    behavior: ant.behavior,
    ecological_role: ant.ecologicalRole,
    image: ant.image, // Use image directly, not images array
  }));
}

interface UseSpeciesOptions {
  filters?: SpeciesFilters;
  useFallback?: boolean;
}

interface UseSpeciesReturn {
  species: Species[];
  loading: boolean;
  error: Error | null;
  total: number;
  refetch: () => void;
  isUsingFallback: boolean;
}

export function useSpecies(options: UseSpeciesOptions = {}): UseSpeciesReturn {
  const { filters, useFallback = true } = options;
  
  const [species, setSpecies] = useState<Species[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [total, setTotal] = useState(0);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  
  // Use refs to track fetch state and prevent duplicate calls
  const isFetchingRef = useRef(false);
  const hasFetchedRef = useRef(false);
  const filtersKeyRef = useRef<string>('');
  
  // Serialize filters for comparison
  const filtersKey = JSON.stringify(filters ?? {});
  
  // Manual refetch function
  const refetch = () => {
    hasFetchedRef.current = false;
    fetchData();
  };
  
  const fetchData = async () => {
    // Prevent concurrent fetches
    if (isFetchingRef.current) return;
    
    isFetchingRef.current = true;
    setLoading(true);
    setError(null);
    
    try {
      const response = await speciesService.getSpecies(filters);
      
      // If API returns empty but we have fallback, use fallback
      if (response.species.length === 0 && useFallback) {
        const fallbackData = transformStaticSpecies(antSpeciesData);
        setSpecies(fallbackData);
        setTotal(fallbackData.length);
        setIsUsingFallback(true);
      } else {
        setSpecies(response.species);
        setTotal(response.total);
        setIsUsingFallback(false);
      }
    } catch (err) {
      console.warn('Failed to fetch species from API, using fallback:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch species'));
      
      // Use fallback data on error
      if (useFallback) {
        const fallbackData = transformStaticSpecies(antSpeciesData);
        setSpecies(fallbackData);
        setTotal(fallbackData.length);
        setIsUsingFallback(true);
      }
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
      hasFetchedRef.current = true;
    }
  };

  useEffect(() => {
    // Only fetch if:
    // 1. We haven't fetched yet, OR
    // 2. The filters have changed
    const filtersChanged = filtersKeyRef.current !== filtersKey;
    
    if (!hasFetchedRef.current || filtersChanged) {
      filtersKeyRef.current = filtersKey;
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey]);

  return {
    species,
    loading,
    error,
    total,
    refetch,
    isUsingFallback,
  };
}

export default useSpecies;
