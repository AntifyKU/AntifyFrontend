import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  Linking,
  Platform,
  useColorScheme,
  Appearance,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Notifications from "expo-notifications";
import * as IntentLauncher from "expo-intent-launcher";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/services/auth";
import { ScreenHeader } from "@/components/molecule/ScreenHeader";
import { MenuItem } from "@/components/atom/MenuItem";
import PrimaryButton from "@/components/atom/button/PrimaryButton";

type Language = "english" | "thai";
type Theme = "light" | "dark" | "system";

export default function PreferencesScreen() {
  const { user, token, refreshUser } = useAuth();
  const systemColorScheme = useColorScheme(); // 'light' or 'dark' from system

  // Get current preferences from user
  const currentPrefs = user?.preferences || {
    language: "english",
    theme: "light",
    notifications_enabled: true,
  };

  const [language, setLanguage] = useState<Language>(
    currentPrefs.language as Language,
  );
  const [theme, setTheme] = useState<Theme>(currentPrefs.theme as Theme);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isCheckingPermission, setIsCheckingPermission] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Listen to system theme changes when theme is set to 'system'
  useEffect(() => {
    if (theme === "system") {
      const subscription = Appearance.addChangeListener(({ colorScheme }) => {
        console.log("System theme changed to:", colorScheme);
        // The component will re-render automatically when systemColorScheme changes
      });

      return () => subscription.remove();
    }
  }, [theme]);

  // Check notification permission status
  const checkNotificationPermission = async () => {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      setNotificationsEnabled(status === "granted");
      return status === "granted";
    } catch (error) {
      console.error("Error checking notification permission:", error);
      return false;
    }
  };

  // Initial check on mount
  useEffect(() => {
    checkNotificationPermission();
  }, []);

  // Check permission periodically
  useEffect(() => {
    const interval = setInterval(() => {
      checkNotificationPermission();
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, []);

  const handleNotificationToggle = async (value: boolean) => {
    if (value) {
      // User wants to enable notifications
      setIsCheckingPermission(true);
      try {
        const { status } = await Notifications.requestPermissionsAsync();

        if (status === "granted") {
          setNotificationsEnabled(true);
          // Update user preferences
          if (token) {
            await authService.updateProfile(token, {
              preferences: {
                language,
                theme,
                notifications_enabled: true,
              },
            });
            await refreshUser();
          }
        } else {
          // Permission denied - show alert to go to settings
          setNotificationsEnabled(false);
          Alert.alert(
            "Notification Permission Required",
            "Please enable notifications in Settings to receive updates.",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Open Settings",
                onPress: openAppSettings,
              },
            ],
          );
        }
      } catch (error) {
        console.error("Error requesting notification permission:", error);
        setNotificationsEnabled(false);
      } finally {
        setIsCheckingPermission(false);
      }
    } else {
      // User wants to disable notifications - show alert to go to settings
      Alert.alert(
        "Disable Notifications",
        "To turn off notifications, please go to Settings and change the permission.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Open Settings",
            onPress: openAppSettings,
          },
        ],
      );
    }
  };

  const openAppSettings = async () => {
    try {
      if (Platform.OS === "ios") {
        await Linking.openURL("app-settings:");
      } else {
        const pkg = "com.antify.antifyApp";
        await IntentLauncher.startActivityAsync(
          IntentLauncher.ActivityAction.APPLICATION_DETAILS_SETTINGS,
          {
            data: `package:${pkg}`,
          },
        );
      }
    } catch (error) {
      console.error("Error opening settings:", error);
      Alert.alert(
        "Error",
        "Unable to open settings. Please open Settings manually and find Antify.",
      );
    }
  };

  const handleSavePreferences = async () => {
    if (!token) return;

    setIsSaving(true);
    try {
      await authService.updateProfile(token, {
        preferences: {
          language,
          theme,
          notifications_enabled: notificationsEnabled,
        },
      });
      await refreshUser();
      Alert.alert("Success", "Preferences saved successfully!");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to save preferences");
    } finally {
      setIsSaving(false);
    }
  };

  const OptionButton = ({
    label,
    selected,
    onPress,
  }: {
    label: string;
    selected: boolean;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      className={`flex-1 py-3 rounded-lg items-center ${
        selected ? "bg-[#22A45D]" : "bg-gray-100"
      }`}
      onPress={onPress}
    >
      <Text
        className={`font-medium ${selected ? "text-white" : "text-gray-600"}`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="py-6">
        <ScreenHeader
          title="App Preferences"
          leftIcon="chevron-back"
          onLeftPress={() => router.back()}
        />
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {/* Current Theme Indicator (when system is selected) */}
        {theme === "system" && (
          <View className="mb-4 p-4 rounded-2xl bg-blue-50 flex-row items-center">
            <Ionicons
              name={systemColorScheme === "dark" ? "moon" : "sunny"}
              size={20}
              color="#3B82F6"
            />
            <Text className="ml-3 text-base text-blue-700">
              System theme detected:{" "}
              <Text className="font-semibold">
                {systemColorScheme === "dark" ? "Dark" : "Light"}
              </Text>
            </Text>
          </View>
        )}

        {/* Language Section */}
        <View className="py-6 border-b border-gray-100">
          <View className="flex-row items-center mb-4">
            <Ionicons name="language-outline" size={24} color="#22A45D" />
            <Text className="text-lg font-semibold text-gray-800 ml-3">
              Language
            </Text>
          </View>
          <View className="flex-row gap-3">
            <OptionButton
              label="English"
              selected={language === "english"}
              onPress={() => setLanguage("english")}
            />
            <OptionButton
              label="Thai"
              selected={language === "thai"}
              onPress={() => setLanguage("thai")}
            />
          </View>
        </View>

        {/* Theme Section */}
        <View className="py-6 border-b border-gray-100">
          <View className="flex-row items-center mb-4">
            <Ionicons name="color-palette-outline" size={24} color="#22A45D" />
            <Text className="text-lg font-semibold text-gray-800 ml-3">
              Theme
            </Text>
          </View>
          <View className="flex-row gap-3">
            <OptionButton
              label="Light"
              selected={theme === "light"}
              onPress={() => setTheme("light")}
            />
            <OptionButton
              label="Dark"
              selected={theme === "dark"}
              onPress={() => setTheme("dark")}
            />
            <OptionButton
              label="System"
              selected={theme === "system"}
              onPress={() => setTheme("system")}
            />
          </View>
        </View>

        {/* Notifications Section */}
        <MenuItem
          icon="notifications-outline"
          title="Notifications"
          description={
            notificationsEnabled
              ? "Receive updates about new species"
              : "Enable to receive updates"
          }
          iconColor="#22A45D"
          switchValue={notificationsEnabled}
          onSwitchChange={handleNotificationToggle}
          disabled={isCheckingPermission}
        />

        {/* Save Button */}
        <View className="py-8">
          <PrimaryButton
            title={isSaving ? "Saving..." : "Save Preferences"}
            onPress={handleSavePreferences}
            disabled={isSaving}
            size="large"
            variant="filled"
            style={{
              backgroundColor: isSaving ? "#D1D5DB" : "#22A45D",
              borderRadius: 12,
              shadowColor: "transparent",
              elevation: 0,
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
