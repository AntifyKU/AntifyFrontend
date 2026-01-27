import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import ListCard from "@/components/ListCard";
import SearchBar from "@/components/SearchBar";
import ActionButton from "@/components/atom/ActionButton";
import { ScreenHeader } from "@/components/molecule/ScreenHeader";

import SortModal, { SortOption } from "@/components/molecule/SortModal";
import FilterModal from "@/components/molecule/FilterModal";
import { useExploreFilters } from "@/hooks/useExploreFilters";
import { useSpecies } from "@/hooks/useSpecies";

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSort, setShowSort] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>("name-asc");

  const { species, loading, isUsingFallback } = useSpecies();
  const { appliedFilters, tempFilters, setApplied, setTemp, toggleFilter } =
    useExploreFilters();

  const activeFilterCount =
    appliedFilters.quickFilters.length +
    appliedFilters.colors.length +
    appliedFilters.habitats.length +
    appliedFilters.distributions.length;

  const filteredAndSortedSpecies = useMemo(() => {
    let result = species.filter((item) => {
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
        const quickFilterMap: Record<string, string[]> = {
          "1": ["Stinging", "Invasive", "Venomous"],
          "2": ["Forest", "Tree", "Arboreal"],
          "3": ["Urban", "Household"],
          "4": ["Giant", "Rare"],
        };

        const ok = appliedFilters.quickFilters.every((id) => {
          const tags = quickFilterMap[id] || [];
          return item.tags?.some((tag) =>
            tags.some((t) => tag.toLowerCase().includes(t.toLowerCase())),
          );
        });

        if (!ok) return false;
      }

      // Color
      if (appliedFilters.colors.length > 0) {
        const ok = appliedFilters.colors.every((c) =>
          item.colors.some((ic) => ic.toLowerCase().includes(c.toLowerCase())),
        );
        if (!ok) return false;
      }

      // Habitat
      if (appliedFilters.habitats.length > 0) {
        const ok = appliedFilters.habitats.every((h) =>
          item.habitat.some((ih) => ih.toLowerCase().includes(h.toLowerCase())),
        );
        if (!ok) return false;
      }

      // Distribution
      if (appliedFilters.distributions.length > 0) {
        const ok = appliedFilters.distributions.every((d) =>
          item.distribution.some((id) =>
            id.toLowerCase().includes(d.toLowerCase()),
          ),
        );
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
          return parseInt(b.id) - parseInt(a.id);
        case "oldest":
          return parseInt(a.id) - parseInt(b.id);
        default:
          return 0;
      }
    });

    return result;
  }, [species, searchQuery, appliedFilters, sortOption]);

  const getSortLabel = () => {
    switch (sortOption) {
      case "name-asc":
        return "A-Z";
      case "name-desc":
        return "Z-A";
      case "newest":
        return "Newest";
      case "oldest":
        return "Oldest";
      default:
        return "Sort";
    }
  };

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
          setApplied(tempFilters);
          setShowFilter(false);
        }}
        onClear={() =>
          setTemp({
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
        <ScreenHeader
          title="Explore"
          rightIcon="notifications-outline"
          onRightPress={() => {}}
        />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Search */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search ant species..."
        />

        {/* Actions */}
        <View className="flex-row justify-between px-5 mb-4">
          <ActionButton
            type="sort"
            label={getSortLabel()}
            onPress={() => setShowSort(true)}
          />
          <ActionButton
            type="filter"
            label="Filter"
            badgeCount={activeFilterCount}
            onPress={() => {
              setTemp(appliedFilters);
              setShowFilter(true);
            }}
          />
        </View>

        {/* Offline Banner */}
        {isUsingFallback && (
          <View className="mx-5 mb-3 px-4 py-2 bg-yellow-50 rounded-lg">
            <Text className="text-yellow-700 text-sm">Using offline data</Text>
          </View>
        )}

        {/* Count */}
        <View className="px-5 mb-4">
          <Text className="text-base text-gray-500">
            {filteredAndSortedSpecies.length} species found
          </Text>
        </View>

        {/* Loading */}
        {loading && (
          <View className="py-10 items-center">
            <ActivityIndicator size="large" color="#22A45D" />
            <Text className="mt-2 text-gray-500">Loading species...</Text>
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

        {/* Empty */}
        {!loading && filteredAndSortedSpecies.length === 0 && (
          <View className="flex-1 items-center justify-center py-20">
            <Ionicons name="search-outline" size={48} color="#9CA3AF" />
            <Text className="mt-2 text-gray-600 text-lg">No species found</Text>
            <Text className="text-gray-500">Try adjusting your search</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
