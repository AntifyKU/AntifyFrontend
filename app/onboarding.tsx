import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PrimaryButton from "@/components/atom/PrimaryButton";

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

const slides = [
  {
    iconName: "camera-outline" as const,
    title: "Identify Ant Species",
    description:
      "Upload photos to instantly identify ant species with AI-powered image classification.",
  },
  {
    iconName: "location-outline" as const,
    title: "Discover Local Ants",
    description:
      "Explore ant species commonly found in your area with location-based discovery.",
  },
  {
    iconName: "book-outline" as const,
    title: "Learn & Stay Updated",
    description:
      "Access comprehensive information about ant biology and ecology.",
  },
  {
    iconName: "chatbubbles-outline" as const,
    title: "Get Expert Guidance",
    description: "Chat with our intelligent assistant for instant support.",
  },
];

export default function Onboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

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
          <Text className="text-base font-medium text-[#0A9D5C]">Skip</Text>
        </Pressable>
      )}

      <OnboardingSlide {...slides[currentSlide]} />

      <View className="flex-row justify-center mb-8">
        {slides.map((_, index) => (
          <View
            key={index}
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
            <PrimaryButton title="Next" onPress={handleNext} size="large" />
            {currentSlide > 0 && (
              <Pressable
                onPress={handleBack}
                className="py-3 mt-2"
                style={({ pressed }) => pressed && { opacity: 0.6 }}
              >
                <Text className="text-gray-500 text-center text-base font-medium">
                  Back
                </Text>
              </Pressable>
            )}
          </>
        ) : (
          <>
            <PrimaryButton
              title="Get Started"
              onPress={handleGetStarted}
              size="large"
            />
            <Pressable
              onPress={handleSkip}
              className="py-3 mt-2"
              style={({ pressed }) => pressed && { opacity: 0.6 }}
            >
              <Text className="text-gray-500 text-center text-base font-medium">
                Skip for Now
              </Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}
