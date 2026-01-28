import { useState, useEffect } from "react";
import { FilterState } from "@/components/organism/FilterModal";

export function useExploreFilters() {
  const [appliedFilters, setApplied] = useState<FilterState>({
    quickFilters: [],
    colors: [],
    sizes: [],
    habitats: [],
    distributions: [],
  });

  const [tempFilters, setTemp] = useState(appliedFilters);

  useEffect(() => {
    setTemp(appliedFilters);
  }, [appliedFilters]);

  const toggleFilter = (category: keyof FilterState, value: string) => {
    setTemp((prev) => {
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
    setApplied,
    setTemp,
    toggleFilter,
  };
}
