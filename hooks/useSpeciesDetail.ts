/**
 * useSpeciesDetail Hook
 * Fetches a single species by ID with fallback to static data
 */

import { useState, useEffect, useCallback } from 'react';
import { speciesService } from '@/services/species';
import type { Species } from '@/types/api';
interface UseSpeciesDetailOptions {
  useFallback?: boolean;
}

interface UseSpeciesDetailReturn {
  species: Species | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  isUsingFallback: boolean;
}

export function useSpeciesDetail(
  id: string | undefined,
  options: UseSpeciesDetailOptions = {},
): UseSpeciesDetailReturn {
  const { useFallback = true } = options;

  const [species, setSpecies] = useState<Species | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  const fetchSpecies = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await speciesService.getSpeciesById(id);
      setSpecies(response);
      setIsUsingFallback(false);
    } catch (err) {
      console.warn("Failed to fetch species from API, using fallback:", err);
      setError(
        err instanceof Error ? err : new Error("Failed to fetch species"),
      );

      // Use fallback data on error
      if (useFallback) {
        setSpecies(null);
        setIsUsingFallback(true);
      }
    } finally {
      setLoading(false);
    }
  }, [id, useFallback]);

  useEffect(() => {
    fetchSpecies();
  }, [fetchSpecies]);

  return {
    species,
    loading,
    error,
    refetch: fetchSpecies,
    isUsingFallback,
  };
}

export default useSpeciesDetail;
