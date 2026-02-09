import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  ActionSheetIOS,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "@/context/AuthContext";
import { useFavorites } from "@/hooks/useFavorites";
import { useCollection } from "@/hooks/useCollection";
import { useFolders } from "@/hooks/useFolders";
import { authService } from "@/services/auth";
import { Folder } from "@/services/folders";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "@/components/molecule/ScreenHeader";
import SettingsModal from "@/components/organism/modal/SettingModal";
import { TabSwitcher } from "@/components/atom/TabSwitcher";
import PrimaryButton from "@/components/atom/button/PrimaryButton";
import CollectionSection from "@/components/organism/CollectionSection";
import FavoriteSection from "@/components/organism/FavoriteSection";

const { width } = Dimensions.get("window");
const numColumns = 2;
const gap = 12;
const itemWidth = (width - 40 - gap) / numColumns;

type TabType = "collection" | "favorite";
type SortOption = "newest" | "oldest" | "name-asc" | "name-desc";

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState<TabType>("collection");
  const [showSettings, setShowSettings] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [collectionSortOption, setCollectionSortOption] =
    useState<SortOption>("newest");
  const [favoritesSortOption, setFavoritesSortOption] =
    useState<SortOption>("newest");

  // Folder-related state
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  // Auth and data hooks
  const {
    user,
    token,
    isAuthenticated,
    logout,
    refreshUser,
    isLoading: authLoading,
  } = useAuth();
  const {
    favorites,
    isLoading: favoritesLoading,
    removeFromFavorites,
    refresh: refreshFavorites,
  } = useFavorites();
  const {
    collection,
    isLoading: collectionLoading,
    removeFromCollection,
    setItemFolders,
    getItemsByFolder,
    refresh: refreshCollection,
  } = useCollection();
  const {
    folders,
    isLoading: foldersLoading,
    createFolder,
    updateFolder,
    deleteFolder,
    refresh: refreshFolders,
  } = useFolders();

  // Debug: Log when collection changes
  useEffect(() => {
    console.log(
      "[Profile] Collection state changed, length:",
      collection.length,
    );
    if (collection.length > 0) {
      console.log("[Profile] First item:", {
        id: collection[0].id,
        species_id: collection[0].species_id,
        species_name: collection[0].species_name,
      });
    }
  }, [collection]);

  // Sorted and filtered collection
  const sortedCollection = useMemo(() => {
    console.log(
      "[Profile] Computing sortedCollection, collection length:",
      collection.length,
    );

    const filtered =
      selectedFolderId === null
        ? collection
        : collection.filter((item) =>
            item.folder_ids?.includes(selectedFolderId),
          );

    console.log(
      "[Profile] After folder filter, filtered length:",
      filtered.length,
    );

    return [...filtered].sort((a, b) => {
      switch (collectionSortOption) {
        case "newest":
          return (
            new Date(b.added_at).getTime() - new Date(a.added_at).getTime()
          );
        case "oldest":
          return (
            new Date(a.added_at).getTime() - new Date(b.added_at).getTime()
          );
        case "name-asc":
          return (a.species_name || "").localeCompare(b.species_name || "");
        case "name-desc":
          return (b.species_name || "").localeCompare(a.species_name || "");
        default:
          return 0;
      }
    });
  }, [collection, collectionSortOption, selectedFolderId]);

  // Sorted favorites
  const sortedFavorites = useMemo(() => {
    return [...favorites].sort((a, b) => {
      switch (favoritesSortOption) {
        case "newest":
          return (
            new Date(b.added_at).getTime() - new Date(a.added_at).getTime()
          );
        case "oldest":
          return (
            new Date(a.added_at).getTime() - new Date(b.added_at).getTime()
          );
        case "name-asc":
          return (a.species_name || "").localeCompare(b.species_name || "");
        case "name-desc":
          return (b.species_name || "").localeCompare(a.species_name || "");
        default:
          return 0;
      }
    });
  }, [favorites, favoritesSortOption]);

  const currentSortOption =
    activeTab === "collection" ? collectionSortOption : favoritesSortOption;
  const setCurrentSortOption =
    activeTab === "collection"
      ? setCollectionSortOption
      : setFavoritesSortOption;

  const handleSortSelect = (option: SortOption) => {
    setCurrentSortOption(option);
    setShowSort(false);
  };

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (isAuthenticated) {
        console.log("[Profile] Screen focused, refreshing data...");
        console.log(
          "[Profile] Current collection length before refresh:",
          collection.length,
        );
        refreshFavorites();
        refreshCollection().then(() => {
          console.log(
            "[Profile] Collection refreshed, new length:",
            collection.length,
          );
        });
        refreshFolders();
      }
    }, [isAuthenticated, refreshFavorites, refreshCollection, refreshFolders]),
  );

  // Profile picture handlers
  const handleProfilePicturePress = () => {
    if (!isAuthenticated) return;

    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [
            "Cancel",
            "Take Photo",
            "Choose from Library",
            ...(user?.profile_picture ? ["Remove Photo"] : []),
          ],
          destructiveButtonIndex: user?.profile_picture ? 3 : undefined,
          cancelButtonIndex: 0,
        },
        async (buttonIndex) => {
          if (buttonIndex === 1) await handleTakePhoto();
          else if (buttonIndex === 2) await handleChooseFromLibrary();
          else if (buttonIndex === 3 && user?.profile_picture)
            await handleRemovePhoto();
        },
      );
    } else {
      Alert.alert("Change Profile Picture", "Choose an option", [
        { text: "Cancel", style: "cancel" },
        { text: "Take Photo", onPress: handleTakePhoto },
        { text: "Choose from Library", onPress: handleChooseFromLibrary },
        ...(user?.profile_picture
          ? [
              {
                text: "Remove Photo",
                style: "destructive" as const,
                onPress: handleRemovePhoto,
              },
            ]
          : []),
      ]);
    }
  };

  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Camera permission is required to take photos.",
        );
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets[0]) {
        await uploadProfilePicture(
          result.assets[0].uri,
          result.assets[0].mimeType,
        );
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Error", "Failed to take photo");
    }
  };

  const handleChooseFromLibrary = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Gallery permission is required to select photos.",
        );
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets[0]) {
        await uploadProfilePicture(
          result.assets[0].uri,
          result.assets[0].mimeType,
        );
      }
    } catch (error) {
      console.error("Error selecting photo:", error);
      Alert.alert("Error", "Failed to select photo");
    }
  };

  const uploadProfilePicture = async (
    uri: string,
    mimeType?: string | null,
  ) => {
    if (!token) return;
    setIsUploadingPhoto(true);
    try {
      await authService.uploadProfilePicture(
        token,
        uri,
        mimeType || "image/jpeg",
      );
      await refreshUser();
      Alert.alert("Success", "Profile picture updated!");
    } catch (error: any) {
      console.error("Error uploading photo:", error);
      Alert.alert("Error", error.message || "Failed to upload profile picture");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (!token) return;
    Alert.alert(
      "Remove Photo",
      "Are you sure you want to remove your profile picture?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            setIsUploadingPhoto(true);
            try {
              await authService.deleteProfilePicture(token);
              await refreshUser();
              Alert.alert("Success", "Profile picture removed");
            } catch (error: any) {
              Alert.alert(
                "Error",
                error.message || "Failed to remove profile picture",
              );
            } finally {
              setIsUploadingPhoto(false);
            }
          },
        },
      ],
    );
  };

  // Collection / Favorite handlers
  const handleItemPress = (id: string) => {
    if (isEditMode) return;
    router.push({ pathname: "/detail/[id]", params: { id } });
  };

  const handleDeleteCollection = async (speciesId: string) => {
    Alert.alert(
      "Remove from Collection",
      "Are you sure you want to remove this species from your collection?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            setDeletingItemId(speciesId);
            try {
              await removeFromCollection(speciesId);
            } catch (error: any) {
              Alert.alert(
                "Error",
                error.message || "Failed to remove from collection",
              );
            } finally {
              setDeletingItemId(null);
            }
          },
        },
      ],
    );
  };

  const handleDeleteFavorite = async (speciesId: string) => {
    console.log(
      "[Profile] handleDeleteFavorite called with speciesId:",
      speciesId,
    );
    setDeletingItemId(speciesId);
    try {
      await removeFromFavorites(speciesId);
      console.log("[Profile] Successfully removed favorite:", speciesId);
    } catch (error: any) {
      console.error("[Profile] Error removing favorite:", error);
      Alert.alert("Error", error.message || "Failed to remove from favorites");
    } finally {
      setDeletingItemId(null);
    }
  };

  const handleLogout = async () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  const headerActions = [
    { icon: "notifications-outline" as const, onPress: () => {} },
    { icon: "settings-outline" as const, onPress: () => setShowSettings(true) },
  ];

  // Guest view
  if (!isAuthenticated) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <StatusBar barStyle="dark-content" />

        <SettingsModal
          visible={showSettings}
          onClose={() => setShowSettings(false)}
          user={user}
          isAuthenticated={isAuthenticated}
          isUploadingPhoto={isUploadingPhoto}
          onProfilePicturePress={handleProfilePicturePress}
          onLogout={handleLogout}
        />

        <View className="pt-4 pb-5">
          <ScreenHeader title="Profile" rightActions={headerActions} />
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="items-center py-8">
            <View className="w-28 h-28 rounded-full bg-[#0A9D5C] items-center justify-center mb-4">
              <Ionicons name="leaf" size={48} color="#FFFFFF" />
            </View>
            <Text className="text-xl font-semibold text-gray-800">
              Guest User
            </Text>
          </View>

          {/* History section */}
          <View className="h-28" />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Authenticated view
  const isLoading = favoritesLoading || collectionLoading || foldersLoading;

  // Folder handler for delete (called from CollectionSection)
  const handleFolderLongPress = (folder: Folder) => {
    const handleDeleteFolder = (folder: Folder) => {
      Alert.alert(
        `Delete Folder`,
        `Are you sure you want to delete "${folder.name}"?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Keep Items",
            onPress: async () => {
              try {
                const result = await deleteFolder(folder.id, false);
                if (selectedFolderId === folder.id) setSelectedFolderId(null);
                Alert.alert(
                  "Deleted",
                  `Folder deleted. ${result.items_affected} items kept in collection.`,
                );
              } catch (error: any) {
                Alert.alert(
                  "Error",
                  error.message || "Failed to delete folder",
                );
              }
            },
          },
          {
            text: "Delete Items Too",
            style: "destructive",
            onPress: async () => {
              try {
                const result = await deleteFolder(folder.id, true);
                if (selectedFolderId === folder.id) setSelectedFolderId(null);
                await refreshCollection();
                Alert.alert(
                  "Deleted",
                  `Folder and ${result.items_affected} items deleted.`,
                );
              } catch (error: any) {
                Alert.alert(
                  "Error",
                  error.message || "Failed to delete folder",
                );
              }
            },
          },
        ],
      );
    };

    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Cancel", "Delete Folder"],
          destructiveButtonIndex: 1,
          cancelButtonIndex: 0,
          title: folder.name,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            handleDeleteFolder(folder);
          }
        },
      );
    } else {
      Alert.alert(folder.name, "Choose an action", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => handleDeleteFolder(folder),
        },
      ]);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      <SettingsModal
        visible={showSettings}
        onClose={() => setShowSettings(false)}
        user={user}
        isAuthenticated={isAuthenticated}
        isUploadingPhoto={isUploadingPhoto}
        onProfilePicturePress={handleProfilePicturePress}
        onLogout={handleLogout}
      />

      <View className="pt-4 pb-5">
        <ScreenHeader title="Profile" rightActions={headerActions} />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="items-center py-8">
          <TouchableOpacity
            disabled={isUploadingPhoto}
            className="relative mb-4"
          >
            {isUploadingPhoto ? (
              <View className="w-28 h-28 rounded-full items-center justify-center bg-gray-200">
                <ActivityIndicator size="large" color="#0A9D5C" />
              </View>
            ) : user?.profile_picture ? (
              <Image
                source={{ uri: user.profile_picture }}
                className="w-28 h-28 rounded-full"
              />
            ) : (
              <View className="w-28 h-28 items-center justify-center">
                <FontAwesome name="user-circle" size={96} color="#90A1B9" />
              </View>
            )}
          </TouchableOpacity>
          <Text className="text-xl font-semibold text-gray-800">
            {user?.username}
          </Text>
        </View>

        {/* Tab Switcher */}
        <View className="px-6 mb-4">
          <TabSwitcher
            tabs={[
              {
                value: "collection",
                label: "Collection",
                count: collection.length,
              },
              { value: "favorite", label: "Favorite", count: favorites.length },
            ]}
            activeTab={activeTab}
            onTabChange={(tab) => {
              setActiveTab(tab);
              setIsEditMode(false);
            }}
          />
        </View>

        {/* Content */}
        {activeTab === "collection" ? (
          <CollectionSection
            folders={folders}
            isLoading={isLoading}
            itemWidth={itemWidth}
            createFolder={createFolder}
            updateFolder={updateFolder}
            handleFolderLongPress={handleFolderLongPress}
          />
        ) : (
          <FavoriteSection
            sortedFavorites={sortedFavorites}
            isLoading={isLoading}
            deletingItemId={deletingItemId}
            showSort={showSort}
            setShowSort={setShowSort}
            favoritesSortOption={favoritesSortOption}
            handleItemPress={handleItemPress}
            handleDeleteFavorite={handleDeleteFavorite}
            handleSortSelect={handleSortSelect}
          />
        )}

        {/* Bottom padding for tab bar */}
        <View className="h-28" />
      </ScrollView>
    </SafeAreaView>
  );
}
