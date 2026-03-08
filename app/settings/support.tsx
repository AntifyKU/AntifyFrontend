import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  Linking,
  Alert,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Constants from "expo-constants";
import { useTranslation } from "react-i18next";
import { ScreenHeader } from "@/components/molecule/ScreenHeader";
import { MenuItem } from "@/components/atom/MenuItem";
import { Section } from "@/components/atom/Section";

type SupportScreen = "main" | "about" | "howto" | "contact" | "terms";

const FeatureItem = ({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) => (
  <View className="flex-row mb-4">
    <View className="w-10 h-10 rounded-full bg-[#E8F5E9] items-center justify-center mr-3">
      <Ionicons name={icon as any} size={20} color="#22A45D" />
    </View>
    <View className="flex-1">
      <Text className="text-base font-semibold text-gray-800">{title}</Text>
      <Text className="text-base text-gray-600 mt-1">{description}</Text>
    </View>
  </View>
);

const StepItem = ({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) => (
  <View className="mb-6">
    <View className="flex-row items-center mb-2">
      <Ionicons name={icon as any} size={24} color="#22A45D" />
      <Text className="text-lg font-semibold text-gray-800 ml-2">{title}</Text>
    </View>
    <Text className="text-base text-gray-600 leading-6 ml-8">
      {description}
    </Text>
  </View>
);

const TipItem = ({ text }: { text: string }) => (
  <View className="flex-row items-start mb-2">
    <Text className="text-[#22A45D] mr-2">•</Text>
    <Text className="text-base text-gray-700 flex-1">{text}</Text>
  </View>
);

export default function SupportInfoScreen() {
  const { t } = useTranslation();
  const [currentScreen, setCurrentScreen] = useState<SupportScreen>("main");
  const appVersion = Constants.expoConfig?.version || "1.0.0";
  const email = "antifyapplication@gmail.com";

  const handleContactEmail = () => {
    const open = async () => {
      const url = `mailto:${email}`;
      const canOpen = await Linking.canOpenURL(url);
      if (!canOpen) {
        Alert.alert(
          t("support.contact.email.errorTitle"),
          t("support.contact.email.errorMessage"),
        );
        return;
      }
      await Linking.openURL(url);
    };
    open();
  };

  const renderMainMenu = () => (
    <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator>
      <View className="py-4">
        <MenuItem
          icon="information-circle-outline"
          title={t("support.menu.about.title")}
          description={t("support.menu.about.description")}
          onPress={() => setCurrentScreen("about")}
          iconColor="#22A45D"
        />
        <MenuItem
          icon="help-circle-outline"
          title={t("support.menu.howto.title")}
          description={t("support.menu.howto.description")}
          onPress={() => setCurrentScreen("howto")}
          iconColor="#22A45D"
        />
        <MenuItem
          icon="mail-outline"
          title={t("support.menu.contact.title")}
          description={t("support.menu.contact.description")}
          onPress={() => setCurrentScreen("contact")}
          iconColor="#22A45D"
        />
        <MenuItem
          icon="document-text-outline"
          title={t("support.menu.terms.title")}
          description={t("support.menu.terms.description")}
          onPress={() => setCurrentScreen("terms")}
          iconColor="#22A45D"
        />

        <View className="mt-8 mb-6 rounded-2xl p-6 items-center">
          <Image
            source={require("@/assets/images/icon.png")}
            style={{ width: 140, height: 80 }}
          />
          <Text className="mt-4 text-base text-gray-500">App Version</Text>
          <Text className="text-xl font-bold text-gray-800 mt-1">
            {appVersion}
          </Text>
        </View>
      </View>
    </ScrollView>
  );

  const renderAbout = () => (
    <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator>
      <View className="py-6">
        <View className="items-center mb-8">
          <View className="w-24 h-24 rounded-full bg-[#22A45D] items-center justify-center mb-4">
            <Ionicons name="leaf" size={48} color="#FFFFFF" />
          </View>
          <Text className="text-2xl font-bold text-gray-800">Antify</Text>
          <Text className="text-base text-gray-500 mt-1">
            {t("support.about.tagline")}
          </Text>
        </View>

        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            {t("support.about.mission.title")}
          </Text>
          <Text className="text-base text-gray-600 leading-6">
            {t("support.about.mission.content")}
          </Text>
        </View>

        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            {t("support.about.features.title")}
          </Text>
          <FeatureItem
            icon="camera-outline"
            title={t("support.about.features.ai.title")}
            description={t("support.about.features.ai.description")}
          />
          <FeatureItem
            icon="book-outline"
            title={t("support.about.features.database.title")}
            description={t("support.about.features.database.description")}
          />
          <FeatureItem
            icon="location-outline"
            title={t("support.about.features.location.title")}
            description={t("support.about.features.location.description")}
          />
          <FeatureItem
            icon="heart-outline"
            title={t("support.about.features.collection.title")}
            description={t("support.about.features.collection.description")}
          />
        </View>

        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            {t("support.about.team.title")}
          </Text>
          <Text className="text-base text-gray-600 leading-6">
            {t("support.about.team.content")}
          </Text>
        </View>

        <View className="items-center py-4 mb-4">
          <Text className="text-sm text-gray-400">
            © 2026 Antify. All rights reserved.
          </Text>
        </View>
      </View>
    </ScrollView>
  );

  const renderHowToUse = () => (
    <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator>
      <View className="py-6">
        <Text className="text-base text-gray-600 mb-6">
          {t("support.howto.intro")}
        </Text>

        <StepItem
          title={t("support.howto.steps.photo.title")}
          description={t("support.howto.steps.photo.description")}
          icon="camera-outline"
        />
        <StepItem
          title={t("support.howto.steps.ai.title")}
          description={t("support.howto.steps.ai.description")}
          icon="sparkles-outline"
        />
        <StepItem
          title={t("support.howto.steps.details.title")}
          description={t("support.howto.steps.details.description")}
          icon="information-circle-outline"
        />
        <StepItem
          title={t("support.howto.steps.save.title")}
          description={t("support.howto.steps.save.description")}
          icon="bookmark-outline"
        />
        <StepItem
          title={t("support.howto.steps.discover.title")}
          description={t("support.howto.steps.discover.description")}
          icon="compass-outline"
        />

        <View className="mt-6 bg-[#E8F5E9] rounded-2xl p-5">
          <View className="flex-row items-center mb-3">
            <Ionicons name="bulb-outline" size={24} color="#22A45D" />
            <Text className="text-lg font-semibold text-gray-800 ml-2">
              {t("support.howto.tips.title")}
            </Text>
          </View>
          <TipItem text={t("support.howto.tips.light")} />
          <TipItem text={t("support.howto.tips.close")} />
          <TipItem text={t("support.howto.tips.angles")} />
          <TipItem text={t("support.howto.tips.location")} />
        </View>
      </View>
    </ScrollView>
  );

  const renderContact = () => (
    <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator>
      <View className="py-6">
        <Text className="text-base text-gray-600 mb-6">
          {t("support.contact.intro")}
        </Text>

        <View className="mb-6">
          <MenuItem
            icon="mail-outline"
            title={t("support.contact.email.title")}
            description={email}
            onPress={handleContactEmail}
            iconColor="#22A45D"
          />
        </View>
      </View>
    </ScrollView>
  );

  const renderTermsPrivacy = () => (
    <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator>
      <View className="py-6">
        {/* Terms of Service */}
        <View className="mb-8">
          <Text className="text-xl font-bold text-green-700 mb-4">
            {t("support.terms.termsTitle")}
          </Text>
          <Section
            title={t("support.terms.sections.acceptance.title")}
            content={t("support.terms.sections.acceptance.content")}
          />
          <Section
            title={t("support.terms.sections.use.title")}
            content={t("support.terms.sections.use.content")}
          />
          <Section
            title={t("support.terms.sections.userContent.title")}
            content={t("support.terms.sections.userContent.content")}
          />
          <Section
            title={t("support.terms.sections.aiAccuracy.title")}
            content={t("support.terms.sections.aiAccuracy.content")}
          />
          <Section
            title={t("support.terms.sections.termination.title")}
            content={t("support.terms.sections.termination.content")}
          />
        </View>

        {/* Privacy Policy */}
        <View className="mb-8">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            {t("support.terms.privacyTitle")}
          </Text>
          <Section
            title={t("support.terms.sections.infoCollect.title")}
            content={t("support.terms.sections.infoCollect.content")}
          />
          <Section
            title={t("support.terms.sections.infoUse.title")}
            content={t("support.terms.sections.infoUse.content")}
          />
          <Section
            title={t("support.terms.sections.dataStorage.title")}
            content={t("support.terms.sections.dataStorage.content")}
          />
          <Section
            title={t("support.terms.sections.dataSharing.title")}
            content={t("support.terms.sections.dataSharing.content")}
          />
          <Section
            title={t("support.terms.sections.yourRights.title")}
            content={t("support.terms.sections.yourRights.content")}
          />
          <Section
            title={t("support.terms.sections.locationData.title")}
            content={t("support.terms.sections.locationData.content")}
          />
        </View>

        <View className="items-center py-4 mb-4">
          <Text className="text-sm text-gray-400">
            Last updated: February 2026
          </Text>
        </View>

        <View className="rounded-2xl p-5 mb-6">
          <Text className="text-base text-gray-600 text-center">
            {t("support.terms.contactPrompt")}
          </Text>
          <Text
            className="text-base text-[#22A45D] font-semibold text-center mt-2"
            onPress={handleContactEmail}
          >
            {t("support.terms.contactLink", { email })}
          </Text>
        </View>
      </View>
    </ScrollView>
  );

  const getScreenTitle = () => {
    switch (currentScreen) {
      case "about":
        return t("support.about.title");
      case "howto":
        return t("support.menu.howto.title");
      case "contact":
        return t("support.contact.title");
      case "terms":
        return t("support.terms.title");
      default:
        return t("support.title");
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
      {currentScreen === "about" && renderAbout()}
      {currentScreen === "howto" && renderHowToUse()}
      {currentScreen === "contact" && renderContact()}
      {currentScreen === "terms" && renderTermsPrivacy()}
    </SafeAreaView>
  );
}
