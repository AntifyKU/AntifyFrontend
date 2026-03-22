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
} from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import { useCollection } from "@/hooks/useCollection";
import { useFolders } from "@/hooks/useFolders";
import { authService } from "@/services/auth";
import { ScreenHeader, RightAction } from "@/components/molecule/ScreenHeader";
import SettingsModal from "@/components/organism/modal/SettingModal";
import { TabSwitcher } from "@/components/atom/TabSwitcher";
import CollectionSection from "@/components/organism/CollectionSection";
import HistorySection from "@/components/organism/HistorySection";

type TabType = "collection" | "history";

const ProfilePictureContent = ({ user }: { user: any }) => {
  return user?.profile_picture ? (
    <Image
      source={{ uri: user.profile_picture }}
      className="w-28 h-28 rounded-full"
    />
  ) : (
    <FontAwesome name="user-circle" size={96} color="#90A1B9" />
  );
};

export default function ProfileScreen() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>("collection");
  const [showSettings, setShowSettings] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const { user, token, isAuthenticated, logout, refreshUser } = useAuth();

  const { collection, refresh: refreshCollection } = useCollection();
  const { refresh: refreshFolders } = useFolders();

  useFocusEffect(
    useCallback(() => {
      if (isAuthenticated) {
        refreshCollection();
        refreshFolders();
      }
    }, [isAuthenticated, refreshCollection, refreshFolders]),
  );

  const headerActions: RightAction[] = [
    { icon: "settings-outline", onPress: () => setShowSettings(true) },
  ];

  const handleTakePhoto = () => {
    const run = async () => {
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
    run();
  };

  const handleChooseFromLibrary = () => {
    const run = async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
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
    run();
  };

  const handleRemovePhoto = () => {
    const run = async () => {
      if (!token) return;
      setIsUploadingPhoto(true);
      try {
        await authService.deleteProfilePicture(token);
        await refreshUser();
      } finally {
        setIsUploadingPhoto(false);
      }
    };
    run();
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

  const handleProfilePicturePress = () => {
    if (!isAuthenticated) return;

    const hasPhoto = !!user?.profile_picture;
    const options = [
      t("common.cancel"),
      t("profile.profilePicture.takePhoto"),
      t("profile.profilePicture.chooseFromLibrary"),
      ...(hasPhoto ? [t("profile.profilePicture.remove")] : []),
    ];

    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          destructiveButtonIndex: hasPhoto ? 3 : undefined,
          cancelButtonIndex: 0,
        },
        (index) => {
          if (index === 1) handleTakePhoto();
          else if (index === 2) handleChooseFromLibrary();
          else if (index === 3 && hasPhoto) handleRemovePhoto();
        },
      );
    } else {
      Alert.alert(
        t("profile.profilePicture.sheetTitle"),
        t("profile.profilePicture.sheetMessage"),
        [
          { text: t("common.cancel"), style: "cancel" },
          {
            text: t("profile.profilePicture.takePhoto"),
            onPress: handleTakePhoto,
          },
          {
            text: t("profile.profilePicture.chooseFromLibrary"),
            onPress: handleChooseFromLibrary,
          },
          ...(hasPhoto
            ? [
                {
                  text: t("profile.profilePicture.remove"),
                  style: "destructive" as const,
                  onPress: handleRemovePhoto,
                },
              ]
            : []),
        ],
      );
    }
  };

  const handleLogout = () => {
    Alert.alert(t("profile.logout.title"), t("profile.logout.message"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("profile.logout.confirm"),
        style: "destructive",
        onPress: () => {
          const run = async () => {
            await logout();
            Alert.alert(
              t("common.success"),
              t("profile.logout.successMessage"),
            );
          };
          run();
        },
      },
    ]);
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <ScreenHeader title={t("profile.title")} rightActions={headerActions} />
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
      <View className="pt-4 pb-5">
        <ScreenHeader title={t("profile.title")} rightActions={headerActions} />
      </View>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="items-center py-8">
          <TouchableOpacity
            disabled={isUploadingPhoto}
            className="mb-4"
            onPress={handleProfilePicturePress}
          >
            {isUploadingPhoto ? (
              <ActivityIndicator
                size="large"
                color="#0A9D5C"
                className="w-28 h-28"
              />
            ) : (
              <ProfilePictureContent user={user} />
            )}
          </TouchableOpacity>
          <Text className="text-xl font-semibold text-gray-800">
            {user?.username}
          </Text>
        </View>
        <View className="px-6 mb-4">
          <TabSwitcher
            tabs={[
              { value: "history", label: t("profile.tabs.history") },
              {
                value: "collection",
                label: t("profile.tabs.collection"),
                count: collection.length,
              },
            ]}
            activeTab={activeTab}
            onTabChange={(tab) => setActiveTab(tab as TabType)}
          />
        </View>
        <View className="flex-1">
          {activeTab === "collection" && <CollectionSection />}
          {activeTab === "history" && <HistorySection />}
        </View>
        <View className="h-24" />
      </ScrollView>
    </SafeAreaView>
  );
}
