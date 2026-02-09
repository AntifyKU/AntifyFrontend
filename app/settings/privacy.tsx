import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  Alert,
  Linking,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as IntentLauncher from "expo-intent-launcher";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { ScreenHeader } from "@/components/molecule/ScreenHeader";
import { MenuItem } from "@/components/atom/MenuItem";
import PrimaryButton from "@/components/atom/button/PrimaryButton";

type PrivacyScreen = "main" | "clear-history" | "data-usage";

// sub components
const DataItem = ({ icon, text }: { icon: string; text: string }) => (
  <View className="flex-row items-center mb-3 ml-3">
    <View className="w-8 h-8 rounded-full items-center justify-center mr-3">
      <Ionicons name={icon as any} size={16} color="#22A45D" />
    </View>
    <Text className="text-base text-gray-700 flex-1">{text}</Text>
  </View>
);

const RightItem = ({ text }: { text: string }) => (
  <View className="flex-row items-center mb-3 ml-3">
    <Ionicons name="checkmark-circle-outline" size={20} color="#22A45D" />
    <Text className="text-base text-gray-700 ml-3">{text}</Text>
  </View>
);

const SectionTitle = ({ icon, title }: { icon?: string; title: string }) => (
  <View className="flex-row items-center mb-3">
    {icon && <Ionicons name={icon as any} size={24} color="#22A45D" />}
    <Text className="text-lg font-semibold text-gray-800 ml-2">{title}</Text>
  </View>
);

const InfoCard = ({
  content,
  color,
}: {
  content: string;
  color: "blue" | "green" | "red";
}) => {
  const bgColor =
    color === "blue"
      ? "bg-blue-50"
      : color === "green"
        ? "bg-green-50"
        : "bg-red-50";
  const textColor =
    color === "blue"
      ? "text-blue-700"
      : color === "green"
        ? "text-green-700"
        : "text-red-700";

  return (
    <View className={`${bgColor} rounded-2xl p-5`}>
      <Text className={`text-base ${textColor} leading-6`}>{content}</Text>
    </View>
  );
};

