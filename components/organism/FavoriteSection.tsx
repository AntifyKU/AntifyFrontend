import React, { useMemo, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import ProfileItemCard from "@/components/molecule/ProfileItemListCard";
import SortModal from "@/components/molecule/SortModal";
import { SortOption, getSortLabel } from "@/utils/sort";
import ActionButton from "@/components/atom/button/ActionButton";
import EmptyState from "@/components/molecule/EmptyState";
import { useFavorites } from "@/hooks/useFavorites";

const FavoriteSection: React.FC = () => {
  const { favorites, isLoading, removeFromFavorites } = useFavorites();

  const [showSort, setShowSort] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);

  const sortedFavorites = useMemo(() => {
    return [...favorites].sort((a, b) => {
      switch (sortOption) {
        case "newest":
          return (
            new Date(b.added_at).getTime() - new Date(a.added_at).getTime()
          );
        case "oldest":
          return (
            new Date(a.added_at).getTime() - new Date(b.added_at).getTime()
          );
        case "name-asc":
          return a.species_name.localeCompare(b.species_name);
        case "name-desc":
          return b.species_name.localeCompare(a.species_name);
        default:
          return 0;
      }
    });
  }, [favorites, sortOption]);

  const handleDelete = async (id: string) => {
    setDeletingItemId(id);
    try {
      await removeFromFavorites(id);
    } finally {
      setDeletingItemId(null);
    }
  };

  const handleItemPress = (id: string) => {
    router.push({ pathname: "/detail/[id]", params: { id } });
  };

  return (
    <>
      <SortModal
        visible={showSort}
        selected={sortOption}
        onClose={() => setShowSort(false)}
        onSelect={(opt) => {
          setSortOption(opt);
          setShowSort(false);
        }}
      />

      {/* Sort row */}
      {!isLoading && favorites.length > 0 && (
        <View className="flex-row items-center justify-end px-5 mb-4">
          <ActionButton
            type="sort"
            label={getSortLabel(sortOption)}
            isOpen={showSort}
            onPress={() => setShowSort(true)}
          />
        </View>
      )}

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
            <>
              <Text className="text-gray-500 text-sm mb-3 text-center">
                Tap the heart to remove from favorites
              </Text>

              {sortedFavorites.map((item) => (
                <ProfileItemCard
                  key={item.id}
                  id={item.species_id}
                  title={item.species_name}
                  description={item.species_scientific_name}
                  image={item.species_image}
                  onPress={() => handleItemPress(item.species_id)}
                  variant="favorite"
                  onRemove={() => handleDelete(item.species_id)}
                  isRemoving={deletingItemId === item.species_id}
                />
              ))}
            </>
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