import { act, renderHook } from "@testing-library/react-native";
import { useExploreFilters } from "@/hooks/useExploreFilters";

describe("useExploreFilters", () => {
  it("toggles filter values in temp filters", () => {
    const { result } = renderHook(() => useExploreFilters());

    act(() => {
      result.current.toggleFilter("colors", "red");
    });
    expect(result.current.tempFilters.colors).toEqual(["red"]);

    act(() => {
      result.current.toggleFilter("colors", "red");
    });
    expect(result.current.tempFilters.colors).toEqual([]);
  });

  it("syncs temp filters when applied filters change", () => {
    const { result } = renderHook(() => useExploreFilters());

    act(() => {
      result.current.setAppliedFilters((prev) => ({
        ...prev,
        quickFilters: ["1"],
      }));
    });

    expect(result.current.tempFilters.quickFilters).toEqual(["1"]);
  });
});
