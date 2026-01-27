import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  Linking,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import ListCard from "@/components/ListCard";
import SearchBar from "@/components/SearchBar";
import SortButton from "@/components/atom/SortButton";
import { useNews } from "@/hooks/useNews";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "@/components/molecule/ScreenHeader";

export default function NewsScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // Fetch news from API with fallback to static data
  const { news, loading, error, refetch, isUsingFallback } = useNews({
    limit: 20,
  });

  // Filter news based on search query
  const filteredNews = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return news;
    return news.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query),
    );
  }, [news, searchQuery]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleNewsPress = async (newsUrl: string) => {
    try {
      await WebBrowser.openBrowserAsync(newsUrl);
    } catch (error) {
      console.error("Error opening URL:", error);
      const canOpen = await Linking.canOpenURL(newsUrl);
      if (canOpen) {
        await Linking.openURL(newsUrl);
      } else {
        Alert.alert("Cannot open URL", "The link cannot be opened.");
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="pt-4 pb-5">
        <ScreenHeader
          title="News"
          rightIcon="notifications-outline"
          onRightPress={() => {}}
        />
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#328e6e"]}
            tintColor="#328e6e"
          />
        }
      >
        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search news..."
          containerClassName="px-5 mb-3"
          showBorder={false}
        />

        {/* Sort Button */}
        <View className="flex-row justify-end px-5 mb-4">
          <SortButton onPress={() => {}} />
        </View>

        {/* Loading State */}
        {loading && !refreshing && (
          <View className="py-12 items-center">
            <ActivityIndicator size="large" color="#328e6e" />
            <Text className="mt-4 text-gray-500">Loading news...</Text>
          </View>
        )}

        {/* Empty State */}
        {!loading && filteredNews.length === 0 && (
          <View className="py-12 items-center px-5">
            <Ionicons name="newspaper-outline" size={48} color="#9CA3AF" />
            <Text className="mt-4 text-gray-500 text-center">
              {searchQuery
                ? "No news found matching your search"
                : "No news available"}
            </Text>
          </View>
        )}

        {/* News List */}
        {!loading && (
          <View className="px-5">
            {filteredNews.map((newsItem) => (
              <ListCard
                key={newsItem.id}
                id={newsItem.id}
                title={newsItem.title}
                description={newsItem.description}
                image={newsItem.image || ""}
                onPress={() => handleNewsPress(newsItem.link)}
                showChevron={false}
              />
            ))}
          </View>
        )}

        {/* Bottom padding for tab bar */}
        <View className="h-24" />
      </ScrollView>
    </SafeAreaView>
  );
}
