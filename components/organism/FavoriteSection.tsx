import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  Linking,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { Ionicons } from "@expo/vector-icons";
import ListCard from "@/components/ListCard";
import SortModal from "@/components/molecule/SortModal";
import { SortOption, getSortLabel } from "@/utils/sort";
import ActionButton from "@/components/atom/button/ActionButton";
import EmptyState from "@/components/molecule/EmptyState";
import { useFavoriteNews } from "@/hooks/useFavoriteNews";

const FavoriteNewsSection: React.FC = () => {
  const { favoriteNews, isLoading, removeFromFavorites } = useFavoriteNews();

  const [showSort, setShowSort] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);

  const sortedFavoriteNews = useMemo(() => {
    return [...favoriteNews].sort((a, b) => {
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
          return a.news_title.localeCompare(b.news_title);
        case "name-desc":
          return b.news_title.localeCompare(a.news_title);
        default:
          return 0;
      }
    });
  }, [favoriteNews, sortOption]);

  const handleDelete = async (newsId: string) => {
    setDeletingItemId(newsId);
    try {
      await removeFromFavorites(newsId);
    } finally {
      setDeletingItemId(null);
    }
  };

  const handleItemPress = async (newsUrl: string) => {
    try {
      await WebBrowser.openBrowserAsync(newsUrl);
    } catch {
      const canOpen = await Linking.canOpenURL(newsUrl);
      if (canOpen) {
        await Linking.openURL(newsUrl);
      } else {
        Alert.alert("Cannot open URL", "The link cannot be opened.");
      }
    }
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
      <View className="flex-row items-center justify-between px-5 mb-4">
        <View />
        <ActionButton
          type="sort"
          label={getSortLabel(sortOption)}
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
          {sortedFavoriteNews.length > 0 ? (
            <>
              <Text className="text-gray-500 text-sm mb-3 text-center">
                Tap the heart to remove from favorites
              </Text>

              {sortedFavoriteNews.map((item) => (
                <View key={item.id} className="relative">
                  <ListCard
                    id={item.news_id}
                    title={item.news_title}
                    description={item.news_description}
                    image={item.news_image}
                    onPress={() => handleItemPress(item.news_link)}
                    showChevron={false}
                  />

                  {/* Heart Button - same as NewsScreen */}
                  <TouchableOpacity
                    onPress={() => handleDelete(item.news_id)}
                    className="absolute top-2 right-2 w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm"
                    style={{
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 3,
                      elevation: 3,
                    }}
                    disabled={deletingItemId === item.news_id}
                  >
                    <Ionicons name="heart" size={20} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </>
          ) : (
            <EmptyState
              icon="heart-outline"
              title={`No favorite news yet.\nTap the heart icon on any news to save it!`}
              buttonTitle="Browse News"
              onButtonPress={() => router.push("/news")}
            />
          )}
        </View>
      )}
    </>
  );
};

export default FavoriteNewsSection;
