import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";

export default function ChatbotButton() {
  const router = useRouter();
  const pathname = usePathname();

  const hiddenRoutes = [
    "/landingpage",
    "/profile",
    "/onboarding",
    "/identification-results",
    "/help-improve-ai",
    "/login",
    "/signup",
    "/forgotpassword",
  ];

  if (hiddenRoutes.includes(pathname) || pathname.startsWith("/detail"))
    return null;

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => router.push("/chatbot")}
    >
      <Ionicons name="chatbubble-ellipses" size={26} color="white" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    bottom: 128,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#0A9D5C",
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#0A9D5C",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
});
