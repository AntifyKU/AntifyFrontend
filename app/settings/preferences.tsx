import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  Linking,
  Platform,
  AppState,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import * as Notifications from "expo-notifications";
import * as IntentLauncher from "expo-intent-launcher";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/services/auth";
import { ScreenHeader } from "@/components/molecule/ScreenHeader";
import { MenuItem } from "@/components/atom/MenuItem";
import { PREFS_STORAGE_KEY } from "@/public/i18n";

type Language = "english" | "thai";

interface AppPreferences {
  language: Language;
  notifications_enabled: boolean;
}

const DEFAULT_PREFS: AppPreferences = {
  language: "english",
  notifications_enabled: true,
};

interface OptionButtonProps {
  readonly label: string;
  readonly selected: boolean;
  readonly onPress: () => void;
}

function OptionButton({ label, selected, onPress }: OptionButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={1}
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
}

export default function PreferencesScreen() {
  const { user, token, refreshUser } = useAuth();
  const { t, i18n } = useTranslation();

  const [language, setLanguage] = useState<Language>(DEFAULT_PREFS.language);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isCheckingPermission, setIsCheckingPermission] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        if (user?.preferences) {
          const serverPrefs = user.preferences as AppPreferences;
          setLanguage(serverPrefs.language ?? DEFAULT_PREFS.language);
          await AsyncStorage.setItem(
            PREFS_STORAGE_KEY,
            JSON.stringify(serverPrefs),
          );
        } else {
          const stored = await AsyncStorage.getItem(PREFS_STORAGE_KEY);
          if (stored) {
            const parsed: AppPreferences = JSON.parse(stored);
            setLanguage(parsed.language ?? DEFAULT_PREFS.language);
          }
        }
      } catch (error) {
        console.error("Error loading preferences:", error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadPreferences();
  }, [user]);

  const checkNotificationPermission = useCallback(async () => {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      setNotificationsEnabled(status === "granted");
    } catch (error) {
      console.error("Error checking notification permission:", error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      checkNotificationPermission();
    }, [checkNotificationPermission]),
  );

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active") {
        checkNotificationPermission();
      }
    });
    return () => subscription.remove();
  }, [checkNotificationPermission]);

  const persistPreferences = async (updated: Partial<AppPreferences>) => {
    try {
      const stored = await AsyncStorage.getItem(PREFS_STORAGE_KEY);
      const current: AppPreferences = stored
        ? JSON.parse(stored)
        : DEFAULT_PREFS;
      const merged: AppPreferences = { ...current, ...updated };

      await AsyncStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(merged));

      if (token) {
        await authService.updateProfile(token, { preferences: merged });
        await refreshUser();
      }
    } catch (error) {
      console.error("Error saving preferences:", error);
    }
  };

  const handleLanguageChange = async (lang: Language) => {
    setLanguage(lang);
    i18n.changeLanguage(lang === "thai" ? "th" : "en");
    await persistPreferences({ language: lang });
  };

  const openAppSettings = async () => {
    try {
      if (Platform.OS === "ios") {
        await Linking.openURL("app-settings:");
      } else {
        await IntentLauncher.startActivityAsync(
          IntentLauncher.ActivityAction.APPLICATION_DETAILS_SETTINGS,
          { data: "package:com.antify.antifyApp" },
        );
      }
    } catch (error) {
      console.error("Error opening settings:", error);
      Alert.alert(
        t("common.error"),
        t("preferences.notifications.errorOpening"),
      );
    }
  };

  const handleEnableNotifications = async () => {
    setIsCheckingPermission(true);
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === "granted") {
        setNotificationsEnabled(true);
        await persistPreferences({ notifications_enabled: true });
      } else {
        setNotificationsEnabled(false);
        Alert.alert(
          t("preferences.notifications.permissionTitle"),
          t("preferences.notifications.permissionMessage"),
          [
            { text: t("common.cancel"), style: "cancel" },
            {
              text: t("common.openSettings"),
              onPress: () => {
                openAppSettings();
              },
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
  };

  const handleDisableNotifications = () => {
    Alert.alert(
      t("preferences.notifications.disableTitle"),
      t("preferences.notifications.disableMessage"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.openSettings"),
          onPress: () => {
            openAppSettings();
          },
        },
      ],
    );
  };

  if (!isLoaded) return null;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      <View className="py-6">
        <ScreenHeader
          title={t("preferences.title")}
          leftIcon="chevron-back"
          onLeftPress={() => router.back()}
        />
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {/* Language Section */}
        <View className="py-6 border-b border-gray-100">
          <View className="flex-row items-center mb-4">
            <Ionicons name="language-outline" size={24} color="#22A45D" />
            <Text className="text-lg font-semibold text-gray-800 ml-3">
              {t("preferences.language.title")}
            </Text>
          </View>
          <View className="flex-row gap-3">
            <OptionButton
              label={t("preferences.language.english")}
              selected={language === "english"}
              onPress={() => handleLanguageChange("english")}
            />
            <OptionButton
              label={t("preferences.language.thai")}
              selected={language === "thai"}
              onPress={() => handleLanguageChange("thai")}
            />
          </View>
        </View>

        {/* Notifications Section */}
        <MenuItem
          icon="notifications-outline"
          title={t("preferences.notifications.title")}
          description={
            notificationsEnabled
              ? t("preferences.notifications.enabled")
              : t("preferences.notifications.disabled")
          }
          iconColor="#22A45D"
          switchValue={notificationsEnabled}
          onSwitchChange={
            notificationsEnabled
              ? handleDisableNotifications
              : handleEnableNotifications
          }
          disabled={isCheckingPermission}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
