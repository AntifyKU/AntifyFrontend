import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Modal,
  Alert,
  Image,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "@/components/molecule/ScreenHeader";
import PrimaryButton from "@/components/atom/button/PrimaryButton";
import { MenuItem } from "@/components/atom/MenuItem";

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

const AUTH_MENU = [
  {
    id: "1",
    title: "Account",
    icon: "person-outline",
    route: "/settings/account",
  },
  {
    id: "2",
    title: "App Preferences",
    icon: "globe-outline",
    route: "/settings/preferences",
  },
  {
    id: "3",
    title: "Privacy & Security",
    icon: "shield-outline",
    route: "/settings/privacy",
  },
  {
    id: "4",
    title: "Support & Info",
    icon: "help-circle-outline",
    route: "/settings/support",
  },
];

const GUEST_MENU = [
  {
    id: "2",
    title: "App Preferences",
    icon: "globe-outline",
    route: "/settings/preferences",
  },
  {
    id: "3",
    title: "Privacy & Security",
    icon: "shield-outline",
    route: "/settings/privacy",
  },
  {
    id: "4",
    title: "Support & Info",
    icon: "help-circle-outline",
    route: "/settings/support",
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
  const menuItems = isAuthenticated ? AUTH_MENU : GUEST_MENU;

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
            onPress={isAuthenticated ? onProfilePicturePress : undefined}
            disabled={isUploadingPhoto || !isAuthenticated}
            className="relative"
          >
            {isUploadingPhoto ? (
              <View className="w-28 h-28 rounded-full bg-gray-200 items-center justify-center">
                <ActivityIndicator size="large" color="#0A9D5C" />
              </View>
            ) : isAuthenticated && user?.profile_picture ? (
              <Image
                source={{ uri: user.profile_picture }}
                className="w-28 h-28 rounded-full"
              />
            ) : isAuthenticated ? (
              <View className="w-28 h-28 items-center justify-center">
                <FontAwesome name="user-circle" size={96} color="#90A1B9" />
              </View>
            ) : (
              <View className="w-24 h-24 rounded-full bg-[#0A9D5C] items-center justify-center mb-2">
                <Ionicons name="leaf" size={42} color="#FFFFFF" />
              </View>
            )}

            {isAuthenticated && !isUploadingPhoto && (
              <View
                style={{ width: 32, height: 32, borderRadius: 16 }}
                className="absolute bottom-0 right-0 bg-[#0A9D5C] items-center justify-center"
              >
                <Ionicons name="pencil" size={14} color="#FFFFFF" />
              </View>
            )}
          </TouchableOpacity>

          <Text className="mt-4 text-xl font-semibold text-gray-800">
            {isAuthenticated ? user?.username || "User" : "Guest User"}
          </Text>
        </View>

        {/* Menu Items */}
        <View className="px-6 mt-4">
          {menuItems.map((item) => (
            <MenuItem
              key={item.id}
              icon={item.icon as any}
              title={item.title}
              onPress={() => {
                if (item.route) {
                  onClose();
                  router.push(item.route as any);
                } else {
                  Alert.alert(
                    "Coming Soon",
                    `${item.title} will be available soon.`,
                  );
                }
              }}
            />
          ))}
        </View>

        {/* Login / Logout */}
        <View className="px-6 mt-8">
          {isAuthenticated ? (
            <PrimaryButton
              title="Log Out"
              onPress={onLogout}
              icon="log-out-outline"
              size="large"
              variant="outlined"
              style={{
                backgroundColor: "#FEF2F2",
                borderRadius: 12,
                borderColor: "transparent",
              }}
              textStyle={{ color: "#EF4444", fontWeight: "600" }}
              iconColor="#EF4444"
            />
          ) : (
            <PrimaryButton
              title="Log In"
              onPress={() => {
                onClose();
                router.push("/(auth)/login");
              }}
              icon="log-in-outline"
              size="large"
              style={{ shadowColor: "transparent", borderRadius: 12 }}
              textStyle={{ color: "#FFFFFF", fontWeight: "600" }}
              iconColor="#FFFFFF"
            />
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
}
