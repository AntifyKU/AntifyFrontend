import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  Alert,
  Linking,
  Platform,
  AppState,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";
import * as IntentLauncher from "expo-intent-launcher";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { ScreenHeader } from "@/components/molecule/ScreenHeader";
import { MenuItem } from "@/components/atom/MenuItem";

type PrivacyScreen = "main" | "data-usage";

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

const colorMap = {
  blue: { bg: "bg-blue-50", text: "text-blue-700" },
  green: { bg: "bg-green-50", text: "text-green-700" },
  red: { bg: "bg-red-50", text: "text-red-700" },
};

const InfoCard = ({ content, color }: InfoCardProps) => {
  const { bg, text } = colorMap[color];
  return (
    <View className={`${bg} rounded-2xl p-5`}>
      <Text className={`text-base ${text} leading-6`}>{content}</Text>
    </View>
  );
};

export default function PrivacySecurityScreen() {
  const { t } = useTranslation();
  const [currentScreen, setCurrentScreen] = useState<PrivacyScreen>("main");
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [isCheckingPermission, setIsCheckingPermission] = useState(false);

  const checkLocationPermission = useCallback(async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      setLocationEnabled(status === "granted");
    } catch (error) {
      console.error("Error checking location permission:", error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      checkLocationPermission();
    }, [checkLocationPermission]),
  );

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active" && currentScreen === "main") {
        checkLocationPermission();
      }
    });
    return () => subscription.remove();
  }, [currentScreen, checkLocationPermission]);

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
      Alert.alert(t("common.error"), t("privacy.location.errorOpening"));
    }
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
        {
          text: t("common.openSettings"),
          onPress: () => {
            openAppSettings();
          },
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
            locationEnabled ? handleDisableLocation : handleEnableLocation
          }
          disabled={isCheckingPermission}
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

  const screenTitle =
    currentScreen === "data-usage"
      ? t("privacy.dataUsage.menuTitle")
      : t("privacy.title");

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      <View className="py-6">
        <ScreenHeader
          title={screenTitle}
          leftIcon="chevron-back"
          onLeftPress={() => {
            if (currentScreen === "main") router.back();
            else setCurrentScreen("main");
          }}
        />
      </View>

      {currentScreen === "main" && renderMainMenu()}
      {currentScreen === "data-usage" && renderDataUsage()}
    </SafeAreaView>
  );
}
