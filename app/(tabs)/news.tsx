import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  Alert,
  Linking,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as WebBrowser from "expo-web-browser";
import { Ionicons } from "@expo/vector-icons";
import ListCard from "@/components/ListCard";
import SearchBar from "@/components/SearchBar";
import ActionButton from "@/components/atom/button/ActionButton";
import { useNews } from "@/hooks/useNews";
import { useFavoriteNews } from "@/hooks/useFavoriteNews";
import { ScreenHeader } from "@/components/molecule/ScreenHeader";
import EmptyState from "@/components/molecule/EmptyState";
import SortModal from "@/components/molecule/SortModal";
import { SortOption, getSortLabel } from "@/utils/sort";
import { useAuth } from "@/context/AuthContext";
import NotificationModal from "@/components/organism/modal/NotificationModal";

export default function NewsScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [showNoti, setShowNoti] = useState(false);

  const { user, isAuthenticated } = useAuth();
  const { news, loading, refetch } = useNews({ limit: 20 });
  const {
    favoriteNews,
    isFavorite,
    toggleFavorite,
    refresh: refreshFavorites,
  } = useFavoriteNews();

  const filteredNews = useMemo(() => {
    let result = [...news];
    const query = searchQuery.toLowerCase().trim();

    if (query) {
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query),
      );
    }

    result.sort((a, b) => {
      switch (sortOption) {
        case "newest":
          return (
            new Date(b.published_at ?? 0).getTime() -
            new Date(a.published_at ?? 0).getTime()
          );
        case "oldest":
          return (
            new Date(a.published_at ?? 0).getTime() -
            new Date(b.published_at ?? 0).getTime()
          );
        case "name-asc":
          return a.title.localeCompare(b.title);
        case "name-desc":
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    return result;
  }, [news, searchQuery, sortOption]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetch(), refreshFavorites()]);
    setRefreshing(false);
  };

  const handleNewsPress = async (newsUrl: string) => {
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

  const handleToggleFavorite = async (newsId: string) => {
    if (!isAuthenticated) {
      Alert.alert("Login Required", "Please login to add news to favorites", [
        { text: "OK" },
      ]);
      return;
    }

    try {
      await toggleFavorite(newsId);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update favorite");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      {/* Sort Modal */}
      <SortModal
        visible={showSort}
        selected={sortOption}
        onClose={() => setShowSort(false)}
        onSelect={(opt) => {
          setSortOption(opt);
          setShowSort(false);
        }}
      />

      <NotificationModal
        visible={showNoti}
        role={user?.role === "admin" ? "admin" : "user"}
        onClose={() => setShowNoti(false)}
      />

      {/* Header */}
      <View className="pt-4 pb-5">
        <ScreenHeader
          title="News"
          rightIcon="notifications-outline"
          onRightPress={() => setShowNoti(true)}
        />
      </View>

      {/* Search */}
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search news..."
      />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator
        contentContainerStyle={{
          flexGrow: filteredNews.length === 0 ? 1 : 0,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#22A45D"]}
            tintColor="#22A45D"
          />
        }
      >
        {/* Action */}
        <View className="flex-row justify-end px-5 mb-4">
          <ActionButton
            type="sort"
            label={getSortLabel(sortOption)}
            onPress={() => setShowSort(true)}
          />
        </View>

        {/* Loading */}
        {loading && !refreshing && (
          <View className="py-10 items-center">
            <ActivityIndicator size="large" color="#22A45D" />
            <Text className="mt-4 text-gray-500">Loading news...</Text>
          </View>
        )}

        {/* List */}
        {!loading && (
          <View className="px-5">
            {filteredNews.map((newsItem) => {
              const newsIsFavorite = isAuthenticated && isFavorite(newsItem.id);

              return (
                <View key={newsItem.id} className="relative">
                  <ListCard
                    id={newsItem.id}
                    title={newsItem.title}
                    description={newsItem.description}
                    image={newsItem.image || ""}
                    onPress={() => handleNewsPress(newsItem.link)}
                    showChevron={false}
                  />

                  {/* Heart Button */}
                  <TouchableOpacity
                    onPress={() => handleToggleFavorite(newsItem.id)}
                    className="absolute top-2 right-2 w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm"
                    style={{
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 3,
                      elevation: 3,
                    }}
                  >
                    <Ionicons
                      name={newsIsFavorite ? "heart" : "heart-outline"}
                      size={20}
                      color={newsIsFavorite ? "#EF4444" : "#6B7280"}
                    />
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        )}

        {/* Empty */}
        {!loading && filteredNews.length === 0 && (
          <View className="flex-1 items-center justify-center">
            <EmptyState
              icon="newspaper-outline"
              iconSize={48}
              title={
                searchQuery
                  ? "No news found matching your search"
                  : "No news available"
              }
            />
          </View>
        )}

        <View className="h-24" />
      </ScrollView>
    </SafeAreaView>
  );
}
