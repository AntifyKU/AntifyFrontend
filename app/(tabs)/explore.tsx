import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Modal,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import ListCard from '@/components/ListCard';

// Sample species data
const speciesData = [
  { id: '1', title: 'Worem ipsum', description: 'Morem ipsum dolor sit amet, consectetur adipiscing elit.' },
  { id: '2', title: 'Worem ipsum', description: 'Morem ipsum dolor sit amet, consectetur adipiscing elit.' },
  { id: '3', title: 'Worem ipsum', description: 'Morem ipsum dolor sit amet, consectetur adipiscing elit.' },
  { id: '4', title: 'Worem ipsum', description: 'Morem ipsum dolor sit amet, consectetur adipiscing elit.' },
  { id: '5', title: 'Worem ipsum', description: 'Morem ipsum dolor sit amet, consectetur adipiscing elit.' },
  { id: '6', title: 'Worem ipsum', description: 'Morem ipsum dolor sit amet, consectetur adipiscing elit.' },
  { id: '7', title: 'Worem ipsum', description: 'Morem ipsum dolor sit amet, consectetur adipiscing elit.' },
  { id: '8', title: 'Worem ipsum', description: 'Morem ipsum dolor sit amet, consectetur adipiscing elit.' },
];

// Filter options
const quickFilters = [
  { id: 'venomous', label: 'Venomous', icon: 'alert', color: '#F59E0B' },
  { id: 'forest', label: 'Forest', icon: 'tree', color: '#22A45D' },
  { id: 'household', label: 'Household', icon: 'home', color: '#3B82F6' },
  { id: 'rare', label: 'Rare', icon: 'sparkles', color: '#8B5CF6' },
];

const colorOptions = ['Black', 'Orange', 'Red', 'Yellow'];
const sizeOptions = ['Tiny', 'Small', 'Medium', 'Large', 'Giant'];
const habitatOptions = ['Urban', 'Forest', 'Desert'];
const distributionOptions = ['North', 'South', 'East', 'West', 'Central'];

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
    sizes: ['Medium', 'Large'],
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
  const filteredSpecies = speciesData.filter(item => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
    );
  });

  const handleItemPress = (id: string) => {
    router.push({
      pathname: '/detail',
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

  const renderChip = (
    label: string,
    isSelected: boolean,
    onPress: () => void,
    icon?: string,
    iconColor?: string
  ) => (
    <TouchableOpacity
      key={label}
      onPress={onPress}
      className={`flex-row items-center px-4 py-2.5 rounded-full mr-2 mb-2 ${isSelected ? 'bg-[#22A45D]' : 'bg-[#e8f5e0]'
        }`}
    >
      {icon && (
        <MaterialCommunityIcons
          name={icon as any}
          size={16}
          color={isSelected ? '#FFFFFF' : iconColor || '#22A45D'}
          style={{ marginRight: 6 }}
        />
      )}
      <Text className={`font-medium ${isSelected ? 'text-white' : 'text-[#22A45D]'}`}>
        {label}
      </Text>
      {isSelected && (
        <Ionicons name="close" size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
      )}
    </TouchableOpacity>
  );

  // Filter Modal - inlined to prevent re-mounting on state change
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
                {quickFilters.map(filter => (
                  <TouchableOpacity
                    key={filter.id}
                    onPress={() => toggleFilter('quickFilters', filter.id)}
                    className={`flex-row items-center px-4 py-2.5 rounded-full mr-2 border ${tempFilters.quickFilters.includes(filter.id)
                      ? 'bg-[#F59E0B] border-[#F59E0B]'
                      : 'bg-white border-[#22A45D]'
                      }`}
                  >
                    <MaterialCommunityIcons
                      name={filter.icon as any}
                      size={16}
                      color={tempFilters.quickFilters.includes(filter.id) ? '#FFFFFF' : filter.color}
                      style={{ marginRight: 6 }}
                    />
                    <Text className={`font-medium ${tempFilters.quickFilters.includes(filter.id) ? 'text-white' : 'text-[#22A45D]'
                      }`}>
                      {filter.label}
                    </Text>
                    {tempFilters.quickFilters.includes(filter.id) && (
                      <Ionicons name="close" size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Color */}
          <View className="mb-6">
            <Text className="mb-4 text-lg font-semibold text-gray-800">Color</Text>
            <View className="flex-row flex-wrap">
              {colorOptions.map(color =>
                renderChip(
                  color,
                  tempFilters.colors.includes(color),
                  () => toggleFilter('colors', color)
                )
              )}
            </View>
          </View>

          {/* Size */}
          <View className="mb-6">
            <Text className="mb-4 text-lg font-semibold text-gray-800">Size</Text>
            <View className="flex-row flex-wrap">
              {sizeOptions.map(size =>
                renderChip(
                  size,
                  tempFilters.sizes.includes(size),
                  () => toggleFilter('sizes', size)
                )
              )}
            </View>
          </View>

          {/* Habitat */}
          <View className="mb-6">
            <Text className="mb-4 text-lg font-semibold text-gray-800">Habitat</Text>
            <View className="flex-row flex-wrap">
              {habitatOptions.map(habitat =>
                renderChip(
                  habitat,
                  tempFilters.habitats.includes(habitat),
                  () => toggleFilter('habitats', habitat)
                )
              )}
            </View>
          </View>

          {/* Distribution in Thailand */}
          <View className="mb-6">
            <Text className="mb-4 text-lg font-semibold text-gray-800">Distribution in Thailand</Text>
            <View className="flex-row flex-wrap">
              {distributionOptions.map(dist =>
                renderChip(
                  dist,
                  tempFilters.distributions.includes(dist),
                  () => toggleFilter('distributions', dist)
                )
              )}
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
        <View className="px-5 mb-4">
          <View className="flex-row items-center px-4 py-3 bg-gray-100 border border-gray-200 rounded-full">
            <Ionicons name="search" size={20} color="#9CA3AF" />
            <TextInput
              className="flex-1 ml-3 text-base text-gray-700"
              placeholder=""
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Sort and Filter */}
        <View className="flex-row items-center justify-between px-5 mb-4">
          {/* Sort Button */}
          <TouchableOpacity className="flex-row items-center px-4 py-2.5 border border-gray-200 rounded-lg">
            <Ionicons name="swap-vertical" size={18} color="#333" />
            <Text className="ml-2 font-medium text-gray-700">Sort</Text>
            <Ionicons name="chevron-down" size={16} color="#333" style={{ marginLeft: 6 }} />
          </TouchableOpacity>

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