import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ListCard from '@/components/ListCard';
import SearchBar from '@/components/SearchBar';
import SortButton from '@/components/SortButton';
import FilterChip from '@/components/FilterChip';
import { useSpecies } from '@/hooks/useSpecies';
import { filterOptions, quickDiscoveryCategories } from '@/constants/AntData';

type SortOption = 'name-asc' | 'name-desc' | 'newest' | 'oldest';

type FilterState = {
  quickFilters: string[];
  colors: string[];
  sizes: string[];
  habitats: string[];
  distributions: string[];
};

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>('name-asc');

  // Fetch species from API with fallback to static data
  const { species, loading, error, isUsingFallback, refetch } = useSpecies();

  // Applied filters (shown on main screen)
  const [appliedFilters, setAppliedFilters] = useState<FilterState>({
    quickFilters: [],
    colors: [],
    sizes: [],
    habitats: [],
    distributions: [],
  });

  // Temporary filters (used in modal)
  const [tempFilters, setTempFilters] = useState<FilterState>({
    quickFilters: [],
    colors: [],
    sizes: [],
    habitats: [],
    distributions: [],
  });

  const activeFilterCount =
    appliedFilters.quickFilters.length +
    appliedFilters.colors.length +
    appliedFilters.sizes.length +
    appliedFilters.habitats.length +
    appliedFilters.distributions.length;

  // Filter and sort species
  const filteredAndSortedSpecies = useMemo(() => {
    // First, filter the species
    let result = species.filter(item => {
      // Search filter
      const query = searchQuery.toLowerCase().trim();
      if (query) {
        const matchesSearch =
          item.name.toLowerCase().includes(query) ||
          item.scientific_name.toLowerCase().includes(query) ||
          item.about.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Quick filter - filter by tags (AND logic - must match ALL selected filters)
      if (appliedFilters.quickFilters.length > 0) {
        const quickFilterMap: Record<string, string[]> = {
          '1': ['Stinging', 'Invasive', 'Venomous'], // Venomous
          '2': ['Native', 'Forest-dwelling', 'Tree-dwelling', 'Arboreal'], // Forest
          '3': ['Urban Pest', 'Household Pest', 'Household', 'Urban'], // Household
          '4': ['Giant', 'Polymorphic', 'Queenless'], // Rare
        };
        
        // Must match ALL selected quick filters (AND logic)
        const matchesAllFilters = appliedFilters.quickFilters.every(filterId => {
          const relatedTags = quickFilterMap[filterId] || [];
          return item.tags.some(tag => 
            relatedTags.some(rt => tag.toLowerCase().includes(rt.toLowerCase()))
          );
        });
        if (!matchesAllFilters) return false;
      }

      // Color filter (AND logic - must have ALL selected colors)
      if (appliedFilters.colors.length > 0) {
        const hasAllColors = appliedFilters.colors.every(filterColor =>
          item.colors.some(c => c.toLowerCase().includes(filterColor.toLowerCase()))
        );
        if (!hasAllColors) return false;
      }

      // Habitat filter (AND logic - must have ALL selected habitats)
      if (appliedFilters.habitats.length > 0) {
        const hasAllHabitats = appliedFilters.habitats.every(filterHabitat =>
          item.habitat.some(h => h.toLowerCase().includes(filterHabitat.toLowerCase()))
        );
        if (!hasAllHabitats) return false;
      }

      // Distribution filter (AND logic - must have ALL selected distributions)
      if (appliedFilters.distributions.length > 0) {
        const hasAllDistributions = appliedFilters.distributions.every(filterDist =>
          item.distribution.some(d => d.toLowerCase().includes(filterDist.toLowerCase()))
        );
        if (!hasAllDistributions) return false;
      }

      return true;
    });

    // Then, sort the filtered results
    result = [...result].sort((a, b) => {
      switch (sortOption) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'newest':
          // Sort by ID descending (higher ID = newer)
          return parseInt(b.id) - parseInt(a.id);
        case 'oldest':
          // Sort by ID ascending (lower ID = older)
          return parseInt(a.id) - parseInt(b.id);
        default:
          return 0;
      }
    });

    return result;
  }, [species, searchQuery, appliedFilters, sortOption]);

  const handleItemPress = (id: string) => {
    router.push({
      pathname: '/detail/[id]',
      params: { id }
    });
  };

  // Open filter modal and copy applied filters to temp
  const openFilterModal = () => {
    setTempFilters({ ...appliedFilters });
    setShowFilter(true);
  };

  // Cancel - discard temp changes and close modal
  const handleCancelFilter = () => {
    setShowFilter(false);
  };

  // Apply - save temp filters to applied and close modal
  const handleApplyFilters = () => {
    setAppliedFilters({ ...tempFilters });
    setShowFilter(false);
  };

  const toggleFilter = (category: keyof FilterState, value: string) => {
    setTempFilters(prev => {
      const current = prev[category];
      if (current.includes(value)) {
        return { ...prev, [category]: current.filter(v => v !== value) };
      } else {
        return { ...prev, [category]: [...current, value] };
      }
    });
  };

  const clearAllFilters = () => {
    setTempFilters({
      quickFilters: [],
      colors: [],
      sizes: [],
      habitats: [],
      distributions: [],
    });
  };

  // Handle sort option selection
  const handleSortSelect = (option: SortOption) => {
    setSortOption(option);
    setShowSort(false);
  };

  // Get sort label for display
  const getSortLabel = () => {
    switch (sortOption) {
      case 'name-asc': return 'A-Z';
      case 'name-desc': return 'Z-A';
      case 'newest': return 'Newest';
      case 'oldest': return 'Oldest';
      default: return 'Sort';
    }
  };

  // Sort Modal
  const sortModalContent = (
    <Modal
      visible={showSort}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowSort(false)}
    >
      <Pressable 
        className="flex-1 bg-black/30"
        onPress={() => setShowSort(false)}
      >
        <View className="flex-1 justify-end">
          <View className="bg-white rounded-t-3xl">
            <View className="w-12 h-1 bg-gray-300 rounded-full mx-auto mt-3" />
            <Text className="text-xl font-bold text-center py-4 text-gray-800">Sort By</Text>
            
            <TouchableOpacity
              className={`flex-row items-center justify-between px-6 py-4 border-b border-gray-100 ${sortOption === 'name-asc' ? 'bg-green-50' : ''}`}
              onPress={() => handleSortSelect('name-asc')}
            >
              <Text className={`text-base ${sortOption === 'name-asc' ? 'text-[#22A45D] font-semibold' : 'text-gray-700'}`}>
                Name (A-Z)
              </Text>
              {sortOption === 'name-asc' && (
                <Ionicons name="checkmark" size={24} color="#22A45D" />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              className={`flex-row items-center justify-between px-6 py-4 border-b border-gray-100 ${sortOption === 'name-desc' ? 'bg-green-50' : ''}`}
              onPress={() => handleSortSelect('name-desc')}
            >
              <Text className={`text-base ${sortOption === 'name-desc' ? 'text-[#22A45D] font-semibold' : 'text-gray-700'}`}>
                Name (Z-A)
              </Text>
              {sortOption === 'name-desc' && (
                <Ionicons name="checkmark" size={24} color="#22A45D" />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              className={`flex-row items-center justify-between px-6 py-4 border-b border-gray-100 ${sortOption === 'newest' ? 'bg-green-50' : ''}`}
              onPress={() => handleSortSelect('newest')}
            >
              <Text className={`text-base ${sortOption === 'newest' ? 'text-[#22A45D] font-semibold' : 'text-gray-700'}`}>
                Newest First
              </Text>
              {sortOption === 'newest' && (
                <Ionicons name="checkmark" size={24} color="#22A45D" />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              className={`flex-row items-center justify-between px-6 py-4 ${sortOption === 'oldest' ? 'bg-green-50' : ''}`}
              onPress={() => handleSortSelect('oldest')}
            >
              <Text className={`text-base ${sortOption === 'oldest' ? 'text-[#22A45D] font-semibold' : 'text-gray-700'}`}>
                Oldest First
              </Text>
              {sortOption === 'oldest' && (
                <Ionicons name="checkmark" size={24} color="#22A45D" />
              )}
            </TouchableOpacity>
            
            <View className="h-8" />
          </View>
        </View>
      </Pressable>
    </Modal>
  );

  // Filter Modal
  const filterModalContent = (
    <Modal
      visible={showFilter}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView className="flex-1 bg-white">
        <StatusBar barStyle="dark-content" />

        {/* Header */}
        <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-100">
          <TouchableOpacity onPress={handleCancelFilter}>
            <Text className="text-[#22A45D] text-base font-medium">Cancel</Text>
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-800">Filter</Text>
          <TouchableOpacity onPress={clearAllFilters}>
            <Text className="text-[#22A45D] text-base font-medium">Clear All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
          {/* Quick Filter */}
          <View className="mt-6 mb-6">
            <Text className="mb-4 text-lg font-semibold text-gray-800">Quick Filter</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row">
                {quickDiscoveryCategories.map(filter => (
                  <FilterChip
                    key={filter.id}
                    label={filter.name}
                    icon={filter.icon}
                    iconColor={filter.color}
                    isSelected={tempFilters.quickFilters.includes(filter.id)}
                    onPress={() => toggleFilter('quickFilters', filter.id)}
                    selectedBackgroundColor="#F59E0B"
                  />
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Color */}
          <View className="mb-6">
            <Text className="mb-4 text-lg font-semibold text-gray-800">Color</Text>
            <View className="flex-row flex-wrap">
              {filterOptions.colors.map(color => (
                <FilterChip
                  key={color}
                  label={color}
                  isSelected={tempFilters.colors.includes(color)}
                  onPress={() => toggleFilter('colors', color)}
                />
              ))}
            </View>
          </View>

          {/* Habitat */}
          <View className="mb-6">
            <Text className="mb-4 text-lg font-semibold text-gray-800">Habitat</Text>
            <View className="flex-row flex-wrap">
              {filterOptions.habitats.map(habitat => (
                <FilterChip
                  key={habitat}
                  label={habitat}
                  isSelected={tempFilters.habitats.includes(habitat)}
                  onPress={() => toggleFilter('habitats', habitat)}
                />
              ))}
            </View>
          </View>

          {/* Distribution in Thailand */}
          <View className="mb-6">
            <Text className="mb-4 text-lg font-semibold text-gray-800">Distribution</Text>
            <View className="flex-row flex-wrap">
              {filterOptions.distributions.map(dist => (
                <FilterChip
                  key={dist}
                  label={dist}
                  isSelected={tempFilters.distributions.includes(dist)}
                  onPress={() => toggleFilter('distributions', dist)}
                />
              ))}
            </View>
          </View>

          <View className="h-24" />
        </ScrollView>

        {/* Apply Button */}
        <View className="px-5 pt-4 pb-8 bg-white border-t border-gray-100">
          <TouchableOpacity
            className="bg-[#22A45D] py-4 rounded-full"
            onPress={handleApplyFilters}
          >
            <Text className="text-lg font-semibold text-center text-white">Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      {/* Sort Modal */}
      {sortModalContent}

      {/* Filter Modal */}
      {filterModalContent}

      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-4">
        <View className="w-10" />
        <Text className="text-xl font-semibold text-gray-800">Explore</Text>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search ant species..."
        />

        {/* Sort and Filter */}
        <View className="flex-row items-center justify-between px-5 mb-4">
          <SortButton 
            onPress={() => setShowSort(true)} 
            label={getSortLabel()}
            isOpen={showSort}
          />

          {/* Filter Button with Badge */}
          <TouchableOpacity
            className="flex-row items-center px-4 py-2.5 border border-gray-200 rounded-lg"
            onPress={openFilterModal}
          >
            <Ionicons name="options-outline" size={18} color="#333" />
            <Text className="ml-2 font-medium text-gray-700">Filter</Text>
            {activeFilterCount > 0 && (
              <View className="ml-2 bg-[#22A45D] rounded-full w-6 h-6 items-center justify-center">
                <Text className="text-xs font-bold text-white">{activeFilterCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Active Filters Display */}
        {activeFilterCount > 0 && (
          <View className="px-5 mb-3">
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row items-center">
                {appliedFilters.quickFilters.map(id => {
                  const filter = quickDiscoveryCategories.find(f => f.id === id);
                  return filter ? (
                    <FilterChip
                      key={`quick-${id}`}
                      label={filter.name}
                      isSelected={true}
                      onPress={() => {
                        setAppliedFilters(prev => ({
                          ...prev,
                          quickFilters: prev.quickFilters.filter(f => f !== id)
                        }));
                      }}
                      size="small"
                    />
                  ) : null;
                })}
                {appliedFilters.colors.map(color => (
                  <FilterChip
                    key={`color-${color}`}
                    label={color}
                    isSelected={true}
                    onPress={() => {
                      setAppliedFilters(prev => ({
                        ...prev,
                        colors: prev.colors.filter(c => c !== color)
                      }));
                    }}
                    size="small"
                  />
                ))}
                {appliedFilters.habitats.map(habitat => (
                  <FilterChip
                    key={`habitat-${habitat}`}
                    label={habitat}
                    isSelected={true}
                    onPress={() => {
                      setAppliedFilters(prev => ({
                        ...prev,
                        habitats: prev.habitats.filter(h => h !== habitat)
                      }));
                    }}
                    size="small"
                  />
                ))}
                {appliedFilters.distributions.map(dist => (
                  <FilterChip
                    key={`dist-${dist}`}
                    label={dist}
                    isSelected={true}
                    onPress={() => {
                      setAppliedFilters(prev => ({
                        ...prev,
                        distributions: prev.distributions.filter(d => d !== dist)
                      }));
                    }}
                    size="small"
                  />
                ))}
                <TouchableOpacity
                  className="ml-2 px-3 py-1"
                  onPress={() => setAppliedFilters({
                    quickFilters: [],
                    colors: [],
                    sizes: [],
                    habitats: [],
                    distributions: [],
                  })}
                >
                  <Text className="text-[#22A45D] font-medium text-sm">Clear All</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        )}

        {/* Status Banner */}
        {isUsingFallback && (
          <View className="mx-5 mb-3 px-4 py-2 bg-yellow-50 rounded-lg">
            <Text className="text-yellow-700 text-sm">Using offline data. Pull to refresh.</Text>
          </View>
        )}

        {/* Species Count */}
        <View className="px-5 mb-4">
          <Text className="text-base text-gray-500">{filteredAndSortedSpecies.length} species found</Text>
        </View>

        {/* Loading State */}
        {loading && (
          <View className="py-8 items-center">
            <ActivityIndicator size="large" color="#22A45D" />
            <Text className="mt-2 text-gray-500">Loading species...</Text>
          </View>
        )}

        {/* Species List */}
        {!loading && (
          <View className="px-5">
            {filteredAndSortedSpecies.map(item => (
              <ListCard
                key={item.id}
                id={item.id}
                title={item.name}
                description={item.about.substring(0, 80) + '...'}
                image={item.image || (item as any).images?.[0] || ''}
                onPress={() => handleItemPress(item.id)}
              />
            ))}
          </View>
        )}

        {/* Empty State */}
        {!loading && filteredAndSortedSpecies.length === 0 && (
          <View className="py-8 items-center">
            <Ionicons name="search-outline" size={48} color="#9CA3AF" />
            <Text className="mt-2 text-gray-500">No species found</Text>
            <Text className="text-gray-400 text-sm">Try adjusting your search or filters</Text>
          </View>
        )}

        {/* Bottom padding for tab bar */}
        <View className="h-28" />
      </ScrollView>
    </SafeAreaView>
  );
}
