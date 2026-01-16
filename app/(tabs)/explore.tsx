import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import ListCard from '@/components/ListCard';
import SearchBar from '@/components/SearchBar';
import SortButton from '@/components/SortButton';
import FilterChip from '@/components/FilterChip';
import { exploreSpeciesData, filterOptions, quickDiscoveryCategories } from '@/constants/AntData';

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

  // Applied filters (shown on main screen)
  const [appliedFilters, setAppliedFilters] = useState<FilterState>({
    quickFilters: ['venomous'],
    colors: ['Red'],
    sizes: ['Medium (5-10mm)', 'Large (10-15mm)'],
    habitats: ['Forest'],
    distributions: ['North', 'South', 'East', 'West', 'Central'],
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
    appliedFilters.habitats.length;

  // Filter species based on search query
  const filteredSpecies = exploreSpeciesData.filter(item => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
    );
  });

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

          {/* Size */}
          <View className="mb-6">
            <Text className="mb-4 text-lg font-semibold text-gray-800">Size</Text>
            <View className="flex-row flex-wrap">
              {filterOptions.sizes.map(size => (
                <FilterChip
                  key={size}
                  label={size}
                  isSelected={tempFilters.sizes.includes(size)}
                  onPress={() => toggleFilter('sizes', size)}
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
            <Text className="mb-4 text-lg font-semibold text-gray-800">Distribution in Thailand</Text>
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
          <SortButton onPress={() => { }} />

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

        {/* Species Count */}
        <View className="px-5 mb-4">
          <Text className="text-base text-gray-500">{filteredSpecies.length} species found</Text>
        </View>

        {/* Species List */}
        <View className="px-5">
          {filteredSpecies.map(item => (
            <ListCard
              key={item.id}
              id={item.id}
              title={item.title}
              description={item.description}
              image={item.image}
              onPress={() => handleItemPress(item.id)}
            />
          ))}
        </View>

        {/* Bottom padding for tab bar */}
        <View className="h-28" />
      </ScrollView>
    </SafeAreaView>
  );
}