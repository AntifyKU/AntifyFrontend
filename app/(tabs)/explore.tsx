import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
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
  const { tag, ts } = useLocalSearchParams<{ tag?: string; ts?: string }>();

  const lastProcessedTs = useRef<string | undefined>(undefined);

  // Handle incoming tag/category from home page
  useEffect(() => {
    if (tag && ts !== lastProcessedTs.current) {
      // Map tag to quick filter ID
      const tagToId: Record<string, string> = {
        "venomous": "1",
        "predator": "2",
        "invasive": "3",
        "scavenger": "4"
      };
      
      const filterId = tagToId[tag.toLowerCase()];
      if (filterId) {
        setAppliedFilters(prev => ({
          ...prev,
          quickFilters: [filterId]
        }));
        lastProcessedTs.current = ts;
      }
    }
  }, [tag, ts, setAppliedFilters]);

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


  const filteredAndSortedSpecies = useMemo(() => {

    let result = species.filter((item) => {
      // Hide junk taxonomy labels
      if (JUNK_LABELS.has(item.name.toLowerCase().trim())) return false;
      // Search
      const query = searchQuery.toLowerCase().trim();
      if (query) {
        const match =
          item.name.toLowerCase().includes(query) ||
          item.scientific_name.toLowerCase().includes(query);
        if (!match) return false;
      }

      // Quick Filter
      if (appliedFilters.quickFilters.length > 0) {
        const ok = appliedFilters.quickFilters.every((id) => {
          if (id === "1") { // Venomous
            return item.risk?.venom?.has_venom === true || 
                   item.risk?.sting_or_bite?.toLowerCase().includes("sting") ||
                   item.tags?.some(t => t.toLowerCase().includes("venom"));
          }
          if (id === "2") { // Predator
            return item.ecological_role?.toLowerCase().includes("predator") || 
                   item.behavior?.toLowerCase().includes("hunt") ||
                   item.tags?.some(t => t.toLowerCase().includes("predator"));
          }
          if (id === "3") { // Invasive
            return item.tags?.some(t => t.toLowerCase().includes("invasive")) ||
                   item.about?.toLowerCase().includes("invasive") ||
                   item.name.toLowerCase().includes("fire ant"); // Common invasive
          }
          if (id === "4") { // Scavenger
            return item.ecological_role?.toLowerCase().includes("scavenger") || 
                   item.behavior?.toLowerCase().includes("scaveng") ||
                   item.tags?.some(t => t.toLowerCase().includes("scavenger"));
          }
          return false;
        });

        if (!ok) return false;
      }

      // Color
      if (appliedFilters.colors.length > 0) {
        const ok = appliedFilters.colors.every((c: string) =>
          item.colors.some((ic: string) => ic.toLowerCase().includes(c.toLowerCase())),
        );
        if (!ok) return false;
      }

      // Habitat
      if (appliedFilters.habitats.length > 0) {
        const ok = appliedFilters.habitats.every((h: string) =>
          item.habitat.some((ih: string) => ih.toLowerCase().includes(h.toLowerCase())),
        );
        if (!ok) return false;
      }

      // Risk
      if (appliedFilters.risks && appliedFilters.risks.length > 0) {
        const ok = appliedFilters.risks.every((r: string) => {
          const lowerR = r.toLowerCase();
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
        });
        if (!ok) return false;
      }

      // Distribution
      if (appliedFilters.distributions.length > 0) {
        const ok = appliedFilters.distributions.every((d: string) => {
          const inDistribution = item.distribution?.some((id: string) =>
            id.toLowerCase().includes(d.toLowerCase())
          );
          const inProvinces = item.distribution_v2?.provinces?.some((p: string) =>
            p.toLowerCase().includes(d.toLowerCase())
          );
          return inDistribution || inProvinces;
        });
        if (!ok) return false;
      }

      return true;
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
  }, [species, JUNK_LABELS, searchQuery, appliedFilters, sortOption]);

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
