import React, { useEffect, useRef } from "react";
import { View, Animated, Image } from "react-native";
import { useRouter } from "expo-router";

export default function LandingPage() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.delay(1000),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // if user is logged in, navigate to Home, else to Login
      // now simply navigate to LoginPage
      router.replace("/(pages)/login");
    });
  }, [fadeAnim, router]);

  return (
    <View className="flex-1 bg-white items-center justify-center">
      <Animated.View style={{ opacity: fadeAnim }}>
        <Image
          source={require("../../assets/images/icon.png")}
          style={{ width: 200, height: 200 }}
        />
      </Animated.View>
    </View>
  );
}
