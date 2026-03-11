import { useState, useEffect } from "react";
import { FilterState } from "@/components/organism/modal/FilterModal";

export function useExploreFilters() {
  const [appliedFilters, setAppliedFilters] = useState<FilterState>({
    quickFilters: [],
    colors: [],
    sizes: [],
    habitats: [],
    distributions: [],
  });

  const [tempFilters, setTempFilters] = useState<FilterState>(appliedFilters);

  useEffect(() => {
    setTempFilters(appliedFilters);
  }, [appliedFilters]);

  const toggleFilter = (category: keyof FilterState, value: string) => {
    setTempFilters((prev) => {
      const current = prev[category];

      return {
        ...prev,
        [category]: current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value],
      };
    });
  };

  return {
    appliedFilters,
    tempFilters,
    setAppliedFilters,
    setTempFilters,
    toggleFilter,
  };
}