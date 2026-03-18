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
import SearchBar from "@/components/atom/SearchBar";
import ActionButton from "@/components/atom/button/ActionButton";
import { ScreenHeader } from "@/components/molecule/ScreenHeader";
import SortModal from "@/components/molecule/SortModal";
import { SortOption, getSortLabel } from "@/utils/sort";
import FilterModal from "@/components/organism/modal/FilterModal";
import { useExploreFilters } from "@/hooks/useExploreFilters";
import { useSpecies } from "@/hooks/useSpecies";
import EmptyState from "@/components/molecule/EmptyState";

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
    appliedFilters.distributions.length +
    appliedFilters.risks.length;

  // Helper functions for filtering
  const JUNK_LABELS = useMemo(
    () => new Set(["life", "unknown", "animalia", "insecta"]),
    [],
  );

  const isForestHabitat = React.useCallback(
    (habitat: string[]) =>
      habitat?.some(
        (h: string) =>
          h.toLowerCase().includes("forest") ||
          h.toLowerCase().includes("tree") ||
          h.toLowerCase().includes("wood"),
      ),
    [],
  );

  const isUrbanHabitat = React.useCallback(
    (habitat: string[]) =>
      habitat?.some(
        (h: string) =>
          h.toLowerCase().includes("urban") ||
          h.toLowerCase().includes("building"),
      ),
    [],
  );

  const matchesSearch = (item: any, query: string) => {
    if (!query) return true;
    return (
      item.name.toLowerCase().includes(query) ||
      item.scientific_name.toLowerCase().includes(query)
    );
  };

  const matchesQuickFilter = React.useCallback(
    (item: any, id: string) => {
      if (id === "1") {
        return (
          item.risk?.venom?.has_venom === true ||
          item.risk?.sting_or_bite === "sting"
        );
      }
      if (id === "2") {
        return isForestHabitat(item.habitat);
      }
      if (id === "3") {
        return isUrbanHabitat(item.habitat);
      }
      return false;
    },
    [isForestHabitat, isUrbanHabitat],
  );

  const matchesColorItem = (item: any, color: string) => {
    return item.colors.some((ic: string) =>
      ic.toLowerCase().includes(color.toLowerCase()),
    );
  };

  const matchesHabitatItem = (item: any, habitat: string) => {
    return item.habitat.some((ih: string) =>
      ih.toLowerCase().includes(habitat.toLowerCase()),
    );
  };

  const matchesRiskItem = (item: any, risk: string) => {
    const lowerR = risk.toLowerCase();
    if (lowerR === "venomous") {
      return item.risk?.venom?.has_venom === true;
    }
    if (lowerR === "bites" || lowerR === "bite") {
      return item.risk?.sting_or_bite?.toLowerCase().includes("bite");
    }
    if (lowerR === "sting") {
      return item.risk?.sting_or_bite?.toLowerCase().includes("sting");
    }
    return false;
  };

  const matchesDistributionItem = (item: any, distribution: string) => {
    const inDistribution = item.distribution?.some((id: string) =>
      id.toLowerCase().includes(distribution.toLowerCase()),
    );
    const inProvinces = item.distribution_v2?.provinces?.some((p: string) =>
      p.toLowerCase().includes(distribution.toLowerCase()),
    );
    return inDistribution || inProvinces;
  };

  const filteredAndSortedSpecies = useMemo(() => {
    const matchesQuickFilters = (item: any) => {
      if (appliedFilters.quickFilters.length === 0) return true;
      return appliedFilters.quickFilters.every((id) =>
        matchesQuickFilter(item, id),
      );
    };

    const matchesColors = (item: any) => {
      if (appliedFilters.colors.length === 0) return true;
      return appliedFilters.colors.every((c) => matchesColorItem(item, c));
    };

    const matchesHabitats = (item: any) => {
      if (appliedFilters.habitats.length === 0) return true;
      return appliedFilters.habitats.every((h) => matchesHabitatItem(item, h));
    };

    const matchesRisks = (item: any) => {
      if (!appliedFilters.risks || appliedFilters.risks.length === 0)
        return true;
      return appliedFilters.risks.every((r) => matchesRiskItem(item, r));
    };

    const matchesDistributions = (item: any) => {
      if (appliedFilters.distributions.length === 0) return true;
      return appliedFilters.distributions.every((d) =>
        matchesDistributionItem(item, d),
      );
    };

    let result = species.filter((item) => {
      // Hide junk taxonomy labels
      if (JUNK_LABELS.has(item.name.toLowerCase().trim())) return false;

      // Search
      const query = searchQuery.toLowerCase().trim();
      if (!matchesSearch(item, query)) return false;

      // Apply all filters
      return (
        matchesQuickFilters(item) &&
        matchesColors(item) &&
        matchesHabitats(item) &&
        matchesRisks(item) &&
        matchesDistributions(item)
      );
    });

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
  }, [
    species,
    JUNK_LABELS,
    searchQuery,
    appliedFilters,
    sortOption,
    matchesQuickFilter,
  ]);

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
            risks: [],
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
