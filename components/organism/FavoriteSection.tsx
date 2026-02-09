import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import FavoriteListCard from "@/components/FavoriteListCard";
import SortModal from "@/components/molecule/SortModal";
import { SortOption, getSortLabel } from "@/utils/sort";
import ActionButton from "@/components/atom/button/ActionButton";
import EmptyState from "@/components/molecule/EmptyState";

interface FavoriteItem {
  id: string;
  species_id: string;
  species_name: string;
  species_scientific_name: string;
  species_image: string;
  added_at: string;
}

interface FavoriteSectionProps {
  sortedFavorites: FavoriteItem[];
  isLoading: boolean;
  deletingItemId: string | null;
  showSort: boolean;
  setShowSort: (value: boolean) => void;
  favoritesSortOption: SortOption;
  handleItemPress: (id: string) => void;
  handleDeleteFavorite: (speciesId: string) => void;
  handleSortSelect: (option: SortOption) => void;
}

const FavoriteSection: React.FC<FavoriteSectionProps> = ({
  sortedFavorites,
  isLoading,
  deletingItemId,
  showSort,
  setShowSort,
  favoritesSortOption,
  handleItemPress,
  handleDeleteFavorite,
  handleSortSelect,
}) => {
  return (
    <>
      {/* Sort Modal */}
      <SortModal
        visible={showSort}
        selected={favoritesSortOption}
        onClose={() => setShowSort(false)}
        onSelect={(option) => handleSortSelect(option)}
      />

      {/* Sort row */}
      <View className="flex-row items-center justify-between px-5 mb-4">
        <View />
        <ActionButton
          type="sort"
          label={getSortLabel(favoritesSortOption)}
          isOpen={showSort}
          onPress={() => setShowSort(true)}
        />
      </View>

      {/* Loading */}
      {isLoading && (
        <View className="items-center py-8">
          <ActivityIndicator size="large" color="#0A9D5C" />
          <Text className="mt-2 text-gray-500">Loading...</Text>
        </View>
      )}

      {/* Content */}
      {!isLoading && (
        <View className="px-5">
          {sortedFavorites.length > 0 ? (
            <View>
              <Text className="text-gray-400 text-xs mb-3 text-center">
                Tap the heart to remove from favorites
              </Text>
              {sortedFavorites.map((item) => (
                <FavoriteListCard
                  key={item.id}
                  id={item.species_id}
                  title={item.species_name}
                  description={item.species_scientific_name}
                  image={item.species_image}
                  onPress={() => handleItemPress(item.species_id)}
                  onRemove={() => handleDeleteFavorite(item.species_id)}
                  isRemoving={deletingItemId === item.species_id}
                />
              ))}
            </View>
          ) : (
            <EmptyState
              icon="heart-outline"
              title={`No favorites yet.\nTap the heart icon on any species to save it!`}
              buttonTitle="Explore Species"
              onButtonPress={() => router.push("/(tabs)/explore")}
            />
          )}
        </View>
      )}
    </>
  );
};

export default FavoriteSection;
