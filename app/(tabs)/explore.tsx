import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import ListCard from "@/components/ListCard";
import SearchBar from "@/components/SearchBar";
import ActionButton from "@/components/atom/button/ActionButton";
import { ScreenHeader } from "@/components/molecule/ScreenHeader";
import SortModal from "@/components/molecule/SortModal";
import { SortOption, getSortLabel } from "@/utils/sort";
import FilterModal from "@/components/organism/modal/FilterModal";
import { useExploreFilters } from "@/hooks/useExploreFilters";
import { useSpecies } from "@/hooks/useSpecies";
import EmptyState from "@/components/molecule/EmptyState";

// Helper filter functions to reduce nesting
function matchesSearchQuery(item: any, query: string) {
  if (!query) return true;
  return (
    item.name.toLowerCase().includes(query) ||
    item.scientific_name.toLowerCase().includes(query)
  );
}

function matchesQuickFiltersApplied(item: any, quickFilters: string[]) {
  if (quickFilters.length === 0) return true;
  const quickFilterMap: Record<string, string[]> = {
    "1": ["Stinging", "Invasive", "Venomous"],
    "2": ["Forest", "Tree", "Arboreal"],
    "3": ["Urban", "Household"],
    "4": ["Giant", "Rare"],
  };
  return quickFilters.every((id) => {
    const tags = quickFilterMap[id] || [];
    return item.tags?.some((tag: string) =>
      tags.some((t) => tag.toLowerCase().includes(t.toLowerCase())),
    );
  });
}

function matchesColorsApplied(item: any, colors: string[]) {
  if (colors.length === 0) return true;
  return colors.every((c) =>
    item.colors.some((ic: string) =>
      ic.toLowerCase().includes(c.toLowerCase()),
    ),
  );
}

function matchesHabitatsApplied(item: any, habitats: string[]) {
  if (habitats.length === 0) return true;
  return habitats.every((h) =>
    item.habitat.some((ih: string) =>
      ih.toLowerCase().includes(h.toLowerCase()),
    ),
  );
}

function matchesDistributionsApplied(item: any, distributions: string[]) {
  if (distributions.length === 0) return true;
  return distributions.every((d) =>
    item.distribution.some((id: string) =>
      id.toLowerCase().includes(d.toLowerCase()),
    ),
  );
}

export default function ExploreScreen() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSort, setShowSort] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>("name-asc");
  const { species, loading, isUsingFallback } = useSpecies();
  const {
    appliedFilters,
    tempFilters,
    setAppliedFilters,
    setTempFilters,
    toggleFilter,
  } = useExploreFilters();

  const activeFilterCount =
    appliedFilters.quickFilters.length +
    appliedFilters.colors.length +
    appliedFilters.habitats.length +
    appliedFilters.distributions.length;

  // Helper functions for filtering
  const JUNK_LABELS = useMemo(
    () => new Set(["life", "unknown", "animalia", "insecta"]),
    [],
  );

  const isNotJunkLabel = React.useCallback(
    (item: any) => {
      return !JUNK_LABELS.has(item.name.toLowerCase().trim());
    },
    [JUNK_LABELS],
  );

  const filteredAndSortedSpecies = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    let result = species.filter(
      (item) =>
        isNotJunkLabel(item) &&
        matchesSearchQuery(item, query) &&
        matchesQuickFiltersApplied(item, appliedFilters.quickFilters) &&
        matchesColorsApplied(item, appliedFilters.colors) &&
        matchesHabitatsApplied(item, appliedFilters.habitats) &&
        matchesDistributionsApplied(item, appliedFilters.distributions),
    );

    // Sort
    result = [...result].sort((a, b) => {
      switch (sortOption) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "newest":
          return Number.parseInt(b.id) - Number.parseInt(a.id);
        case "oldest":
          return Number.parseInt(a.id) - Number.parseInt(b.id);
        default:
          return 0;
      }
    });

    return result;
  }, [species, searchQuery, appliedFilters, sortOption, isNotJunkLabel]);

  const handleItemPress = (id: string) => {
    router.push({ pathname: "/detail/[id]", params: { id } });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      {/* Modals */}
      <SortModal
        visible={showSort}
        selected={sortOption}
        onClose={() => setShowSort(false)}
        onSelect={(opt) => {
          setSortOption(opt);
          setShowSort(false);
        }}
      />

      <FilterModal
        visible={showFilter}
        tempFilters={tempFilters}
        onClose={() => setShowFilter(false)}
        onApply={() => {
          setAppliedFilters(tempFilters);
          setShowFilter(false);
        }}
        onClear={() =>
          setTempFilters({
            quickFilters: [],
            colors: [],
            sizes: [],
            habitats: [],
            distributions: [],
          })
        }
        onToggle={toggleFilter}
      />

      {/* Header */}
      <View className="pt-4 pb-5">
        <ScreenHeader title={t("explore.title")} />
      </View>

      {/* Search */}
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder={t("explore.searchPlaceholder")}
      />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator
        contentContainerStyle={{
          flexGrow: filteredAndSortedSpecies.length === 0 ? 1 : 0,
        }}
      >
        {/* Actions */}
        <View className="flex-row justify-between px-5 mb-4">
          <ActionButton
            type="sort"
            label={getSortLabel(sortOption, t)}
            onPress={() => setShowSort(true)}
          />
          <ActionButton
            type="filter"
            label={t("explore.filterLabel")}
            badgeCount={activeFilterCount}
            onPress={() => {
              setTempFilters(appliedFilters);
              setShowFilter(true);
            }}
          />
        </View>

        {/* Offline Banner */}
        {isUsingFallback && (
          <View className="mx-5 mb-3 px-4 py-2 bg-yellow-50 rounded-lg">
            <Text className="text-yellow-700 text-sm">
              {t("explore.offlineBanner")}
            </Text>
          </View>
        )}

        {/* Count */}
        <View className="px-5 mb-4">
          <Text className="text-base text-gray-500">
            {t("explore.speciesFound", {
              count: filteredAndSortedSpecies.length,
            })}
          </Text>
        </View>

        {/* Loading */}
        {loading && (
          <View className="py-10 items-center">
            <ActivityIndicator size="large" color="#22A45D" />
            <Text className="mt-4 text-gray-500">
              {t("explore.loadingSpecies")}
            </Text>
          </View>
        )}

        {/* List */}
        {!loading && (
          <View className="px-5">
            {filteredAndSortedSpecies.map((item) => (
              <ListCard
                key={item.id}
                id={item.id}
                title={item.name}
                description={item.about.substring(0, 80) + "..."}
                image={item.image || ""}
                onPress={() => handleItemPress(item.id)}
              />
            ))}
          </View>
        )}

        {/* Empty state */}
        {!loading && filteredAndSortedSpecies.length === 0 && (
          <View className="flex-1 items-center justify-center">
            <EmptyState
              icon="search-outline"
              iconSize={48}
              title={t("explore.emptyTitle")}
              description={t("explore.emptyDescription")}
            />
          </View>
        )}
        <View className="h-24" />
      </ScrollView>
    </SafeAreaView>
  );
}
