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
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

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

        {/* Header */}
        <View className="flex-row items-center justify-center px-5 py-4">
          <TouchableOpacity className="absolute left-5" onPress={onClose}>
            <Ionicons name="chevron-back" size={28} color="#22A45D" />
          </TouchableOpacity>
          <Text className="text-xl font-semibold text-gray-800">Settings</Text>
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
                style={{ backgroundColor: "#c5e063" }}
              />
            ) : (
              <View className="w-28 h-28 rounded-full bg-[#c5e063] items-center justify-center">
                <View className="w-20 h-20 rounded-full bg-[#328e6e] items-center justify-center">
                  <Ionicons name="person" size={40} color="#c5e063" />
                </View>
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
          <View className="px-5 mt-8">
            <TouchableOpacity
              className="flex-row items-center justify-center py-4 bg-red-50 rounded-xl"
              onPress={onLogout}
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
}
