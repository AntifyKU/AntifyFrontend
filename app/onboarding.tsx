import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PrimaryButton from "@/components/atom/button/PrimaryButton";
import { useTranslation } from "react-i18next";

type OnboardingSlideProps = {
  iconName: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
};

const OnboardingSlide = ({
  iconName,
  title,
  description,
}: OnboardingSlideProps) => (
  <View className="flex-1 items-center justify-center px-8">
    <View className="w-32 h-32 rounded-full bg-[#0A9D5C] items-center justify-center mb-10">
      <Ionicons name={iconName} size={64} color="#FFFFFF" />
    </View>
    <Text className="text-2xl font-bold text-gray-800 mb-4 text-center">
      {title}
    </Text>
    <Text className="text-base text-gray-600 text-center leading-6">
      {description}
    </Text>
  </View>
);

export default function Onboarding() {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

  const slides = [
    {
      iconName: "camera-outline" as const,
      title: t("onboarding.slides.identify.title"),
      description: t("onboarding.slides.identify.description"),
    },
    {
      iconName: "location-outline" as const,
      title: t("onboarding.slides.discover.title"),
      description: t("onboarding.slides.discover.description"),
    },
    {
      iconName: "book-outline" as const,
      title: t("onboarding.slides.learn.title"),
      description: t("onboarding.slides.learn.description"),
    },
    {
      iconName: "chatbubbles-outline" as const,
      title: t("onboarding.slides.expert.title"),
      description: t("onboarding.slides.expert.description"),
    },
  ];

  const completeOnboarding = async (
    targetPath: "/(tabs)" | "/(auth)/login",
  ) => {
    await AsyncStorage.setItem("hasSeenOnboarding", "true");
    router.replace(targetPath);
  };

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    completeOnboarding("/(tabs)");
  };

  const handleGetStarted = () => {
    completeOnboarding("/(auth)/login");
  };

  return (
    <View className="flex-1 bg-white">
      {currentSlide < slides.length - 1 && (
        <Pressable
          onPress={handleSkip}
          className="absolute top-20 right-8 z-10"
          style={({ pressed }) => pressed && { opacity: 0.6 }}
        >
          <Text className="text-base font-medium text-[#0A9D5C]">
            {t("onboarding.skip")}
          </Text>
        </Pressable>
      )}

      <OnboardingSlide {...slides[currentSlide]} />

      <View className="flex-row justify-center mb-8">
        {slides.map((slide, index) => (
          <View
            key={slide.title}
            className="h-2 rounded-full mx-1"
            style={{
              width: index === currentSlide ? 32 : 8,
              backgroundColor: index === currentSlide ? "#0A9D5C" : "#D1D5DB",
            }}
          />
        ))}
      </View>

      <View className="px-8 pb-12">
        {currentSlide < slides.length - 1 ? (
          <>
            <PrimaryButton 
              title={t("onboarding.next")} 
              onPress={handleNext} 
              size="large" 
            />
            {currentSlide > 0 && (
              <Pressable
                onPress={handleBack}
                className="py-3 mt-2"
                style={({ pressed }) => pressed && { opacity: 0.6 }}
              >
                <Text className="text-gray-500 text-center text-base font-medium">
                  {t("onboarding.back")}
                </Text>
              </Pressable>
            )}
          </>
        ) : (
          <>
            <PrimaryButton
              title={t("onboarding.get_started")}
              onPress={handleGetStarted}
              size="large"
            />
            <Pressable
              onPress={handleSkip}
              className="py-3 mt-2"
              style={({ pressed }) => pressed && { opacity: 0.6 }}
            >
              <Text className="text-gray-500 text-center text-base font-medium">
                {t("onboarding.skip_for_now")}
              </Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}