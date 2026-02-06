import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Modal,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "@/components/molecule/ScreenHeader";
import PrimaryButton from "@/components/atom/button/PrimaryButton";

interface User {
  username?: string;
  email?: string;
  profile_picture?: string | null;
}

export interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  user: User | null | undefined;
  isAuthenticated: boolean;
  isUploadingPhoto: boolean;
  onProfilePicturePress: () => void;
  onLogout: () => void;
}

const SETTINGS_MENU_ITEMS = [
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

export default function SettingsModal({
  visible,
  onClose,
  user,
  isAuthenticated,
  isUploadingPhoto,
  onProfilePicturePress,
  onLogout,
}: SettingsModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView className="flex-1 bg-white">
        <StatusBar barStyle="dark-content" />
        <View className="w-12 h-1 bg-gray-300 rounded-full mx-auto mt-3" />
        {/* Header */}
        <View className="py-6">
          <ScreenHeader
            title="Settings"
            leftIcon="chevron-back"
            onLeftPress={onClose}
          />
        </View>

        {/* Profile Section */}
        <View className="items-center py-8">
          <TouchableOpacity
            className="relative"
            onPress={onProfilePicturePress}
            disabled={isUploadingPhoto}
          >
            {user?.profile_picture ? (
              <Image
                source={{ uri: user.profile_picture }}
                className="w-28 h-28 rounded-full"
              />
            ) : (
              <View className="w-28 h-28 items-center justify-center">
                <FontAwesome name="user-circle" size={96} color="#90A1B9" />
              </View>
            )}

            {/* Camera-icon overlay */}
            <View className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#22A45D] items-center justify-center">
              {isUploadingPhoto ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Ionicons name="camera" size={16} color="#FFFFFF" />
              )}
            </View>
          </TouchableOpacity>

          <Text className="mt-4 text-xl font-semibold text-gray-800">
            {user?.username || "Guest User"}
          </Text>
        </View>

        {/* Menu Items */}
        <View className="px-6 mt-4">
          {SETTINGS_MENU_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.id}
              className="flex-row items-center py-4 border-b border-gray-100"
              onPress={() => {
                if (item.route) {
                  onClose();
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
          <View className="px-6 mt-8">
            <PrimaryButton
              title="Log Out"
              onPress={onLogout}
              icon="log-out-outline"
              size="large"
              variant="outlined"
              style={{
                backgroundColor: "#FEF2F2",
                borderColor: "#EF4444",
                borderWidth: 0,
                borderRadius: 12,
              }}
              textStyle={{ color: "#EF4444", fontWeight: "600" }}
              iconColor="#EF4444"
            />
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
}
