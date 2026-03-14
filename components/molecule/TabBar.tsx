import React from "react";
import { View, Text, Dimensions, TouchableOpacity } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { openIdentifySheet } from "@/utils/identifyHelper";

const { width } = Dimensions.get("window");

export default function TabBar({
  state,
  descriptors,
  navigation,
}: Readonly<BottomTabBarProps>) {
  const insets = useSafeAreaInsets();

  const activeColor = "#22A45D";
  const inactiveColor = "#6B7280";

  const visibleRoutes = state.routes.filter(
    (route) => !["index", "collection", "information"].includes(route.name),
  );

  const leftTabs = visibleRoutes.slice(0, 2);
  const rightTabs = visibleRoutes.slice(2, 4);

  const getIconName = (
    routeName: string,
    isFocused: boolean,
  ): keyof typeof Ionicons.glyphMap => {
    switch (routeName) {
      case "index-home":
        return isFocused ? "home" : "home-outline";
      case "explore":
        return isFocused ? "compass" : "compass-outline";
      case "notification":
        return isFocused ? "notifications" : "notifications-outline";
      case "profile":
        return isFocused ? "person" : "person-outline";
      default:
        return "help-circle-outline";
    }
  };

  const renderTab = (route: (typeof state.routes)[0]) => {
    const { options } = descriptors[route.key];
    const label =
      typeof options.tabBarLabel === "string"
        ? options.tabBarLabel
        : options.title || route.name;

    const routeIndex = state.routes.findIndex((r) => r.key === route.key);
    const isFocused = state.index === routeIndex;

    const iconName = getIconName(route.name, isFocused);

    const onPress = () => {
      const event = navigation.emit({
        type: "tabPress",
        target: route.key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name);
      }
    };

    return (
      <TouchableOpacity
        key={route.key}
        onPress={onPress}
        activeOpacity={0.7}
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 12,
        }}
      >
        <Ionicons
          name={iconName}
          size={26}
          color={isFocused ? activeColor : inactiveColor}
          style={{ marginBottom: 4 }}
        />
        <Text
          style={{
            color: isFocused ? activeColor : inactiveColor,
            fontSize: 12,
            fontWeight: isFocused ? "600" : "400",
          }}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ position: "absolute", bottom: 0, width }}>
      {/* Floating Button */}
      <View
        style={{
          position: "absolute",
          top: -30,
          left: width / 2 - 35,
          zIndex: 10,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={openIdentifySheet}
          style={{
            width: 70,
            height: 70,
            borderRadius: 35,
            backgroundColor: "#22A45D",
            justifyContent: "center",
            alignItems: "center",
            elevation: 8,
          }}
        >
          <Ionicons name="camera" size={32} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Tab Bar */}
      <View
        style={{
          flexDirection: "row",
          backgroundColor: "#fff",
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          height: 70 + insets.bottom,
          paddingBottom: insets.bottom,
          borderTopWidth: 1,
          borderTopColor: "#F3F4F6",
        }}
      >
        <View style={{ flex: 2, flexDirection: "row" }}>
          {leftTabs.map(renderTab)}
        </View>

        <View style={{ width: 80 }} />

        <View style={{ flex: 2, flexDirection: "row" }}>
          {rightTabs.map(renderTab)}
        </View>
      </View>
    </View>
  );
}
