import React, { useState, useCallback } from "react";
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
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "@/context/AuthContext";
import { useFavoriteNews } from "@/hooks/useFavoriteNews";
import { useCollection } from "@/hooks/useCollection";
import { useFolders } from "@/hooks/useFolders";
import { authService } from "@/services/auth";
import { ScreenHeader, RightAction } from "@/components/molecule/ScreenHeader";
import SettingsModal from "@/components/organism/modal/SettingModal";
import { TabSwitcher } from "@/components/atom/TabSwitcher";
import CollectionSection from "@/components/organism/CollectionSection";
import FavoriteSection from "@/components/organism/FavoriteSection";
import HistorySection from "@/components/organism/HistorySection";
import NotificationModal from "@/components/organism/modal/NotificationModal";

const { width } = Dimensions.get("window");
const numColumns = 2;
const gap = 12;
const itemWidth = (width - 40 - gap) / numColumns;

type TabType = "collection" | "favorite" | "history";

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState<TabType>("collection");
  const [showSettings, setShowSettings] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [showNoti, setShowNoti] = useState(false);
  const { user, token, isAuthenticated, logout, refreshUser } = useAuth();

  const {
    favoriteNews,
    refresh: refreshFavorites,
    isLoading: fLoading,
  } = useFavoriteNews();
  const {
    collection,
    refresh: refreshCollection,
    isLoading: cLoading,
  } = useCollection();
  const {
    folders,
    refresh: refreshFolders,
    isLoading: folLoading,
  } = useFolders();

  const isLoading = fLoading || cLoading || folLoading;

  useFocusEffect(
    useCallback(() => {
      if (isAuthenticated) {
        refreshFavorites();
        refreshCollection();
        refreshFolders();
      }
    }, [isAuthenticated]),
  );

  const headerActions: RightAction[] = [
    { icon: "notifications-outline", onPress: () => setShowNoti(true) },
    { icon: "settings-outline", onPress: () => setShowSettings(true) },
  ];

  const handleProfilePicturePress = () => {
    if (!isAuthenticated) return;
    const options = ["Cancel", "Take Photo", "Choose from Library"];
    if (user?.profile_picture) options.push("Remove Photo");

    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          destructiveButtonIndex: user?.profile_picture ? 3 : undefined,
          cancelButtonIndex: 0,
        },
        async (index) => {
          if (index === 1) await handleTakePhoto();
          else if (index === 2) await handleChooseFromLibrary();
          else if (index === 3 && user?.profile_picture)
            await handleRemovePhoto();
        },
      );
    } else {
      Alert.alert("Profile Picture", "Choose an option", [
        { text: "Cancel", style: "cancel" },
        { text: "Take Photo", onPress: handleTakePhoto },
        { text: "Choose from Library", onPress: handleChooseFromLibrary },
        ...(user?.profile_picture
          ? [
              {
                text: "Remove",
                style: "destructive" as "destructive",
                onPress: handleRemovePhoto,
              },
            ]
          : []),
      ]);
    }
  };

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") return;
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      uploadProfilePicture(result.assets[0].uri, result.assets[0].mimeType);
    }
  };

  const handleChooseFromLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      uploadProfilePicture(result.assets[0].uri, result.assets[0].mimeType);
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
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (!token) return;
    setIsUploadingPhoto(true);
    try {
      await authService.deleteProfilePicture(token);
      await refreshUser();
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert("Log Out", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          await logout();
          Alert.alert("Success", "You have logged out successfully!");
        },
      },
    ]);
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="pt-4 pb-5">
          <ScreenHeader title="Profile" rightActions={headerActions} />
        </View>
        <ScrollView>
          <View className="items-center py-8">
            <View className="w-28 h-28 rounded-full bg-[#0A9D5C] items-center justify-center mb-4">
              <Ionicons name="leaf" size={48} color="white" />
            </View>
            <Text className="text-xl font-semibold">Guest User</Text>
          </View>
          <HistorySection />
        </ScrollView>
        <SettingsModal
          visible={showSettings}
          onClose={() => setShowSettings(false)}
          user={user}
          isAuthenticated={false}
          isUploadingPhoto={false}
          onProfilePicturePress={() => {}}
          onLogout={handleLogout}
        />
        <NotificationModal
          visible={showNoti}
          role={user?.role === "admin" ? "admin" : "user"}
          onClose={() => setShowNoti(false)}
        />
      </SafeAreaView>
    );
  }

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
      <NotificationModal
        visible={showNoti}
        role={user?.role === "admin" ? "admin" : "user"}
        onClose={() => setShowNoti(false)}
      />
      <View className="pt-4 pb-5">
        <ScreenHeader title="Profile" rightActions={headerActions} />
      </View>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="items-center py-8">
          <TouchableOpacity disabled={isUploadingPhoto} className="mb-4">
            {isUploadingPhoto ? (
              <ActivityIndicator
                size="large"
                color="#0A9D5C"
                className="w-28 h-28"
              />
            ) : user?.profile_picture ? (
              <Image
                source={{ uri: user.profile_picture }}
                className="w-28 h-28 rounded-full"
              />
            ) : (
              <FontAwesome name="user-circle" size={96} color="#90A1B9" />
            )}
          </TouchableOpacity>
          <Text className="text-xl font-semibold text-gray-800">
            {user?.username}
          </Text>
        </View>
        <View className="px-6 mb-4">
          <TabSwitcher
            tabs={[
              { value: "history", label: "History" },
              {
                value: "collection",
                label: "Collection",
                count: collection.length,
              },
              {
                value: "favorite",
                label: "Favorite",
                count: favoriteNews.length,
              },
            ]}
            activeTab={activeTab}
            onTabChange={(tab) => setActiveTab(tab as TabType)}
          />
        </View>
        <View className="flex-1">
          {activeTab === "collection" && <CollectionSection />}
          {activeTab === "favorite" && <FavoriteSection />}
          {activeTab === "history" && <HistorySection />}
        </View>
        <View className="h-24" />
      </ScrollView>
    </SafeAreaView>
  );
}
