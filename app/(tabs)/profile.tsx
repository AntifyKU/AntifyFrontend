import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  StatusBar,
  Dimensions,
  Modal,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  ActionSheetIOS,
  TextInput,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import ListCard from "@/components/ListCard";
import FavoriteListCard from "@/components/FavoriteListCard";
import CollectionGridItem from "@/components/CollectionGridItem";
import SortButton from "@/components/SortButton";
import { FolderChip, AllChip, AddFolderChip } from "@/components/FolderChip";
import { useAuth } from "@/context/AuthContext";
import { useFavorites } from "@/hooks/useFavorites";
import { useCollection } from "@/hooks/useCollection";
import { useFolders } from "@/hooks/useFolders";
import { authService } from "@/services/auth";
import { FOLDER_COLORS, Folder } from "@/services/folders";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "@/components/molecule/ScreenHeader";

const { width } = Dimensions.get("window");
const numColumns = 2;
const gap = 12;
const itemWidth = (width - 40 - gap) / numColumns;

type TabType = "collection" | "favorite";
type SortOption = "newest" | "oldest" | "name-asc" | "name-desc";

// Settings menu items
const settingsMenuItems = [
  {
    id: "1",
    title: "Account",
    icon: "person-outline" as const,
    route: "/settings/account" as const,
  },
  {
    id: "2",
    title: "App Preferences",
    icon: "globe-outline" as const,
    route: "/settings/preferences" as const,
  },
  {
    id: "3",
    title: "Privacy & Security",
    icon: "shield-outline" as const,
    route: null,
  },
  {
    id: "4",
    title: "Support & Info",
    icon: "help-circle-outline" as const,
    route: "/settings/support" as const,
  },
];

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
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null); // null = "All"
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showEditFolder, setShowEditFolder] = useState(false);
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
  const [showAddToFolder, setShowAddToFolder] = useState(false);
  const [addToFolderItemId, setAddToFolderItemId] = useState<string | null>(
    null,
  );
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderColor, setNewFolderColor] = useState(FOLDER_COLORS[0].hex);
  const [isSavingFolder, setIsSavingFolder] = useState(false);

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

    // First filter by folder
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

    // Then sort (with defensive checks for undefined species_name)
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

  // Get current sort option based on active tab
  const currentSortOption =
    activeTab === "collection" ? collectionSortOption : favoritesSortOption;
  const setCurrentSortOption =
    activeTab === "collection"
      ? setCollectionSortOption
      : setFavoritesSortOption;

  // Get sort label
  const getSortLabel = () => {
    switch (currentSortOption) {
      case "newest":
        return "Newest";
      case "oldest":
        return "Oldest";
      case "name-asc":
        return "A-Z";
      case "name-desc":
        return "Z-A";
      default:
        return "Sort";
    }
  };

  // Handle sort selection
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

  // Handle profile picture upload
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
          if (buttonIndex === 1) {
            await handleTakePhoto();
          } else if (buttonIndex === 2) {
            await handleChooseFromLibrary();
          } else if (buttonIndex === 3 && user?.profile_picture) {
            await handleRemovePhoto();
          }
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

  const handleItemPress = (id: string) => {
    if (isEditMode) return; // Don't navigate in edit mode
    router.push({
      pathname: "/detail/[id]",
      params: { id },
    });
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

  // ============== FOLDER HANDLERS ==============

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      Alert.alert("Error", "Please enter a folder name");
      return;
    }

    setIsSavingFolder(true);
    try {
      await createFolder(newFolderName.trim(), newFolderColor, "folder");
      setShowCreateFolder(false);
      setNewFolderName("");
      setNewFolderColor(FOLDER_COLORS[0].hex);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to create folder");
    } finally {
      setIsSavingFolder(false);
    }
  };

  const handleUpdateFolder = async () => {
    if (!editingFolder) return;
    if (!newFolderName.trim()) {
      Alert.alert("Error", "Please enter a folder name");
      return;
    }

    setIsSavingFolder(true);
    try {
      await updateFolder(editingFolder.id, {
        name: newFolderName.trim(),
        color: newFolderColor,
      });
      setShowEditFolder(false);
      setEditingFolder(null);
      setNewFolderName("");
      setNewFolderColor(FOLDER_COLORS[0].hex);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update folder");
    } finally {
      setIsSavingFolder(false);
    }
  };

  const handleDeleteFolder = (folder: Folder) => {
    Alert.alert(
      "Delete Folder",
      `Are you sure you want to delete "${folder.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Keep Items",
          onPress: async () => {
            try {
              const result = await deleteFolder(folder.id, false);
              if (selectedFolderId === folder.id) {
                setSelectedFolderId(null);
              }
              Alert.alert(
                "Deleted",
                `Folder deleted. ${result.items_affected} items kept in collection.`,
              );
            } catch (error: any) {
              Alert.alert("Error", error.message || "Failed to delete folder");
            }
          },
        },
        {
          text: "Delete Items Too",
          style: "destructive",
          onPress: async () => {
            try {
              const result = await deleteFolder(folder.id, true);
              if (selectedFolderId === folder.id) {
                setSelectedFolderId(null);
              }
              await refreshCollection();
              Alert.alert(
                "Deleted",
                `Folder and ${result.items_affected} items deleted.`,
              );
            } catch (error: any) {
              Alert.alert("Error", error.message || "Failed to delete folder");
            }
          },
        },
      ],
    );
  };

  const handleFolderLongPress = (folder: Folder) => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Cancel", "Edit Folder", "Delete Folder"],
          destructiveButtonIndex: 2,
          cancelButtonIndex: 0,
          title: folder.name,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            setEditingFolder(folder);
            setNewFolderName(folder.name);
            setNewFolderColor(folder.color);
            setShowEditFolder(true);
          } else if (buttonIndex === 2) {
            handleDeleteFolder(folder);
          }
        },
      );
    } else {
      Alert.alert(folder.name, "Choose an action", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Edit",
          onPress: () => {
            setEditingFolder(folder);
            setNewFolderName(folder.name);
            setNewFolderColor(folder.color);
            setShowEditFolder(true);
          },
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => handleDeleteFolder(folder),
        },
      ]);
    }
  };

  const handleOpenAddToFolder = (speciesId: string) => {
    setAddToFolderItemId(speciesId);
    setShowAddToFolder(true);
  };

  const handleToggleItemFolder = async (
    speciesId: string,
    folderId: string,
    isCurrentlyIn: boolean,
  ) => {
    const item = collection.find((c) => c.species_id === speciesId);
    if (!item) return;

    const currentFolderIds = item.folder_ids || [];
    let newFolderIds: string[];

    if (isCurrentlyIn) {
      newFolderIds = currentFolderIds.filter((id) => id !== folderId);
    } else {
      newFolderIds = [...currentFolderIds, folderId];
    }

    try {
      await setItemFolders(speciesId, newFolderIds);
      await refreshFolders(); // Refresh folder counts
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update folders");
    }
  };

  // Settings Modal
  const SettingsModal = () => (
    <Modal
      visible={showSettings}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView className="flex-1 bg-white">
        <StatusBar barStyle="dark-content" />

        {/* Header */}
        <View className="flex-row items-center justify-center px-5 py-4">
          <TouchableOpacity
            className="absolute left-5"
            onPress={() => setShowSettings(false)}
          >
            <Ionicons name="chevron-back" size={28} color="#22A45D" />
          </TouchableOpacity>
          <Text className="text-xl font-semibold text-gray-800">Settings</Text>
        </View>

        {/* Profile Section */}
        <View className="items-center py-8">
          <TouchableOpacity
            className="relative"
            onPress={handleProfilePicturePress}
            disabled={isUploadingPhoto}
          >
            {user?.profile_picture ? (
              <Image
                source={{ uri: user.profile_picture }}
                className="w-28 h-28 rounded-full"
                style={{ backgroundColor: "#c5e063" }}
              />
            ) : (
              <View className="w-28 h-28 rounded-full bg-[#c5e063] items-center justify-center">
                <View className="w-20 h-20 rounded-full bg-[#328e6e] items-center justify-center">
                  <Ionicons name="person" size={40} color="#c5e063" />
                </View>
              </View>
            )}
            {/* Edit button overlay */}
            <View className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#22A45D] items-center justify-center">
              {isUploadingPhoto ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Ionicons name="camera" size={16} color="#FFFFFF" />
              )}
            </View>
          </TouchableOpacity>
          <Text className="mt-4 text-xl font-bold text-gray-800">
            {user?.username || "Ant Enthusiast"}
          </Text>
          <Text className="mt-1 text-gray-500">
            {user?.email || "user@antify.com"}
          </Text>
        </View>

        {/* Divider */}
        <View className="h-px mx-5 bg-gray-200" />

        {/* Menu Items */}
        <View className="px-5 mt-4">
          {settingsMenuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              className="flex-row items-center py-4 border-b border-gray-100"
              onPress={() => {
                if (item.route) {
                  setShowSettings(false);
                  router.push(item.route);
                } else {
                  Alert.alert(
                    "Coming Soon",
                    `${item.title} will be available in a future update.`,
                  );
                }
              }}
            >
              <Ionicons name={item.icon} size={24} color="#6B7280" />
              <Text className="flex-1 ml-4 text-base text-gray-800">
                {item.title}
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        {isAuthenticated && (
          <View className="px-5 mt-8">
            <TouchableOpacity
              className="flex-row items-center justify-center py-4 bg-red-50 rounded-xl"
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={24} color="#EF4444" />
              <Text className="ml-2 text-base font-medium text-red-500">
                Log Out
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );

  // Sort Modal
  const SortModal = () => (
    <Modal
      visible={showSort}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowSort(false)}
    >
      <Pressable
        className="flex-1 bg-black/30"
        onPress={() => setShowSort(false)}
      >
        <View className="flex-1 justify-end">
          <View className="bg-white rounded-t-3xl">
            <View className="w-12 h-1 bg-gray-300 rounded-full mx-auto mt-3" />
            <Text className="text-xl font-bold text-center py-4 text-gray-800">
              Sort By
            </Text>

            <TouchableOpacity
              className={`flex-row items-center justify-between px-6 py-4 border-b border-gray-100 ${currentSortOption === "newest" ? "bg-green-50" : ""}`}
              onPress={() => handleSortSelect("newest")}
            >
              <Text
                className={`text-base ${currentSortOption === "newest" ? "text-[#22A45D] font-semibold" : "text-gray-700"}`}
              >
                Newest First
              </Text>
              {currentSortOption === "newest" && (
                <Ionicons name="checkmark" size={24} color="#22A45D" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              className={`flex-row items-center justify-between px-6 py-4 border-b border-gray-100 ${currentSortOption === "oldest" ? "bg-green-50" : ""}`}
              onPress={() => handleSortSelect("oldest")}
            >
              <Text
                className={`text-base ${currentSortOption === "oldest" ? "text-[#22A45D] font-semibold" : "text-gray-700"}`}
              >
                Oldest First
              </Text>
              {currentSortOption === "oldest" && (
                <Ionicons name="checkmark" size={24} color="#22A45D" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              className={`flex-row items-center justify-between px-6 py-4 border-b border-gray-100 ${currentSortOption === "name-asc" ? "bg-green-50" : ""}`}
              onPress={() => handleSortSelect("name-asc")}
            >
              <Text
                className={`text-base ${currentSortOption === "name-asc" ? "text-[#22A45D] font-semibold" : "text-gray-700"}`}
              >
                Name (A-Z)
              </Text>
              {currentSortOption === "name-asc" && (
                <Ionicons name="checkmark" size={24} color="#22A45D" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              className={`flex-row items-center justify-between px-6 py-4 ${currentSortOption === "name-desc" ? "bg-green-50" : ""}`}
              onPress={() => handleSortSelect("name-desc")}
            >
              <Text
                className={`text-base ${currentSortOption === "name-desc" ? "text-[#22A45D] font-semibold" : "text-gray-700"}`}
              >
                Name (Z-A)
              </Text>
              {currentSortOption === "name-desc" && (
                <Ionicons name="checkmark" size={24} color="#22A45D" />
              )}
            </TouchableOpacity>

            <View className="h-8" />
          </View>
        </View>
      </Pressable>
    </Modal>
  );

  // Create Folder Modal - defined inline in render to avoid re-creation issues
  // Edit Folder Modal - defined inline in render to avoid re-creation issues
  // Add to Folder Modal - defined inline in render to avoid re-creation issues

  // Guest view (not logged in)
  if (!isAuthenticated) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <StatusBar barStyle="dark-content" />

        {/* Header */}
        <View className="pt-4 pb-5">
          <ScreenHeader
            title="Profile"
            rightIcon="settings-outline"
            onRightPress={() => setShowSettings(true)}
          />
        </View>
        {/* <View className="flex-row items-center justify-between px-5 py-4">
          <View className="w-10" />
          <Text className="text-xl font-semibold text-gray-800">Profile</Text>
          <TouchableOpacity onPress={() => setShowSettings(true)}>
            <Ionicons name="settings-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View> */}

        <SettingsModal />

        <View className="flex-1 items-center justify-center px-8">
          <View className="w-24 h-24 rounded-full bg-[#c5e063] items-center justify-center mb-6">
            <View className="w-16 h-16 rounded-full bg-[#328e6e] items-center justify-center">
              <Ionicons name="person" size={32} color="#c5e063" />
            </View>
          </View>
          <Text className="text-2xl font-bold text-gray-800 mb-2">
            Welcome to Antify
          </Text>
          <Text className="text-gray-500 text-center mb-8">
            Sign in to save your favorite species and build your collection
          </Text>
          <TouchableOpacity
            className="bg-[#0A9D5C] rounded-full px-8 py-4 mb-4 w-full"
            onPress={() => router.push("/(auth)/login")}
          >
            <Text className="text-white font-semibold text-center text-lg">
              Sign In
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="border-2 border-[#0A9D5C] rounded-full px-8 py-4 w-full"
            onPress={() => router.push("/(auth)/signup")}
          >
            <Text className="text-[#0A9D5C] font-semibold text-center text-lg">
              Create Account
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const isLoading = favoritesLoading || collectionLoading || foldersLoading;

  // Get item for AddToFolder modal
  const addToFolderItem = collection.find(
    (c) => c.species_id === addToFolderItemId,
  );
  const addToFolderItemFolderIds = addToFolderItem?.folder_ids || [];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      {/* Settings Modal */}
      <SettingsModal />

      {/* Sort Modal */}
      <SortModal />

      {/* Create Folder Modal */}
      <Modal
        visible={showCreateFolder}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCreateFolder(false)}
      >
        <View className="flex-1 bg-black/30 justify-center items-center">
          <View className="bg-white rounded-2xl mx-6 w-[90%] max-w-[340px]">
            <View className="p-6">
              <Text className="text-xl font-bold text-center text-gray-800 mb-4">
                New Folder
              </Text>

              {/* Folder Name Input */}
              <Text className="text-sm font-medium text-gray-600 mb-2">
                Folder Name
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-base text-gray-800 mb-4"
                placeholder="Enter folder name"
                placeholderTextColor="#9CA3AF"
                value={newFolderName}
                onChangeText={setNewFolderName}
                maxLength={50}
              />

              {/* Color Picker */}
              <Text className="text-sm font-medium text-gray-600 mb-2">
                Color
              </Text>
              <View className="flex-row flex-wrap mb-6">
                {FOLDER_COLORS.map((color) => (
                  <TouchableOpacity
                    key={color.hex}
                    onPress={() => setNewFolderColor(color.hex)}
                    className="mr-2 mb-2"
                  >
                    <View
                      className={`w-10 h-10 rounded-full items-center justify-center ${
                        newFolderColor === color.hex
                          ? "border-2 border-gray-800"
                          : ""
                      }`}
                      style={{ backgroundColor: color.hex }}
                    >
                      {newFolderColor === color.hex && (
                        <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Buttons */}
              <View className="flex-row">
                <TouchableOpacity
                  className="flex-1 py-3 rounded-lg border border-gray-300 mr-2"
                  onPress={() => {
                    setShowCreateFolder(false);
                    setNewFolderName("");
                    setNewFolderColor(FOLDER_COLORS[0].hex);
                  }}
                >
                  <Text className="text-center text-gray-600 font-medium">
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 py-3 rounded-lg bg-[#22A45D] ml-2"
                  onPress={handleCreateFolder}
                  disabled={isSavingFolder || !newFolderName.trim()}
                  style={{
                    opacity: isSavingFolder || !newFolderName.trim() ? 0.5 : 1,
                  }}
                >
                  {isSavingFolder ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text className="text-center text-white font-medium">
                      Create
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Folder Modal */}
      <Modal
        visible={showEditFolder}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowEditFolder(false)}
      >
        <View className="flex-1 bg-black/30 justify-center items-center">
          <View className="bg-white rounded-2xl mx-6 w-[90%] max-w-[340px]">
            <View className="p-6">
              <Text className="text-xl font-bold text-center text-gray-800 mb-4">
                Edit Folder
              </Text>

              {/* Folder Name Input */}
              <Text className="text-sm font-medium text-gray-600 mb-2">
                Folder Name
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-base text-gray-800 mb-4"
                placeholder="Enter folder name"
                placeholderTextColor="#9CA3AF"
                value={newFolderName}
                onChangeText={setNewFolderName}
                maxLength={50}
              />

              {/* Color Picker */}
              <Text className="text-sm font-medium text-gray-600 mb-2">
                Color
              </Text>
              <View className="flex-row flex-wrap mb-6">
                {FOLDER_COLORS.map((color) => (
                  <TouchableOpacity
                    key={color.hex}
                    onPress={() => setNewFolderColor(color.hex)}
                    className="mr-2 mb-2"
                  >
                    <View
                      className={`w-10 h-10 rounded-full items-center justify-center ${
                        newFolderColor === color.hex
                          ? "border-2 border-gray-800"
                          : ""
                      }`}
                      style={{ backgroundColor: color.hex }}
                    >
                      {newFolderColor === color.hex && (
                        <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Buttons */}
              <View className="flex-row">
                <TouchableOpacity
                  className="flex-1 py-3 rounded-lg border border-gray-300 mr-2"
                  onPress={() => {
                    setShowEditFolder(false);
                    setEditingFolder(null);
                    setNewFolderName("");
                    setNewFolderColor(FOLDER_COLORS[0].hex);
                  }}
                >
                  <Text className="text-center text-gray-600 font-medium">
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 py-3 rounded-lg bg-[#22A45D] ml-2"
                  onPress={handleUpdateFolder}
                  disabled={isSavingFolder || !newFolderName.trim()}
                  style={{
                    opacity: isSavingFolder || !newFolderName.trim() ? 0.5 : 1,
                  }}
                >
                  {isSavingFolder ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text className="text-center text-white font-medium">
                      Save
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add to Folder Modal */}
      <Modal
        visible={showAddToFolder}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAddToFolder(false)}
      >
        <View className="flex-1 bg-black/30 justify-center items-center">
          <View className="bg-white rounded-2xl mx-6 w-[90%] max-w-[340px]">
            <View className="p-6">
              <Text className="text-xl font-bold text-center text-gray-800 mb-2">
                Add to Folder
              </Text>
              <Text className="text-sm text-gray-500 text-center mb-4">
                {addToFolderItem?.species_name || "Select folders"}
              </Text>

              {folders.length === 0 ? (
                <View className="items-center py-6">
                  <Ionicons name="folder-outline" size={48} color="#D1D5DB" />
                  <Text className="text-gray-500 mt-2 text-center">
                    No folders yet
                  </Text>
                  <TouchableOpacity
                    className="mt-4 bg-[#22A45D] rounded-lg px-4 py-2"
                    onPress={() => {
                      setShowAddToFolder(false);
                      setShowCreateFolder(true);
                    }}
                  >
                    <Text className="text-white font-medium">
                      Create Folder
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View className="mb-4">
                  {folders.map((folder) => {
                    const isInFolder = addToFolderItemFolderIds.includes(
                      folder.id,
                    );
                    return (
                      <TouchableOpacity
                        key={folder.id}
                        className={`flex-row items-center p-3 rounded-lg mb-2 ${
                          isInFolder ? "bg-green-50" : "bg-gray-50"
                        }`}
                        onPress={() => {
                          if (addToFolderItemId) {
                            handleToggleItemFolder(
                              addToFolderItemId,
                              folder.id,
                              isInFolder,
                            );
                          }
                        }}
                      >
                        <View
                          className="w-4 h-4 rounded-full mr-3"
                          style={{ backgroundColor: folder.color }}
                        />
                        <Text className="flex-1 text-base text-gray-800">
                          {folder.name}
                        </Text>
                        {isInFolder && (
                          <Ionicons
                            name="checkmark-circle"
                            size={24}
                            color="#22A45D"
                          />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}

              <TouchableOpacity
                className="py-3 rounded-lg border border-gray-300"
                onPress={() => {
                  setShowAddToFolder(false);
                  setAddToFolderItemId(null);
                }}
              >
                <Text className="text-center text-gray-600 font-medium">
                  Done
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Header */}
      <View className="pt-4 pb-5">
        <ScreenHeader
          title="Profile"
          rightIcon="settings-outline"
          onRightPress={() => setShowSettings(true)}
        />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Profile Avatar */}
        <View className="items-center py-6">
          <TouchableOpacity
            onPress={handleProfilePicturePress}
            disabled={isUploadingPhoto}
            className="relative mb-4"
          >
            {user?.profile_picture ? (
              <Image
                source={{ uri: user.profile_picture }}
                className="w-28 h-28 rounded-full"
                style={{ backgroundColor: "#c5e063" }}
              />
            ) : (
              <View className="w-28 h-28 rounded-full bg-[#c5e063] items-center justify-center">
                <View className="w-20 h-20 rounded-full bg-[#328e6e] items-center justify-center">
                  <Ionicons name="person" size={40} color="#c5e063" />
                </View>
              </View>
            )}
            {/* Edit button overlay */}
            <View className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#22A45D] items-center justify-center">
              {isUploadingPhoto ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Ionicons name="camera" size={16} color="#FFFFFF" />
              )}
            </View>
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-800">
            {user?.username || "Ant Enthusiast"}
          </Text>
          <Text className="mt-1 text-gray-500">
            {user?.email || "user@antify.com"}
          </Text>
        </View>

        {/* Tab Switcher */}
        <View className="mx-5 mb-4">
          <View className="flex-row p-1 bg-gray-100 rounded-full">
            <Pressable
              className={`flex-1 py-3 rounded-full ${activeTab === "collection" ? "bg-[#22A45D]" : ""}`}
              onPress={() => {
                setActiveTab("collection");
                setIsEditMode(false);
              }}
              style={({ pressed }) => pressed && styles.pressed}
            >
              <Text
                className={`text-center font-medium ${activeTab === "collection" ? "text-white" : "text-gray-500"}`}
              >
                Collection ({collection.length})
              </Text>
            </Pressable>
            <Pressable
              className={`flex-1 py-3 rounded-full ${activeTab === "favorite" ? "bg-[#22A45D]" : ""}`}
              onPress={() => {
                setActiveTab("favorite");
                setIsEditMode(false);
              }}
              style={({ pressed }) => pressed && styles.pressed}
            >
              <Text
                className={`text-center font-medium ${activeTab === "favorite" ? "text-white" : "text-gray-500"}`}
              >
                Favorite ({favorites.length})
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Sort and Edit Buttons */}
        <View className="flex-row items-center justify-between px-5 mb-4">
          {activeTab === "collection" ? (
            <>
              <SortButton
                onPress={() => setShowSort(true)}
                label={getSortLabel()}
                isOpen={showSort}
              />
              {/* Edit/Done/Cancel buttons */}
              <View className="flex-row items-center">
                {isEditMode && (
                  <Pressable
                    onPress={() => setIsEditMode(false)}
                    style={({ pressed }) => [
                      {
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        borderRadius: 8,
                        marginRight: 8,
                        opacity: pressed ? 0.7 : 1,
                      },
                    ]}
                  >
                    <Text className="font-medium text-gray-500">Cancel</Text>
                  </Pressable>
                )}
                <Pressable
                  onPress={() => {
                    console.log(
                      "[Profile] Edit/Done button pressed, current isEditMode:",
                      isEditMode,
                    );
                    setIsEditMode(!isEditMode);
                  }}
                  style={({ pressed }) => [
                    {
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: "#22A45D",
                      backgroundColor: isEditMode ? "#22A45D" : "transparent",
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                >
                  <Text
                    className={`font-medium ${isEditMode ? "text-white" : "text-[#22A45D]"}`}
                  >
                    {isEditMode ? "Done" : "Edit"}
                  </Text>
                </Pressable>
              </View>
            </>
          ) : (
            <>
              {/* Empty space for Favorite */}
              <View />
              <SortButton
                onPress={() => setShowSort(true)}
                label={getSortLabel()}
                isOpen={showSort}
              />
            </>
          )}
        </View>

        {/* Folder Row - Only show for Collection tab */}
        {activeTab === "collection" && (
          <View className="mb-4">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20 }}
            >
              {/* All chip */}
              <AllChip
                isSelected={selectedFolderId === null}
                onPress={() => setSelectedFolderId(null)}
                itemCount={collection.length}
              />

              {/* Folder chips */}
              {folders.map((folder) => (
                <FolderChip
                  key={folder.id}
                  folder={folder}
                  isSelected={selectedFolderId === folder.id}
                  onPress={() => setSelectedFolderId(folder.id)}
                  onLongPress={() => handleFolderLongPress(folder)}
                />
              ))}

              {/* Add folder button */}
              <AddFolderChip onPress={() => setShowCreateFolder(true)} />
            </ScrollView>
          </View>
        )}

        {/* Loading State */}
        {isLoading && (
          <View className="items-center py-8">
            <ActivityIndicator size="large" color="#0A9D5C" />
            <Text className="mt-2 text-gray-500">Loading...</Text>
          </View>
        )}

        {/* Content based on active tab */}
        {!isLoading && (
          <View className="px-5">
            {activeTab === "collection" ? (
              // Collection Grid
              sortedCollection.length > 0 ? (
                <View className="flex-row flex-wrap">
                  {sortedCollection.map((item, index) => (
                    <View key={item.id} style={{ position: "relative" }}>
                      <CollectionGridItem
                        id={item.species_id}
                        title={item.species_name}
                        subtitle={item.species_scientific_name}
                        image={item.species_image}
                        itemWidth={itemWidth}
                        isLeftColumn={index % 2 === 0}
                        onPress={() => handleItemPress(item.species_id)}
                      />
                      {/* Edit mode overlays */}
                      {isEditMode && (
                        <>
                          {/* Folder button */}
                          <TouchableOpacity
                            className="absolute top-2 left-2 w-8 h-8 bg-blue-500 rounded-full items-center justify-center"
                            style={{
                              zIndex: 10,
                              left: index % 2 === 0 ? 2 : 8,
                            }}
                            onPress={() =>
                              handleOpenAddToFolder(item.species_id)
                            }
                          >
                            <Ionicons
                              name="folder-outline"
                              size={16}
                              color="#fff"
                            />
                          </TouchableOpacity>
                          {/* Delete button */}
                          <TouchableOpacity
                            className="absolute top-2 right-2 w-8 h-8 bg-red-500 rounded-full items-center justify-center"
                            style={{
                              zIndex: 10,
                              right: index % 2 === 0 ? 8 : 2,
                            }}
                            onPress={() =>
                              handleDeleteCollection(item.species_id)
                            }
                            disabled={deletingItemId === item.species_id}
                          >
                            {deletingItemId === item.species_id ? (
                              <ActivityIndicator size="small" color="#fff" />
                            ) : (
                              <Ionicons
                                name="trash-outline"
                                size={16}
                                color="#fff"
                              />
                            )}
                          </TouchableOpacity>
                        </>
                      )}
                      {/* Show folder indicator when not in edit mode - top right of image */}
                      {!isEditMode &&
                        item.folder_ids &&
                        item.folder_ids.length > 0 && (
                          <View
                            className="absolute top-2 right-2 flex-row"
                            style={{ right: index % 2 === 0 ? 8 : 2 }}
                          >
                            {item.folder_ids.slice(0, 3).map((folderId) => {
                              const folder = folders.find(
                                (f) => f.id === folderId,
                              );
                              if (!folder) return null;
                              return (
                                <View
                                  key={folderId}
                                  className="w-3 h-3 rounded-full ml-1"
                                  style={{ backgroundColor: folder.color }}
                                />
                              );
                            })}
                            {item.folder_ids.length > 3 && (
                              <Text className="text-xs text-white ml-1">
                                +{item.folder_ids.length - 3}
                              </Text>
                            )}
                          </View>
                        )}
                    </View>
                  ))}
                </View>
              ) : (
                <View className="items-center py-12">
                  <Ionicons name="albums-outline" size={64} color="#D1D5DB" />
                  <Text className="mt-4 text-gray-500 text-center">
                    Your collection is empty.{"\n"}Start adding species you've
                    found!
                  </Text>
                  <TouchableOpacity
                    className="mt-6 bg-[#0A9D5C] rounded-full px-6 py-3"
                    onPress={() => router.push("/(tabs)/explore")}
                  >
                    <Text className="text-white font-semibold">
                      Explore Species
                    </Text>
                  </TouchableOpacity>
                </View>
              )
            ) : // Favorite List with heart button to remove
            sortedFavorites.length > 0 ? (
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
              <View className="items-center py-12">
                <Ionicons name="heart-outline" size={64} color="#D1D5DB" />
                <Text className="mt-4 text-gray-500 text-center">
                  No favorites yet.{"\n"}Tap the heart icon on any species to
                  save it!
                </Text>
                <TouchableOpacity
                  className="mt-6 bg-[#0A9D5C] rounded-full px-6 py-3"
                  onPress={() => router.push("/(tabs)/explore")}
                >
                  <Text className="text-white font-semibold">
                    Explore Species
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* Bottom padding for tab bar */}
        <View className="h-28" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.7,
  },
});