export default function PrivacySecurityScreen() {
  const [currentScreen, setCurrentScreen] = useState<PrivacyScreen>("main");
  const [isClearing, setIsClearing] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [isCheckingPermission, setIsCheckingPermission] = useState(false);

  // Check location permission status
  const checkLocationPermission = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      setLocationEnabled(status === "granted");
      return status === "granted";
    } catch (error) {
      console.error("Error checking location permission:", error);
      return false;
    }
  };

  // Initial check on mount
  useEffect(() => {
    checkLocationPermission();
  }, []);

  // Check permission when app comes to foreground
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentScreen === "main") {
        checkLocationPermission();
      }
    }, 1000); // Check every second when on main screen

    return () => clearInterval(interval);
  }, [currentScreen]);

  const handleLocationToggle = async (value: boolean) => {
    if (value) {
      // User wants to enable location
      setIsCheckingPermission(true);
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status === "granted") {
          setLocationEnabled(true);
        } else {
          // Permission denied - show alert to go to settings
          setLocationEnabled(false);
          Alert.alert(
            "Location Permission Required",
            "Please enable location access in Settings to use this feature.",
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
        console.error("Error requesting location permission:", error);
        setLocationEnabled(false);
      } finally {
        setIsCheckingPermission(false);
      }
    } else {
      // User wants to disable location - show alert to go to settings
      Alert.alert(
        "Disable Location Access",
        "To turn off location access, please go to Settings and change the permission.",
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
        const pkg = "com.antify.antifyApp"; // package
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

  const handleClearHistory = () => {
    setCurrentScreen("clear-history");
  };

  const handleDataUsage = () => {
    setCurrentScreen("data-usage");
  };

  const confirmClearHistory = async () => {
    Alert.alert(
      "Clear History",
      "Are you sure you want to clear all your search and scan history? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            setIsClearing(true);
            try {
              await AsyncStorage.multiRemove([
                "searchHistory",
                "scanHistory",
                "recentSearches",
                "recentScans",
                "browsingHistory",
              ]);

              Alert.alert(
                "Success",
                "Your history has been cleared successfully.",
                [
                  {
                    text: "OK",
                    onPress: () => setCurrentScreen("main"),
                  },
                ],
              );
            } catch (error) {
              console.error("Error clearing history:", error);
              Alert.alert(
                "Error",
                "Failed to clear history. Please try again.",
              );
            } finally {
              setIsClearing(false);
            }
          },
        },
      ],
    );
  };

  const renderMainMenu = () => (
    <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
      <View className="py-4">
        {/* Location Permission Toggle */}
        <MenuItem
          icon="location-outline"
          title="Location Permission"
          description={
            locationEnabled
              ? "Show nearby ant species"
              : "Enable to see nearby species"
          }
          iconColor="#22A45D"
          switchValue={locationEnabled}
          onSwitchChange={handleLocationToggle}
          disabled={isCheckingPermission}
        />

        <MenuItem
          icon="trash-outline"
          title="Clear History"
          description="Delete all search and scan history"
          onPress={handleClearHistory}
          iconColor="#22A45D"
        />

        <MenuItem
          icon="information-circle-outline"
          title="Data Usage"
          description="How we use your data"
          onPress={handleDataUsage}
          iconColor="#22A45D"
        />
      </View>
    </ScrollView>
  );

  const renderClearHistory = () => (
    <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
      <View className="py-6">
        <View className="items-center mb-6">
          <View className="w-24 h-24 rounded-full bg-red-50 items-center justify-center">
            <Ionicons name="trash-outline" size={40} color="#EF4444" />
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-800 text-center mb-3">
            Clear All History
          </Text>
          <Text className="text-base text-gray-600 text-center leading-6">
            This will permanently delete all your search history, scan history,
            and recent activity from this device.
          </Text>
        </View>

        <View className="bg-red-50 rounded-2xl p-5 mb-6">
          <View className="flex-row items-start">
            <Ionicons
              name="warning-outline"
              size={24}
              color="#EF4444"
              style={{ marginTop: 2 }}
            />
            <View className="flex-1 ml-3">
              <Text className="text-base font-semibold text-red-800 mb-1">
                This action cannot be undone
              </Text>
              <Text className="text-base text-red-700 leading-5">
                Your saved collection and favorites will not be affected by this
                action.
              </Text>
            </View>
          </View>
        </View>

        <View className="space-y-3">
          <PrimaryButton
            title={isClearing ? "Clearing..." : "Clear All History"}
            onPress={confirmClearHistory}
            disabled={isClearing}
            icon={isClearing ? undefined : "trash-outline"}
            size="large"
            style={{
              backgroundColor: "#EF4444",
              borderColor: "#EF4444",
              borderWidth: 0,
              borderRadius: 12,
              marginBottom: 12,
              shadowColor: "transparent",
            }}
            textStyle={{ color: "#FFFFFF", fontWeight: "600" }}
            iconColor="#FFFFFF"
          />
        </View>
      </View>
    </ScrollView>
  );

  const renderDataUsage = () => (
    <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator>
      <View className="py-6">
        <View className="items-center mb-6">
          <View className="w-24 h-24 rounded-full bg-blue-50 items-center justify-center">
            <Ionicons
              name="shield-checkmark-outline"
              size={40}
              color="#3B82F6"
            />
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-800 text-center mb-3">
            How We Use Your Data
          </Text>
          <Text className="text-base text-gray-600 text-center leading-6">
            Your privacy and data security are our top priorities.
          </Text>
        </View>

        <View className="mb-6">
          <SectionTitle title="Data Storage" />
          <InfoCard
            content="All your personal data is stored securely on your device and in the cloud. We use industry-standard encryption to protect your information. Your photos and scan results are only accessible to you."
            color="blue"
          />
        </View>

        {/* What We Collect */}
        <View className="mb-6">
          <SectionTitle title="What We Collect" />
          <DataItem
            icon="person-outline"
            text="Account information (username, email)"
          />
          <DataItem
            icon="camera-outline"
            text="Photos you upload for identification"
          />
          <DataItem icon="location-outline" text="Location data (if enabled)" />
          <DataItem icon="time-outline" text="App usage and activity" />
        </View>

        {/* How We Use Data */}
        <View className="mb-6">
          <SectionTitle title="How We Use Data" />
          <InfoCard
            content="Your data is used solely to provide and improve our ant identification service. We use your photos to identify species, your location to show nearby ants, and usage data to make the app better."
            color="green"
          />
        </View>

        {/* What We Don't Do */}
        <View className="mb-6">
          <SectionTitle title="What We Don't Do" />
          <InfoCard
            content="We never sell your personal information to third parties. We don't share your data with advertisers. We don't track you across other apps or websites."
            color="red"
          />
        </View>

        {/* Your Rights */}
        <View className="mb-6">
          <SectionTitle title="Your Rights" />
          <RightItem text="Access your data anytime" />
          <RightItem text="Update or correct your information" />
          <RightItem text="Delete your account and all data" />
          <RightItem text="Export your data" />
        </View>

        <View className="items-center py-4">
          <Text className="text-sm text-gray-400">
            Last updated: February 2026
          </Text>
        </View>
      </View>
    </ScrollView>
  );

  const getScreenTitle = () => {
    switch (currentScreen) {
      case "clear-history":
        return "Clear History";
      case "data-usage":
        return "Data Usage";
      default:
        return "Privacy & Security";
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="py-6">
        <ScreenHeader
          title={getScreenTitle()}
          leftIcon="chevron-back"
          onLeftPress={() => {
            if (currentScreen === "main") {
              router.back();
            } else {
              setCurrentScreen("main");
            }
          }}
        />
      </View>

      {/* Content */}
      {currentScreen === "main" && renderMainMenu()}
      {currentScreen === "clear-history" && renderClearHistory()}
      {currentScreen === "data-usage" && renderDataUsage()}
    </SafeAreaView>
  );
}
