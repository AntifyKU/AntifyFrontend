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
import { useTranslation } from "react-i18next";
import { ScreenHeader } from "@/components/molecule/ScreenHeader";
import { MenuItem } from "@/components/atom/MenuItem";
import PrimaryButton from "@/components/atom/button/PrimaryButton";

type PrivacyScreen = "main" | "clear-history" | "data-usage";

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

interface InfoCardProps {
  content: string;
  color: "blue" | "green" | "red";
}

const InfoCard = ({ content, color }: InfoCardProps) => {
  const getBgColor = () => {
    if (color === "blue") return "bg-blue-50";
    if (color === "green") return "bg-green-50";
    return "bg-red-50";
  };

  const getTextColor = () => {
    if (color === "blue") return "text-blue-700";
    if (color === "green") return "text-green-700";
    return "text-red-700";
  };

  const bgColor = getBgColor();
  const textColor = getTextColor();

  return (
    <View className={`${bgColor} rounded-2xl p-5`}>
      <Text className={`text-base ${textColor} leading-6`}>{content}</Text>
    </View>
  );
};

export default function PrivacySecurityScreen() {
  const { t } = useTranslation();
  const [currentScreen, setCurrentScreen] = useState<PrivacyScreen>("main");
  const [isClearing, setIsClearing] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [isCheckingPermission, setIsCheckingPermission] = useState(false);

  const checkLocationPermission = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      setLocationEnabled(status === "granted");
    } catch (error) {
      console.error("Error checking location permission:", error);
    }
  };

  useEffect(() => {
    checkLocationPermission();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentScreen === "main") checkLocationPermission();
    }, 1000);
    return () => clearInterval(interval);
  }, [currentScreen]);

  const openAppSettings = () => {
    const open = async () => {
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
        Alert.alert(t("common.error"), t("privacy.location.errorOpening"));
      }
    };
    open();
  };

  const handleEnableLocation = async () => {
    setIsCheckingPermission(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        setLocationEnabled(true);
      } else {
        setLocationEnabled(false);
        Alert.alert(
          t("privacy.location.permissionTitle"),
          t("privacy.location.permissionMessage"),
          [
            { text: t("common.cancel"), style: "cancel" },
            { text: t("common.openSettings"), onPress: openAppSettings },
          ],
        );
      }
    } catch (error) {
      console.error("Error requesting location permission:", error);
      setLocationEnabled(false);
    } finally {
      setIsCheckingPermission(false);
    }
  };

  const handleDisableLocation = () => {
    Alert.alert(
      t("privacy.location.disableTitle"),
      t("privacy.location.disableMessage"),
      [
        { text: t("common.cancel"), style: "cancel" },
        { text: t("common.openSettings"), onPress: openAppSettings },
      ],
    );
  };

  const handleClearHistorySuccess = () => {
    Alert.alert(
      t("privacy.clearHistory.successTitle"),
      t("privacy.clearHistory.successMessage"),
      [
        {
          text: t("common.ok"),
          onPress: () => setCurrentScreen("main"),
        },
      ],
    );
  };

  const handleClearHistoryError = (error: any) => {
    console.error("Error clearing history:", error);
    Alert.alert(t("common.error"), t("privacy.clearHistory.errorMessage"));
  };

  const performClearHistory = () => {
    setIsClearing(true);
    AsyncStorage.multiRemove([
      "searchHistory",
      "scanHistory",
      "recentSearches",
      "recentScans",
      "browsingHistory",
    ])
      .then(handleClearHistorySuccess)
      .catch(handleClearHistoryError)
      .finally(() => {
        setIsClearing(false);
      });
  };

  const confirmClearHistory = async () => {
    Alert.alert(
      t("privacy.clearHistory.confirmTitle"),
      t("privacy.clearHistory.confirmMessage"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.clearAll"),
          style: "destructive",
          onPress: performClearHistory,
        },
      ],
    );
  };

  const renderMainMenu = () => (
    <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
      <View className="py-4">
        <MenuItem
          icon="location-outline"
          title={t("privacy.location.title")}
          description={
            locationEnabled
              ? t("privacy.location.enabled")
              : t("privacy.location.disabled")
          }
          iconColor="#22A45D"
          switchValue={locationEnabled}
          onSwitchChange={
            locationEnabled
              ? () => {
                  handleDisableLocation();
                }
              : () => {
                  handleEnableLocation();
                }
          }
          disabled={isCheckingPermission}
        />
        <MenuItem
          icon="trash-outline"
          title={t("privacy.clearHistory.menuTitle")}
          description={t("privacy.clearHistory.menuDescription")}
          onPress={() => setCurrentScreen("clear-history")}
          iconColor="#22A45D"
        />
        <MenuItem
          icon="information-circle-outline"
          title={t("privacy.dataUsage.menuTitle")}
          description={t("privacy.dataUsage.menuDescription")}
          onPress={() => setCurrentScreen("data-usage")}
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
            {t("privacy.clearHistory.screenTitle")}
          </Text>
          <Text className="text-base text-gray-600 text-center leading-6">
            {t("privacy.clearHistory.screenDescription")}
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
                {t("privacy.clearHistory.warningTitle")}
              </Text>
              <Text className="text-base text-red-700 leading-5">
                {t("privacy.clearHistory.warningMessage")}
              </Text>
            </View>
          </View>
        </View>

        <PrimaryButton
          title={
            isClearing
              ? t("privacy.clearHistory.clearingButton")
              : t("privacy.clearHistory.clearButton")
          }
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
            {t("privacy.dataUsage.screenTitle")}
          </Text>
          <Text className="text-base text-gray-600 text-center leading-6">
            {t("privacy.dataUsage.screenDescription")}
          </Text>
        </View>

        <View className="mb-6">
          <SectionTitle title={t("privacy.dataUsage.storage.title")} />
          <InfoCard
            content={t("privacy.dataUsage.storage.content")}
            color="blue"
          />
        </View>

        <View className="mb-6">
          <SectionTitle title={t("privacy.dataUsage.whatWeCollect.title")} />
          <DataItem
            icon="person-outline"
            text={t("privacy.dataUsage.whatWeCollect.account")}
          />
          <DataItem
            icon="camera-outline"
            text={t("privacy.dataUsage.whatWeCollect.photos")}
          />
          <DataItem
            icon="location-outline"
            text={t("privacy.dataUsage.whatWeCollect.location")}
          />
          <DataItem
            icon="time-outline"
            text={t("privacy.dataUsage.whatWeCollect.usage")}
          />
        </View>

        <View className="mb-6">
          <SectionTitle title={t("privacy.dataUsage.howWeUse.title")} />
          <InfoCard
            content={t("privacy.dataUsage.howWeUse.content")}
            color="green"
          />
        </View>

        <View className="mb-6">
          <SectionTitle title={t("privacy.dataUsage.whatWeDont.title")} />
          <InfoCard
            content={t("privacy.dataUsage.whatWeDont.content")}
            color="red"
          />
        </View>

        <View className="mb-6">
          <SectionTitle title={t("privacy.dataUsage.yourRights.title")} />
          <RightItem text={t("privacy.dataUsage.yourRights.access")} />
          <RightItem text={t("privacy.dataUsage.yourRights.update")} />
          <RightItem text={t("privacy.dataUsage.yourRights.delete")} />
          <RightItem text={t("privacy.dataUsage.yourRights.export")} />
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
        return t("privacy.clearHistory.menuTitle");
      case "data-usage":
        return t("privacy.dataUsage.menuTitle");
      default:
        return t("privacy.title");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      <View className="py-6">
        <ScreenHeader
          title={getScreenTitle()}
          leftIcon="chevron-back"
          onLeftPress={() => {
            if (currentScreen === "main") router.back();
            else setCurrentScreen("main");
          }}
        />
      </View>

      {currentScreen === "main" && renderMainMenu()}
      {currentScreen === "clear-history" && renderClearHistory()}
      {currentScreen === "data-usage" && renderDataUsage()}
    </SafeAreaView>
  );
}
