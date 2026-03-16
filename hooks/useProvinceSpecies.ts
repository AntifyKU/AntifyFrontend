/**
 * useProvinceSpecies Hook
 * Fetches species from Firestore (via backend API) that are confirmed
 * to exist in the given province/region.
 */

import { useState, useEffect } from "react";
import { speciesService } from "@/services/species";
import type { Species } from "@/types/api";

interface UseProvinceSpeciesReturn {
  provinceSpecies: Species[];
  loading: boolean;
  error: Error | null;
}

export function useProvinceSpecies(
  province: string | null,
): UseProvinceSpeciesReturn {
  const [provinceSpecies, setProvinceSpecies] = useState<Species[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Only fetch when we have a province name
    if (!province) return;

    let cancelled = false;

    const fetchProvinceSpecies = async () => {
      setLoading(true);
      setError(null);

      try {
        // Use the province filter which checks distribution_v2.provinces —
        // the correct field for province-level presence data
        const response = await speciesService.getSpecies({
          province: province,
          limit: 500,
        });

        if (!cancelled) {
          setProvinceSpecies(response.species);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err
              : new Error("Failed to fetch province species"),
          );
          // On error, leave list empty — card will gracefully fall back
          setProvinceSpecies([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProvinceSpecies();

    return () => {
      cancelled = true;
    };
  }, [province]);

  return { provinceSpecies, loading, error };
}

export default useProvinceSpecies;
