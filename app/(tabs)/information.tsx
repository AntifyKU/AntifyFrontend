import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  FlatList, 
  SafeAreaView,
  StatusBar,
  Dimensions
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons, Feather } from '@expo/vector-icons';

// Get screen dimensions for responsive grid
const { width } = Dimensions.get('window');
const numColumns = 2;
const gap = 10; // Gap between items
const itemWidth = (width - 40 - gap) / numColumns; // 40 = padding (20) * 2

// Sample collection data
const collectionData = [
  { id: '1', title: 'Worem ipsum', subtitle: 'Porem ipsum', image: '/placeholder.svg?height=200&width=200&query=black+ant' },
  { id: '2', title: 'Worem ipsum', subtitle: 'Porem ipsum', image: '/placeholder.svg?height=200&width=200&query=red+ant' },
  { id: '3', title: 'Worem ipsum', subtitle: 'Porem ipsum', image: '/placeholder.svg?height=200&width=200&query=carpenter+ant' },
  { id: '4', title: 'Worem ipsum', subtitle: 'Porem ipsum', image: '/placeholder.svg?height=200&width=200&query=fire+ant' },
  { id: '5', title: 'Worem ipsum', subtitle: 'Porem ipsum', image: '/placeholder.svg?height=200&width=200&query=harvester+ant' },
  { id: '6', title: 'Worem ipsum', subtitle: 'Porem ipsum', image: '/placeholder.svg?height=200&width=200&query=army+ant' },
  { id: '7', title: 'Worem ipsum', subtitle: 'Porem ipsum', image: '/placeholder.svg?height=200&width=200&query=leaf+cutter+ant' },
  { id: '8', title: 'Worem ipsum', subtitle: 'Porem ipsum', image: '/placeholder.svg?height=200&width=200&query=bullet+ant' },
];

type SortOption = 'newest' | 'oldest' | 'a-z' | 'z-a';

export default function CollectionScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [showSortOptions, setShowSortOptions] = useState(false);
  
  const handleItemPress = (id: string) => {
    router.push({
      pathname: '/detail',
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
  
  const renderItem = ({ item, index }: { item: typeof collectionData[0], index: number }) => {
    // Calculate if this is an item in the left column (even index) or right column (odd index)
    const isLeftColumn = index % 2 === 0;
    
    return (
      <TouchableOpacity 
        style={{ 
          width: itemWidth, 
          marginBottom: 20,
          marginLeft: isLeftColumn ? 0 : gap,
        }}
        onPress={() => handleItemPress(item.id)}
      >
        <View className="bg-[#e1eebc] rounded-lg overflow-hidden aspect-square items-center justify-center">
          <Ionicons name="image-outline" size={64} color="#328e6e" />
        </View>
        <Text className="mt-2 text-gray-500">{item.subtitle}</Text>
        <Text className="text-xl font-semibold">{item.title}</Text>
      </TouchableOpacity>
    );
  };
  
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      
      <View className="px-5 pt-4 pb-5">
        {/* Search Bar */}
        <View className="flex-row items-center px-4 py-3 mb-5 bg-gray-100 rounded-full">
          <Feather name="search" size={20} color="#666" />
          <TextInput
            className="flex-1 ml-2 text-base"
            placeholder="Norem ipsum"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
         <Text className="mb-4 text-3xl font-bold text-gray-800">Find for all ant</Text>
        {/* Sort and Filter */}
        <View className="flex-row justify-between mb-5">
          {/* Sort Button */}
          <View className="relative">
            <TouchableOpacity 
              className="flex-row items-center px-5 py-3 border border-gray-300 rounded-full"
              onPress={toggleSortOptions}
            >
              <Ionicons name="swap-vertical" size={18} color="#333" />
              <Text className="ml-2 text-base font-medium">Sort</Text>
              <Ionicons 
                name={showSortOptions ? "chevron-up" : "chevron-down"} 
                size={18} 
                color="#333" 
                style={{ marginLeft: 4 }}
              />
            </TouchableOpacity>
            
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
        data={collectionData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}