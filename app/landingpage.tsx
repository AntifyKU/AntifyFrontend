import React, { useEffect } from "react";
import { View, Image } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    const checkFlow = async () => {
      const IS_DEBUG = false;

      if (IS_DEBUG) {
        await AsyncStorage.removeItem("hasSeenOnboarding");
      }

      const hasSeen = await AsyncStorage.getItem("hasSeenOnboarding");

      setTimeout(() => {
        if (hasSeen === "true") {
          router.replace("/(tabs)");
        } else {
          router.replace("/onboarding");
        }
      }, 2000);
    };

    checkFlow();
  }, [router]);

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Image
        source={require("../assets/images/icon.png")}
        style={{ width: 160, height: 160 }}
      />
    </View>
  );
}
