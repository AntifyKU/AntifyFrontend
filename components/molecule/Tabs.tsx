import React from "react";
import { View, TouchableOpacity, Dimensions } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import TabItem from "../atom/TabItems";

const { width } = Dimensions.get("window");

export default function Tabs({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  const tabs = [
    { name: "Home", label: "Home", icon: "home" },
    { name: "explore", label: "Explore", icon: "compass" },
    { name: "camera", label: "", icon: "camera" },
    { name: "collection", label: "Collection", icon: "folder" },
    { name: "me", label: "Me", icon: "person" },
  ];

  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: "#fff",
        height: 70 + insets.bottom,
        paddingBottom: insets.bottom / 2,
        width,
        position: "absolute",
        bottom: 0,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 10,
      }}
    >
      {tabs.map((tab, index) => {
        const isFocused = state.index === index;

        if (tab.name === "camera") {
          return (
            <View
              key="camera"
              style={{
                flex: 1,
                alignItems: "center",
                top: -20,
              }}
            >
              <TouchableOpacity
                onPress={() => navigation.navigate("camera")}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={["#9CB35E", "#008236"]}
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 32,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="camera" size={36} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          );
        }

        return (
          <TabItem
            key={tab.name}
            label={tab.label}
            icon={tab.icon}
            active={isFocused}
            onPress={() => navigation.navigate(tab.name)}
          />
        );
      })}
    </View>
  );
}
