import {
  View,
  Text,
  Pressable,
  Image,
  StatusBar,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { antSpeciesData } from "@/constants/AntData";
import Badge from "@/components/atom/badge/Badge";
import { useSpeciesDetail } from "@/hooks/useSpeciesDetail";
import { useAuth } from "@/context/AuthContext";
import { useFavorites } from "@/hooks/useFavorites";
import { useCollection } from "@/hooks/useCollection";
import { useFolders } from "@/hooks/useFolders";
import { useState } from "react";
import PrimaryButton from "@/components/atom/button/PrimaryButton";
import EmptyState from "@/components/molecule/EmptyState";

// Define the type for route params
type DetailParams = {
  id: string;
  fromIdentification?: string;
  antName?: string;
  scientificName?: string;
  matchPercentage?: string;
  imageUri?: string;
  source?: string;
};

const BUTTON_HEIGHT = 52;

export default function DetailScreen() {
  const params = useLocalSearchParams<DetailParams>();
  const {
    id,
    fromIdentification,
    antName,
    scientificName,
    matchPercentage,
    imageUri,
    source,
  } = params;

  // Auth and data hooks
  const { isAuthenticated } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isInCollection, addToCollection, removeFromCollection } =
    useCollection();
  const { folders } = useFolders();

  // Local loading states for buttons
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  const [isCollectionLoading, setIsCollectionLoading] = useState(false);
  const [showFolderSelect, setShowFolderSelect] = useState(false);
  const [selectedFolderIds, setSelectedFolderIds] = useState<string[]>([]);

  // Fetch species data from API with fallback to static data
  const { species, loading, error, isUsingFallback } = useSpeciesDetail(id);

  // Transform API species to display format
  const currentAnt = species
    ? {
        id: species.id,
        name: species.name,
        scientificName: species.scientific_name,
        classification: species.classification,
        tags: species.tags,
        about: species.about,
        characteristics: species.characteristics,
        colors: species.colors,
        habitat: species.habitat,
        distribution: species.distribution,
        behavior: species.behavior,
        ecologicalRole: species.ecological_role,
        image: species.image || "",
      }
    : antSpeciesData[0];

  const handleBackPress = () => {
    // If coming from identification flow, redirect to feedback page
    if (fromIdentification === "true") {
      router.replace({
        pathname: "/help-improve-ai",
        params: {
          antId: id,
          imageUri,
          source,
          antName: antName || currentAnt.name,
          scientificName: scientificName || currentAnt.scientificName,
          matchPercentage,
        },
      });
    } else {
      router.back();
    }
  };

  const handleFavoritePress = async () => {
    if (!isAuthenticated) {
      Alert.alert("Login Required", "Please log in to add favorites", [
        { text: "Cancel", style: "cancel" },
        { text: "Log In", onPress: () => router.push("/(auth)/login") },
      ]);
      return;
    }

    console.log("[Detail] Favorite button pressed for species:", id);
    console.log("[Detail] Current isFavorite status:", isFavorite(id));

    setIsFavoriteLoading(true);
    try {
      await toggleFavorite(id);
      console.log("[Detail] toggleFavorite completed successfully");
    } catch (error: any) {
      console.error("[Detail] toggleFavorite error:", error);
      Alert.alert("Error", error.message || "Failed to update favorites");
    } finally {
      setIsFavoriteLoading(false);
    }
  };

  const handleCollectionPress = async () => {
    if (!isAuthenticated) {
      Alert.alert("Login Required", "Please log in to add to your collection", [
        { text: "Cancel", style: "cancel" },
        { text: "Log In", onPress: () => router.push("/(auth)/login") },
      ]);
      return;
    }

    // If already in collection, remove it
    if (isInCollection(id)) {
      setIsCollectionLoading(true);
      try {
        await removeFromCollection(id);
      } catch (error: any) {
        Alert.alert(
          "Error",
          error.message || "Failed to remove from collection",
        );
      } finally {
        setIsCollectionLoading(false);
      }
      return;
    }

    // If folders exist, show folder selection modal
    if (folders.length > 0) {
      setSelectedFolderIds([]);
      setShowFolderSelect(true);
    } else {
      // No folders, add directly
      await addToCollectionWithFolders([]);
    }
  };

  const addToCollectionWithFolders = async (folderIds: string[]) => {
    setIsCollectionLoading(true);
    try {
      await addToCollection(id, undefined, undefined, folderIds);
      setShowFolderSelect(false);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to add to collection");
    } finally {
      setIsCollectionLoading(false);
    }
  };

  const toggleFolderSelection = (folderId: string) => {
    setSelectedFolderIds((prev) =>
      prev.includes(folderId)
        ? prev.filter((id) => id !== folderId)
        : [...prev, folderId],
    );
  };

  // Check current status
  const isCurrentFavorite = isAuthenticated && isFavorite(id);
  const isCurrentInCollection = isAuthenticated && isInCollection(id);

  // Show loading state
  if (loading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <StatusBar barStyle="dark-content" />
        <ActivityIndicator size="large" color="#0A9D5C" />
        <Text className="mt-4 text-gray-600">Loading species details...</Text>
      </View>
    );
  }

  // Show error state if no data available
  if (!species && !loading) {
    return (
      <View className="flex-1 bg-white">
        <StatusBar barStyle="dark-content" />
        <SafeAreaView edges={["top"]}>
          <Pressable
            onPress={handleBackPress}
            className="m-4 w-10 h-10 rounded-full bg-white/80 items-center justify-center"
            style={({ pressed }) => pressed && styles.pressed}
          >
            <Ionicons name="chevron-back" size={24} color="#333" />
          </Pressable>
        </SafeAreaView>
        <View className="flex-1 items-center justify-center px-8">
          <EmptyState
            icon="alert-circle-outline"
            iconColor="#9CA3AF"
            title={"Species Not Found"}
            titleStyle={{ fontWeight: "600", color: "#333" }}
            description={"Unable to load species details. Please try again."}
            descriptionStyle={{ color: "#374151" }}
            buttonTitle={"Go Back"}
            onButtonPress={handleBackPress}
          />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      {/* Folder Selection Modal */}
      <Modal
        visible={showFolderSelect}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowFolderSelect(false)}
      >
        <Pressable
          className="flex-1 bg-black/30 justify-center items-center"
          onPress={() => setShowFolderSelect(false)}
        >
          <Pressable
            className="bg-white rounded-2xl mx-6 w-[90%] max-w-[340px]"
            onPress={() => {}}
          >
            <View className="p-6">
              <Text className="text-xl font-bold text-center text-gray-800 mb-2">
                Add to Collection
              </Text>
              <Text className="text-sm text-gray-500 text-center mb-4">
                Select folders to organize this species
              </Text>

              {/* Folder list */}
              <View className="mb-4 max-h-64">
                <ScrollView showsVerticalScrollIndicator={false}>
                  {folders.map((folder) => {
                    const isSelected = selectedFolderIds.includes(folder.id);
                    return (
                      <TouchableOpacity
                        key={folder.id}
                        className={`flex-row items-center p-3 rounded-lg mb-2 ${
                          isSelected ? "bg-green-50" : "bg-gray-50"
                        }`}
                        onPress={() => toggleFolderSelection(folder.id)}
                      >
                        <View
                          className="w-4 h-4 rounded-full mr-3"
                          style={{ backgroundColor: folder.color }}
                        />
                        <Text className="flex-1 text-base text-gray-800">
                          {folder.name}
                        </Text>
                        {isSelected && (
                          <Ionicons
                            name="checkmark-circle"
                            size={24}
                            color="#22A45D"
                          />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Buttons */}
              <View className="flex-row">
                <TouchableOpacity
                  className="flex-1 py-3 rounded-lg border border-gray-300 mr-2"
                  onPress={() => setShowFolderSelect(false)}
                >
                  <Text className="text-center text-gray-600 font-medium">
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 py-3 rounded-lg bg-[#22A45D] ml-2"
                  onPress={() => addToCollectionWithFolders(selectedFolderIds)}
                  disabled={isCollectionLoading}
                >
                  {isCollectionLoading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text className="text-center text-white font-medium">
                      {selectedFolderIds.length > 0
                        ? "Add to Collection"
                        : "Skip Folders"}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Fixed Header - Back Button Only - Stays on screen when scrolling */}
      <View className="absolute top-0 left-0 z-20" style={{ zIndex: 20 }}>
        <SafeAreaView edges={["top"]}>
          <Pressable
            onPress={handleBackPress}
            className="m-4 w-10 h-10 rounded-full bg-white/80 items-center justify-center"
            style={({ pressed }) => [
              {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              },
              pressed && styles.pressed,
            ]}
          >
            <Ionicons name="chevron-back" size={24} color="#0A9D5C" />
          </Pressable>
        </SafeAreaView>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Image Header - Full width image that scrolls with content */}
        <View className="relative">
          {/* Full width image */}
          {currentAnt.image ? (
            <Image
              source={{ uri: currentAnt.image }}
              className="w-full h-72"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-72 bg-[#e8f5e0] items-center justify-center">
              <MaterialCommunityIcons name="image" size={64} color="#328e6e" />
            </View>
          )}

          {/* Pagination Dots - only show if more than 1 image */}
          {currentAnt.image &&
            // For now we only have 1 image per ant, so don't show dots
            // When multiple images are added, this will show the correct number of dots
            null}
        </View>

        {/* Content */}
        <View className="px-5 pt-5">
          {/* Title */}
          <Text className="text-2xl font-bold text-gray-800 mb-1">
            {currentAnt.name}
          </Text>
          <Text className="text-gray-500 italic mb-3">
            {currentAnt.scientificName}
          </Text>

          {/* Tags */}
          <View className="flex-row flex-wrap mb-4">
            {currentAnt.tags.map((tag, index) => (
              <View
                key={index}
                className="bg-[#0A9D5C] rounded-full px-4 py-1.5 mr-2 mb-2"
              >
                <Text className="text-sm text-white font-medium">{tag}</Text>
              </View>
            ))}
          </View>

          {/* About Section */}
          <View className="mb-5">
            <Text className="text-lg font-bold text-gray-800 mb-2">About</Text>
            <Text className="text-gray-600 leading-5">{currentAnt.about}</Text>
          </View>

          {/* Classification Section */}
          <View className="mb-5">
            <Text className="text-lg font-bold text-gray-800 mb-3">
              Classification
            </Text>
            <View className="bg-white border border-gray-100 rounded-xl overflow-hidden">
              <View className="flex-row justify-between py-3 px-4 border-b border-gray-100">
                <Text className="text-gray-600">Family</Text>
                <Text className="text-gray-800 font-medium">
                  {currentAnt.classification.family}
                </Text>
              </View>
              <View className="flex-row justify-between py-3 px-4 border-b border-gray-100">
                <Text className="text-gray-600">Subfamily</Text>
                <Text className="text-gray-800 font-medium">
                  {currentAnt.classification.subfamily}
                </Text>
              </View>
              <View className="flex-row justify-between py-3 px-4">
                <Text className="text-gray-600">Genus</Text>
                <Text className="text-[#0A9D5C] font-medium italic">
                  {currentAnt.classification.genus}
                </Text>
              </View>
            </View>
          </View>

          {/* Characteristics Section */}
          <View className="mb-5">
            <Text className="text-lg font-bold text-gray-800 mb-2">
              Characteristics
            </Text>
            <Text className="text-gray-600 leading-5">
              {currentAnt.characteristics}
            </Text>
          </View>

          {/* Color Section */}
          <View className="mb-5">
            <Text className="text-lg font-bold text-gray-800 mb-2">Color</Text>
            <View className="flex-row flex-wrap">
              {currentAnt.colors.map((color, index) => (
                <Badge
                  key={index}
                  label={color}
                  onPress={() => {}}
                  size="small"
                  showCloseIcon={false}
                />
              ))}
            </View>
          </View>

          {/* Habitat Section */}
          <View className="mb-5">
            <Text className="text-lg font-bold text-gray-800 mb-2">
              Habitat
            </Text>
            <View className="flex-row flex-wrap">
              {currentAnt.habitat.map((hab, index) => (
                <Badge
                  key={index}
                  label={hab}
                  onPress={() => {}}
                  size="small"
                  showCloseIcon={false}
                />
              ))}
            </View>
          </View>

          {/* Distribution in Thailand Section */}
          <View className="mb-5">
            <Text className="text-lg font-bold text-gray-800 mb-2">
              Distribution in Thailand
            </Text>
            <View className="flex-row flex-wrap">
              {currentAnt.distribution.map((dist, index) => (
                <Badge
                  key={index}
                  label={dist}
                  onPress={() => {}}
                  size="small"
                  showCloseIcon={false}
                />
              ))}
            </View>
          </View>

          {/* Behavior Section */}
          <View className="mb-5">
            <Text className="text-lg font-bold text-gray-800 mb-2">
              Behavior
            </Text>
            <Text className="text-gray-600 leading-5">
              {currentAnt.behavior}
            </Text>
          </View>

          {/* Ecological Role Section */}
          <View className="mb-5">
            <Text className="text-lg font-bold text-gray-800 mb-2">
              Ecological Role
            </Text>
            <Text className="text-gray-600 leading-5">
              {currentAnt.ecologicalRole}
            </Text>
          </View>

          {/* Contribute Section */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-800 mb-2">
              Contribute
            </Text>
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-600">Help improve our database</Text>
              <PrimaryButton
                title="Suggest Update"
                onPress={() => {
                  if (!isAuthenticated) {
                    Alert.alert(
                      "Login Required",
                      "Please log in to suggest updates to species information",
                      [
                        { text: "Cancel", style: "cancel" },
                        {
                          text: "Log In",
                          onPress: () => router.push("/(auth)/login"),
                        },
                      ],
                    );
                    return;
                  }
                  router.push("/requestformpage");
                }}
                icon="pencil"
                fullWidth={false}
                variant="outlined"
                size="small"
                style={{ shadowColor: "transparent" }}
                textStyle={{ fontWeight: "600" }}
              />
            </View>
          </View>
        </View>

        {/* Add space for bottom buttons */}
        <View className="h-32" />
      </ScrollView>

      {/* Bottom Fixed Buttons */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100">
        <SafeAreaView edges={["bottom"]}>
          <View className="flex-row px-4 py-3 gap-3">
            {/* Add to Collection */}
            <View style={{ flex: 2 }}>
              <View style={{ height: BUTTON_HEIGHT }}>
                <PrimaryButton
                  title={
                    isCurrentInCollection
                      ? "In Collection"
                      : "Add to My Collection"
                  }
                  onPress={handleCollectionPress}
                  disabled={isCollectionLoading}
                  icon={isCurrentInCollection ? "checkmark" : "add"}
                  fullWidth
                  variant={isCurrentInCollection ? "outlined" : "filled"}
                  iconColor={isCurrentInCollection ? "#0A9D5C" : "#FFFFFF"}
                  style={{
                    height: BUTTON_HEIGHT,
                    borderColor: "#0A9D5C",
                    backgroundColor: isCurrentInCollection
                      ? "#E8F6EF"
                      : "#0A9D5C",
                    shadowColor: isCurrentInCollection
                      ? "transparent"
                      : "#0A9D5C",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: isCurrentInCollection ? 0 : 0.3,
                    shadowRadius: 8,
                    elevation: isCurrentInCollection ? 0 : 6,
                  }}
                  textStyle={{
                    color: isCurrentInCollection ? "#0A9D5C" : "#FFFFFF",
                    fontWeight: "600",
                  }}
                />
              </View>
            </View>

            {/* Ask Chat */}
            <View style={{ flex: 1 }}>
              <View style={{ height: BUTTON_HEIGHT }}>
                <PrimaryButton
                  title="Ask Chat"
                  onPress={() => router.push("/chatbot")}
                  fullWidth
                  variant="outlined"
                  style={{
                    height: BUTTON_HEIGHT,
                    borderColor: "#0A9D5C",
                    shadowColor: "transparent",
                  }}
                  textStyle={{ fontWeight: "600" }}
                />
              </View>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.7,
  },
});
