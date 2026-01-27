import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
  Dimensions
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import SearchBar from '@/components/SearchBar';
import SortButton from '@/components/atom/SortButton';
import CollectionGridItem from '@/components/CollectionGridItem';
import { collectionItemsData } from '@/constants/AntData';

// Get screen dimensions for responsive grid
const { width } = Dimensions.get('window');
const numColumns = 2;
const gap = 10;
const itemWidth = (width - 40 - gap) / numColumns;

type SortOption = 'newest' | 'oldest' | 'a-z' | 'z-a';

export default function CollectionScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [showSortOptions, setShowSortOptions] = useState(false);

  // Filter collection based on search query
  const filteredCollection = collectionItemsData.filter(item => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      item.title.toLowerCase().includes(query) ||
      item.subtitle.toLowerCase().includes(query)
    );
  });

  const handleItemPress = (id: string) => {
    router.push({
      pathname: '/detail/[id]',
      params: { id }
    });
  };

  const toggleSortOptions = () => {
    setShowSortOptions(!showSortOptions);
  };

  const handleSort = (option: SortOption) => {
    setSortOption(option);
    setShowSortOptions(false);
  };

  const handleFilter = () => {
    // In a real app, this would open a filter modal or screen
    console.log('Open filter options');
  };

  const renderItem = ({ item, index }: { item: typeof collectionItemsData[0], index: number }) => {
    const isLeftColumn = index % 2 === 0;

    return (
      <CollectionGridItem
        id={item.id}
        title={item.title}
        subtitle={item.subtitle}
        image={item.image}
        itemWidth={itemWidth}
        isLeftColumn={isLeftColumn}
        onPress={() => handleItemPress(item.id)}
      />
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      <View className="px-5 pt-4 pb-5">
        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search your collection..."
          containerClassName="mb-5"
          showBorder={false}
        />

        {/* Sort and Filter */}
        <View className="flex-row justify-between mb-5">
          {/* Sort Button */}
          <View className="relative">
            <SortButton
              onPress={toggleSortOptions}
              isOpen={showSortOptions}
            />

            {/* Sort Options Dropdown */}
            {showSortOptions && (
              <View className="absolute left-0 z-10 w-40 bg-white border border-gray-200 rounded-lg shadow-md top-14">
                <TouchableOpacity
                  className={`px-4 py-3 ${sortOption === 'newest' ? 'bg-gray-100' : ''}`}
                  onPress={() => handleSort('newest')}
                >
                  <Text>Newest</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`px-4 py-3 ${sortOption === 'oldest' ? 'bg-gray-100' : ''}`}
                  onPress={() => handleSort('oldest')}
                >
                  <Text>Oldest</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`px-4 py-3 ${sortOption === 'a-z' ? 'bg-gray-100' : ''}`}
                  onPress={() => handleSort('a-z')}
                >
                  <Text>A-Z</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`px-4 py-3 ${sortOption === 'z-a' ? 'bg-gray-100' : ''}`}
                  onPress={() => handleSort('z-a')}
                >
                  <Text>Z-A</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Filter Button */}
          <TouchableOpacity
            className="flex-row items-center px-5 py-3 border border-gray-300 rounded-full"
            onPress={handleFilter}
          >
            <Ionicons name="options" size={18} color="#333" />
            <Text className="mx-2 text-base font-medium">Filter</Text>
            {activeFilters.length > 0 && (
              <View className="bg-[#328e6e] rounded-full w-6 h-6 items-center justify-center">
                <Text className="text-xs font-bold text-white">{activeFilters.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Collection Grid */}
      <FlatList
        data={filteredCollection}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}